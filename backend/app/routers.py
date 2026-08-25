"""
Router endpoints for the API
Will contain:
- /api/health
- /api/libraries
- /api/content
- /api/voice (transcribe + intent)
- /api/search (Vector RAG)
"""
import os

# Load .env into environment (secrets stay hidden) - same pattern as embed_lecture.py
_env_candidates = [
    os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), ".env"),  # project root
    os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".env"),  # backend/
]
for _env_path in _env_candidates:
    if os.path.exists(_env_path):
        for line in open(_env_path, encoding="utf-8"):
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                os.environ.setdefault(k.strip(), v.strip())

import openai
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from app.db import get_db, UILibrary, LectureContent, Embedding, SessionLocal
from app.llm_service import interpret_ambiguous_command, generate_rag_answer

# main.py registers this router with prefix="/api", so paths here have no /api prefix.
router = APIRouter(tags=["search", "intent"])

# PHASE 11: Deepgram real-time STT WebSocket endpoint
# Architecture:
#   Browser microphone
#   → Frontend WebSocket to /ws/stt
#   → Backend receives audio bytes
#   → Backend sends audio to Deepgram streaming STT
#   → Deepgram returns transcript events
#   → Backend sends transcript JSON to client
#
# Approved topology:
#   Browser microphone → Frontend WebSocket → FastAPI backend → Deepgram → FastAPI → Frontend transcript
# DEEPGRAM_API_KEY stays backend-only; never exposed to frontend.

import json
import logging
import asyncio
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from starlette.websockets import WebSocketState
from app.stt_service import (
    get_stt_service,
    initialize_stt_service,
    cleanup_stt_service,
    DeepgramSTTService,
)
from dotenv import load_dotenv

load_dotenv()  # load .env into environment (secrets stay hidden)

logger = logging.getLogger(__name__)

EMBEDDING_MODEL = os.environ.get("OPENAI_EMBEDDING_MODEL", "text-embedding-3-small")

# PHASE 10 Intent classification (PyTorch, CPU-only)
INTENT_CONFIDENCE_THRESHOLD = float(os.environ.get("INTENT_CONFIDENCE_THRESHOLD", "0.6"))

from ml.intent_model import predict_intent


# --- Request/Response models for Intent classification ---

class IntentRequest(BaseModel):
    text: str = Field(..., min_length=1, description="Korean command text to classify")


class IntentResponse(BaseModel):
    text: str
    intent: str
    confidence: float
    below_threshold: bool


# --- Intent classification endpoint ---

@router.post("/intent", response_model=IntentResponse)
def intent(request: IntentRequest):
    """PyTorch Intent Classification.

    text -> local CPU-only PyTorch classifier -> intent label + confidence.

    PHASE 10 is classification only — no routing, no LLM, no RAG.
    confidence >= threshold -> usable intent
    confidence < threshold  -> below_threshold=True (later phase may clarify)
    """
    try:
        prediction = predict_intent(
            request.text, threshold=INTENT_CONFIDENCE_THRESHOLD
        )
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc))
    except FileNotFoundError as exc:
        raise HTTPException(status_code=500, detail=str(exc))
    except Exception as exc:  # e.g. PyTorch model load failure - no fake predictions
        raise HTTPException(status_code=500, detail=f"Intent classification error: {exc}")

    return IntentResponse(
        text=request.text,
        intent=prediction["intent"],
        confidence=prediction["confidence"],
        below_threshold=prediction["below_threshold"],
    )


# --- Request/Response models for Vector RAG search ---

class SearchRequest(BaseModel):
    query: str = Field(..., min_length=1, description="User text query for semantic search")
    top_k: int = Field(3, ge=1, le=10, description="Number of top results to return")


class SearchResult(BaseModel):
    library: str
    library_slug: str
    category: str
    content_id: int
    content_type: str
    title: str
    content: str
    score: float


class SearchResponse(BaseModel):
    query: str
    results: List[SearchResult]


# --- Query embedding generation ---

def get_query_embedding(query: str) -> List[float]:
    """Generate OpenAI embedding for the search query.

    Uses text-embedding-3-small (dimension 1536), matching lecture embedding
    generation in embed_lecture.py. Never stores the query vector. Never
    prints the API key or full vectors.
    """
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key or api_key.lower().startswith("your_"):
        raise HTTPException(status_code=500, detail="OPENAI_API_KEY not configured")

    openai.api_key = api_key
    try:
        response = openai.embeddings.create(model=EMBEDDING_MODEL, input=query)
    except Exception as exc:  # OpenAI API failure - surface clearly, no fake results
        raise HTTPException(status_code=502, detail=f"OpenAI Embedding API error: {exc}")

    return response.data[0].embedding


# --- pgvector similarity search ---

def vector_search(query_embedding: List[float], top_k: int, db: Session) -> list:
    """Run pgvector cosine-distance search against the stored embeddings.

    The comparison happens in PostgreSQL (pgvector <=> operator via
    SQLAlchemy's cosine_distance) - vectors are not loaded into Python.
    Returns rows ordered by ascending cosine distance (most relevant first).
    """
    distance = Embedding.embedding.cosine_distance(query_embedding)
    rows = (
        db.query(Embedding, LectureContent, UILibrary, distance.label("_distance"))
        .join(LectureContent, Embedding.content_id == LectureContent.id)
        .join(UILibrary, LectureContent.library_id == UILibrary.id)
        .order_by(distance)
        .limit(top_k)
        .all()
    )
    return rows


# --- Search endpoint (Vector RAG retrieval) ---

@router.post("/search", response_model=SearchResponse)
def search(request: SearchRequest, db: Session = Depends(get_db)):
    """Vector RAG semantic search endpoint.

    user query -> OpenAI embedding -> pgvector similarity search -> Top-K content

    Responsibilities:
    - OpenAI Embedding: converts the search query to a vector
    - pgvector: compares the query vector against stored vectors
    - Vector RAG: retrieves the most relevant lecture contents

    PHASE 9 is RETRIEVAL ONLY - no LLM is used to choose the answer.
    """
    # 1. Generate one query embedding (text-embedding-3-small, 1536 dim)
    query_embedding = get_query_embedding(request.query)

    # 2. pgvector cosine-distance search (Top-K, most relevant first)
    try:
        rows = vector_search(query_embedding, request.top_k, db)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Database search error: {exc}")

    if not rows:
        raise HTTPException(status_code=404, detail="No relevant lecture contents found for the given query")

    # 3. Build compact result structure
    results = []
    for _, content, library, distance in rows:
        # pgvector cosine distance = 1 - cosine similarity.
        # score below is cosine similarity: higher = more relevant.
        similarity = 1.0 - float(distance)
        results.append(
            SearchResult(
                library=library.name,
                library_slug=library.slug,
                category=library.category,
                content_id=content.id,
                content_type=content.content_type,
                title=content.title,
                content=content.content,
                score=similarity,
            )
        )

    return SearchResponse(query=request.query, results=results)


# --- PHASE 13: LLM assistance for ambiguous/context-dependent commands ---

class LLMInterpretRequest(BaseModel):
    text: str = Field(..., min_length=1, description="Korean command text to interpret")
    context: Optional[Dict[str, Any]] = Field(
        default=None,
        description="Current application context (current_library, previous_library, etc.)"
    )


class LLMInterpretResponse(BaseModel):
    normalized_text: str
    needs_search: bool
    confidence: float
    referenced_library: Optional[str] = None


# Intents that should NEVER call the LLM (handled by PyTorch Intent directly)
_DIRECT_INTENTS = {"NEXT", "PREVIOUS", "HOME", "SHOW_INSTALL", "PLAY_VIDEO", "PAUSE_VIDEO"}


def should_use_llm(intent: str, confidence: float, below_threshold: bool) -> bool:
    """Determine whether the LLM should be used for this command.

    Routing rules (PHASE 13):
    - NEXT/PREVIOUS/HOME/SHOW_INSTALL/PLAY_VIDEO/PAUSE_VIDEO -> Direct, no LLM
    - Clear SEARCH (confidence >= threshold) -> existing Vector/Search flow, no LLM
    - Ambiguous SEARCH (below_threshold) -> LLM fallback
    - Unknown/below-threshold -> LLM fallback
    """
    if intent in _DIRECT_INTENTS:
        return False
    if intent == "SEARCH" and not below_threshold:
        return False  # Clear SEARCH -> existing search flow
    return True  # Ambiguous SEARCH or below-threshold -> LLM fallback


@router.post("/llm/interpret", response_model=LLMInterpretResponse)
def llm_interpret(request: LLMInterpretRequest):
    """PHASE 13: LLM interpretation endpoint (validation only).

    Interprets ambiguous/context-dependent Korean commands using the OpenAI LLM.

    This endpoint is for PHASE 13 validation only.
    It is NOT automatically connected to STT, Intent, RAG, or React.
    """
    result = interpret_ambiguous_command(request.text, request.context)
    return LLMInterpretResponse(
        normalized_text=result.get("normalized_text", ""),
        needs_search=result.get("needs_search", False),
        confidence=result.get("confidence", 0.0),
        referenced_library=result.get("referenced_library"),
    )


# ---------------------------------------------------------------------------
# PHASE 14: Normalized command action resolution
# ---------------------------------------------------------------------------

# Latin substrings are matched on lowercased text; Hangul aliases are literal.
LIBRARY_ALIASES = {
    "material-ui": ["material ui", "material design", "mui", "머티리얼"],
    "ant-design": ["ant design", "antd", "앤트 디자인", "앤트디자인"],
    "chakra-ui": ["chakra ui", "chakra", "차크라"],
    "shadcn": ["shadcn ui", "shadcn/ui", "shadcn"],
    "daisyui": ["daisyui", "daisy ui", "데이지유아이"],
    "headless-ui": ["headless ui", "headless", "헤드리스"],
    "react-aria": ["react aria", "react-aria", "리액트 아리아"],
    "radix-ui": ["radix ui", "radix", "라딕스", "래딕스"],
    "base-ui": ["base ui", "base-ui", "베이스 유아이", "베이스유아이"],
    "mantine": ["mantine", "만틴", "마틴"],
}

# Seed-data DB slugs that differ from frontend LibraryKey values.
_SLUG_TO_LIBRARY_KEY = {"shadcn-ui": "shadcn"}


def detect_library(text: Optional[str]) -> Optional[str]:
    """Return the frontend LibraryKey whose alias appears in text, if any."""
    if not text:
        return None
    lowered = text.lower()
    for key, aliases in LIBRARY_ALIASES.items():
        for alias in aliases:
            if alias in lowered:
                return key
    return None


def resolve_presentation_shortcut(
    text: str,
    confidence: float = 1.0,
) -> Optional[Dict[str, Any]]:
    """Resolve explicit screen-navigation phrases before ML/LLM routing.

    The Material UI explanation screen is a presentation-only screen, not
    lecture content or RAG. Phrases that explicitly ask to show/open that
    explanation should therefore navigate deterministically.
    """
    lowered = (text or "").lower().strip()
    if detect_library(lowered) != "material-ui":
        return None

    asks_for_explanation_screen = (
        ("설명" in lowered or "소개" in lowered or "overview" in lowered)
        and (
            "보여" in lowered
            or "열어" in lowered
            or "화면" in lowered
            or "overview" in lowered
        )
    )
    if asks_for_explanation_screen:
        return {
            "action": "SHOW_MUI_OVERVIEW",
            "library_key": "material-ui",
            "screen": "material-ui-overview",
            "content_type": None,
            "confidence": confidence,
            "source": "rule",
        }

    asks_for_demo_screen = (
        "데모" in lowered
        and ("보여" in lowered or "열어" in lowered or "화면" in lowered)
    )
    if asks_for_demo_screen:
        return {
            "action": "SELECT_LIBRARY",
            "library_key": "material-ui",
            "screen": "library-demo",
            "content_type": None,
            "confidence": confidence,
            "source": "rule",
        }

    return None


def slug_to_library_key(slug: str) -> str:
    return _SLUG_TO_LIBRARY_KEY.get(slug, slug)


def _action_base(confidence: float, source: str = "intent") -> Dict[str, Any]:
    return {
        "action": "",
        "library_key": None,
        "screen": None,
        "content_type": None,
        "confidence": confidence,
        "source": source,
    }


def _search_result_action(
    confidence: float,
    source: str,
    text: str,
    hit: Optional[Dict[str, Any]],
) -> Dict[str, Any]:
    """Build a SEARCH_RESULT action from a vector RAG top hit.

    If the user explicitly named a library and RAG returned a different one,
    honor the explicit library (content_type falls back to introduction).
    """
    if not hit:
        return _action_base(confidence, source)
    explicit = detect_library(text)
    if explicit and hit["library_key"] != explicit:
        return {
            "action": "SEARCH_RESULT",
            "library_key": explicit,
            "screen": "lecture-content",
            "content_type": "introduction",
            "confidence": confidence,
            "source": source,
        }
    return {
        "action": "SEARCH_RESULT",
        "library_key": hit["library_key"],
        "screen": "lecture-content",
        "content_type": hit["content_type"],
        "confidence": hit["score"],
        "source": source,
    }


def _resolve_llm_action(
    original_text: str,
    llm_result: Dict[str, Any],
    confidence: float,
) -> Dict[str, Any]:
    """Map a PHASE 13 LLM interpretation (no search needed) to a normalized action."""
    base = _action_base(confidence, source="llm")
    normalized = llm_result.get("normalized_text", "") or ""
    ref_library = llm_result.get("referenced_library")

    library_key = (
        detect_library(ref_library)
        or detect_library(normalized)
        or detect_library(original_text)
    )
    if not library_key:
        return base  # nothing actionable

    combined = f"{normalized} {original_text}".lower()

    if "설치" in combined:
        base["action"] = "SHOW_INSTALL"
        base["screen"] = "lecture-content"
        base["content_type"] = "install"
        return base

    base["action"] = "SELECT_LIBRARY"
    base["library_key"] = library_key
    if "강의" in combined or "설명" in combined or "접근" in combined:
        base["screen"] = "lecture-content"
    else:
        base["screen"] = "library-demo"
    return base


def _run_rag_sync(
    question: str,
    context: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    """Real RAG: retrieve lecture contexts -> augment -> generate -> SHOW_AI_RESULT.

    Retrieval: get_query_embedding() -> vector_search() -> LectureContent rows.
    Augmentation: content.content from each row is placed into contexts.
    Generation: generate_rag_answer(question, contexts) -> LLM answer.
    """
    search_query = question
    library_key_hint = detect_library(question)
    if not library_key_hint:
        current_library = (context or {}).get("current_library")
        previous_library = (context or {}).get("previous_library")
        if current_library:
            search_query = f"{current_library} {question}"
        elif previous_library:
            search_query = f"{previous_library} {question}"

    query_embedding = get_query_embedding(search_query)
    db = SessionLocal()
    try:
        rows = vector_search(query_embedding, 3, db)
    finally:
        db.close()

    contexts = []
    for _, content, library, distance in rows:
        contexts.append(
            {
                "content_id": content.id,
                "title": content.title,
                "content": content.content,
                "content_type": content.content_type,
                "library_name": library.name,
                "library_slug": library.slug,
                "category": library.category,
                "score": round(1.0 - float(distance), 4),
            }
        )

    rag_result = generate_rag_answer(question, contexts)

    return {
        "action": "SHOW_AI_RESULT",
        "title": rag_result.get("title", ""),
        "answer": rag_result.get("answer", ""),
        "sources": rag_result.get("sources", []),
        "confidence": contexts[0]["score"] if contexts else 0.0,
        "source": "rag",
    }


def resolve_command_action(
    intent: str,
    text: str,
    confidence: float,
    below_threshold: bool,
    context: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    """Map a classified intent (no LLM needed) to ONE normalized frontend action.

    Returns dict keys: action, library_key, screen, content_type, confidence, source.
    action values: NEXT|PREVIOUS|HOME|OVERVIEW|SHOW_MUI_OVERVIEW|SHOW_DEMO|SHOW_LECTURE|SHOW_INSTALL|SELECT_LIBRARY|"" (ignore)
    """
    base = _action_base(confidence, source="intent")

    if intent in ("PLAY_VIDEO", "PAUSE_VIDEO"):
        return base  # no video UI in this app; safely ignored

    if intent in ("NEXT", "PREVIOUS", "HOME"):
        base["action"] = intent
        return base

    if intent == "SHOW_INSTALL":
        base["action"] = "SHOW_INSTALL"
        base["screen"] = "lecture-content"
        base["content_type"] = "install"
        return base

    if intent == "SHOW_FEATURES":
        base["action"] = "SHOW_LECTURE"
        base["content_type"] = "features_use_case"
        return base

    if intent == "SHOW_EXAMPLE":
        base["action"] = "SHOW_LECTURE"
        base["content_type"] = "example"
        return base

    if intent == "SHOW_COMPARISON":
        base["action"] = "SHOW_LECTURE"
        base["content_type"] = "comparison"
        return base

    if intent == "SHOW_ADVANTAGES":
        base["action"] = "SHOW_LECTURE"
        base["content_type"] = "features_use_case"
        return base

    if intent == "SHOW_DISADVANTAGES":
        base["action"] = "SHOW_LECTURE"
        base["content_type"] = "comparison"
        return base

    if intent == "OPEN_DEMO":
        library_key = detect_library(text)
        if library_key:
            base["action"] = "SELECT_LIBRARY"
            base["library_key"] = library_key
            base["screen"] = (
                "lecture-content" if ("강의" in text or "설명" in text) else "library-demo"
            )
        else:
            base["action"] = "SHOW_DEMO"
        return base

    return base  # SEARCH handled by caller; unknown -> ignore


# ---------------------------------------------------------------------------
# Android Remote / React Command Broadcast connection manager
# ---------------------------------------------------------------------------

class RemoteConnectionManager:
    """Tracks the Android remote and React lecture clients for broadcast.

    Ephemeral runtime state only - no database persistence.

    Concurrency rules:
    - self._lock protects shared state ONLY.
    - Network I/O (broadcasts/sends) happens AFTER releasing the lock.
    - unregister_android only broadcasts "offline" when the disconnecting
      socket is the currently-registered Android socket, so an old socket
      disconnecting after a newer one replaced it never marks the new one
      offline.
    """

    def __init__(self):
        self._android_ws: Optional[WebSocket] = None
        self._react_clients: set = set()
        self._lock = asyncio.Lock()

    async def register_android(self, ws: WebSocket) -> None:
        async with self._lock:
            self._android_ws = ws
        # Network I/O after releasing the lock.
        await self.broadcast_remote_status("connected")

    async def unregister_android(self, ws: WebSocket) -> None:
        changed = False
        async with self._lock:
            if self._android_ws is ws:
                self._android_ws = None
                changed = True
        # Only broadcast offline if the active Android connection actually
        # changed (i.e. this socket was the current one).
        if changed:
            await self.broadcast_remote_status("offline")

    async def register_react(self, ws: WebSocket) -> None:
        async with self._lock:
            self._react_clients.add(ws)
            status = "connected" if self._android_ws else "offline"
        # Network I/O after releasing the lock.
        await self._send(ws, {"type": "remote_status", "status": status})

    async def unregister_react(self, ws: WebSocket) -> None:
        async with self._lock:
            self._react_clients.discard(ws)

    async def broadcast_action(self, action_data: Dict[str, Any]) -> None:
        await self._broadcast({"type": "action", **action_data})

    async def broadcast_remote_status(self, status: str) -> None:
        await self._broadcast({"type": "remote_status", "status": status})

    async def _broadcast(self, msg: Dict[str, Any]) -> None:
        # Snapshot the client set under the lock, then send outside it.
        async with self._lock:
            clients = list(self._react_clients)
        dead = []
        for ws in clients:
            try:
                await ws.send_text(json.dumps(msg))
            except Exception:
                dead.append(ws)
        if dead:
            async with self._lock:
                for ws in dead:
                    self._react_clients.discard(ws)

    async def _send(self, ws: WebSocket, msg: Dict[str, Any]) -> None:
        try:
            await ws.send_text(json.dumps(msg))
        except Exception:
            pass


connection_manager = RemoteConnectionManager()


# ---------------------------------------------------------------------------
# Android Push-to-Talk audio WebSocket
# Endpoint: /ws/android (registered under /api prefix, so full path is /api/ws/android)
# ---------------------------------------------------------------------------

@router.websocket("/ws/android")
async def android_websocket(websocket: WebSocket):
    """Android Push-to-Talk microphone audio -> existing Deepgram STT pipeline.

    Flow:
      Android connects
      -> {"type":"start_ptt"} -> Deepgram session starts
      -> binary audio chunks -> Deepgram STT
      -> final transcript -> existing intent/RAG/LLM routing
      -> CommandAction broadcast to React lecture clients
      -> {"type":"stop_ptt"} -> Deepgram session ends
      -> ready for the next Push-to-Talk command

    Uses a per-connection DeepgramSTTService instance so the Android session
    lifecycle (start/stop per PTT) never conflicts with the shared /ws/stt
    service, and a disconnect always cleans up the active Deepgram session.

    Reuses the existing routing helpers: predict_intent, _run_vector_search_sync,
    _search_result_action, should_use_llm, _resolve_llm_action,
    resolve_command_action, interpret_ambiguous_command.
    """
    await websocket.accept()
    logger.info("Android WebSocket connected")
    await connection_manager.register_android(websocket)

    _ws_loop = asyncio.get_running_loop()

    def _schedule_send(coro):
        asyncio.run_coroutine_threadsafe(coro, _ws_loop)

    # Per-connection Deepgram STT service (reuses the existing STT class).
    import os
    from dotenv import load_dotenv
    load_dotenv()
    api_key = os.environ.get("DEEPGRAM_API_KEY")
    if not api_key:
        await websocket.close(code=1011, reason="Deepgram API key not configured")
        await connection_manager.unregister_android(websocket)
        return
    service = DeepgramSTTService(api_key)

    # PHASE 14: per-connection frontend app context (updated via control messages)
    app_context: Dict[str, Any] = {}
    # PHASE 12/14 race protection: monotonic per-connection command sequence.
    # _process_final tasks can complete out of order (LLM/search latency differs),
    # so each result is tagged with a seq. When a newer command has already
    # started, the older result is dropped - rapid PTT commands never let a
    # stale backend result overwrite newer frontend navigation state.
    command_seq = 0
    ptt_active = False
    first_audio_frame_received = False

    async def _process_final(text: str, intent_data: Dict[str, Any]) -> None:
        """Final transcript -> intent -> (search | LLM fallback) -> broadcast action."""
        nonlocal command_seq
        try:
            command_seq += 1
            my_seq = command_seq

            intent = intent_data.get("name", "")
            confidence = float(intent_data.get("confidence", 0.0))
            below_threshold = bool(intent_data.get("below_threshold", True))

            if not intent:
                below_threshold = True

            shortcut_action = resolve_presentation_shortcut(text, confidence)
            if shortcut_action is not None:
                action_data = shortcut_action
            elif intent == "SEARCH" and not below_threshold:
                # Clear SEARCH -> real RAG (retrieval + augmentation + generation)
                action_data = await asyncio.to_thread(_run_rag_sync, text, app_context)
            elif should_use_llm(intent, confidence, below_threshold):
                llm_result = await asyncio.to_thread(
                    interpret_ambiguous_command, text, app_context
                )
                if llm_result.get("needs_search"):
                    # Ambiguous question requiring search -> real RAG
                    action_data = await asyncio.to_thread(_run_rag_sync, text, app_context)
                else:
                    action_data = _resolve_llm_action(text, llm_result, confidence)
            else:
                action_data = resolve_command_action(
                    intent, text, confidence, below_threshold, app_context
                )

            if my_seq < command_seq:
                logger.info(f"Dropping stale command action (seq {my_seq} < {command_seq})")
                return

            msg = {
                "text": text,
                "intent": intent,
                "seq": my_seq,
                "status": "ok",
                **action_data,
            }
            logger.info("Resolved action: %s", msg.get("action", ""))
            # Broadcast the CommandAction to all React lecture clients.
            await connection_manager.broadcast_action(msg)
            logger.info("React broadcast success")
            # Return the same resolved CommandAction to the Android remote.
            if websocket.application_state == WebSocketState.CONNECTED:
                await websocket.send_text(json.dumps({"type": "action", **msg}))
                logger.info("Android action response success")
        except Exception as e:
            logger.error(f"Command action error: {e}")
            await connection_manager.broadcast_action({
                "type": "error",
                "message": "Command processing failed",
                "text": text,
            })

    def on_transcript(data):
        try:
            if websocket.application_state == WebSocketState.CONNECTED:
                is_final = data.get("is_final", False) if isinstance(data, dict) else False
                text = data.get("text", "")

                if is_final and text.strip():
                    logger.info("Deepgram final transcript: %s", text)
                    intent_data = {"name": "", "confidence": 0.0, "below_threshold": True}
                    try:
                        prediction = predict_intent(text, threshold=INTENT_CONFIDENCE_THRESHOLD)
                        intent_data = {
                            "name": prediction["intent"],
                            "confidence": prediction["confidence"],
                            "below_threshold": prediction["below_threshold"],
                        }
                    except Exception as e:
                        logger.error(f"Intent classification error: {e}")

                    msg = {
                        "type": "transcript",
                        "text": text,
                        "is_final": True,
                        "intent": intent_data,
                    }
                    _schedule_send(websocket.send_text(json.dumps(msg)))
                    _schedule_send(_process_final(text, intent_data))
                else:
                    msg = {"type": "transcript", "text": text, "is_final": False}
                    _schedule_send(websocket.send_text(json.dumps(msg)))
        except Exception as e:
            logger.error(f"Error sending transcript: {e}")

    def on_error(message):
        try:
            if websocket.application_state == WebSocketState.CONNECTED:
                msg = {"type": "error", "message": str(message)}
                _schedule_send(websocket.send_text(json.dumps(msg)))
        except Exception as e:
            logger.error(f"Error sending error: {e}")

    service.register_callback("transcript", on_transcript)
    service.register_callback("error", on_error)

    try:
        while websocket.application_state == WebSocketState.CONNECTED:
            data = await websocket.receive()
            if data["type"] == "websocket.disconnect":
                logger.info("Android WebSocket disconnected")
                break
            if "text" in data:
                text_data = data["text"]
                try:
                    control = json.loads(text_data)
                    if not isinstance(control, dict):
                        logger.warning(f"Ignoring non-object control message: {text_data[:80]}")
                        continue
                    ctype = control.get("type")
                    if ctype == "start_ptt":
                        logger.info("start_ptt received")
                        if not ptt_active:
                            started = await asyncio.to_thread(service.start)
                            if started:
                                ptt_active = True
                                first_audio_frame_received = False
                                logger.info("Deepgram stream started")
                            else:
                                ptt_active = False
                                await websocket.send_text(json.dumps({
                                    "type": "error",
                                    "message": "Failed to start Deepgram STT service",
                                }))
                    elif ctype == "stop_ptt":
                        logger.info("stop_ptt received")
                        if ptt_active:
                            await asyncio.to_thread(service.stop)
                            ptt_active = False
                    elif ctype == "context":
                        for key in ("current_library", "previous_library", "current_screen", "current_content_type"):
                            if control.get(key) is not None:
                                app_context[key] = control[key]
                    else:
                        logger.warning(f"Ignoring unknown control type: {ctype}")
                except Exception:
                    logger.warning(f"Ignoring malformed control message: {text_data[:80]}")
            elif "bytes" in data:
                if ptt_active:
                    if not first_audio_frame_received:
                        logger.info(
                            "Android binary audio received: first frame, %d bytes",
                            len(data["bytes"]),
                        )
                        first_audio_frame_received = True
                    service.send_audio(data["bytes"])
    except WebSocketDisconnect:
        logger.info("Android WebSocket disconnected")
    except Exception as e:
        logger.error(f"Android WebSocket error: {e}")
        try:
            if websocket.application_state == WebSocketState.CONNECTED:
                await websocket.close(code=1011, reason=str(e))
        except Exception:
            pass
    finally:
        service.unregister_callback("transcript", on_transcript)
        service.unregister_callback("error", on_error)
        # Clean up any active Deepgram session on disconnect.
        if ptt_active:
            await asyncio.to_thread(service.stop)
        await connection_manager.unregister_android(websocket)


# ---------------------------------------------------------------------------
# React lecture client command WebSocket
# Endpoint: /ws/commands (registered under /api prefix, so full path is /api/ws/commands)
# ---------------------------------------------------------------------------

@router.websocket("/ws/commands")
async def commands_websocket(websocket: WebSocket):
    """React lecture display client.

    Receives CommandAction broadcasts from the backend (originating from the
    Android Push-to-Talk pipeline) and executes them via the existing
    handleVoiceAction. Also receives remote_status updates so the UI can show
    whether the Android remote is connected.
    """
    await websocket.accept()
    logger.info("React command WebSocket connected")
    await connection_manager.register_react(websocket)
    try:
        while websocket.application_state == WebSocketState.CONNECTED:
            # React is a display-only client; it does not send commands.
            # Keep the connection open and ignore any inbound frames.
            data = await websocket.receive()
            if data["type"] == "websocket.disconnect":
                logger.info("React command WebSocket disconnected")
                break
    except WebSocketDisconnect:
        logger.info("React command WebSocket disconnected")
    except Exception as e:
        logger.error(f"React command WebSocket error: {e}")
    finally:
        await connection_manager.unregister_react(websocket)


# PHASE 11: WebSocket endpoint for real-time Deepgram STT
# Endpoint: /ws/stt (registered under /api prefix, so full path is /api/ws/stt)


@router.websocket("/ws/stt")
async def stt_websocket(websocket: WebSocket):
    """Real-time WebSocket endpoint for Deepgram Speech-to-Text.

    Conceptual flow:
    - client WebSocket connect
    - audio bytes arrive from frontend
    - backend sends audio to Deepgram
    - Deepgram transcript event
    - backend sends transcript JSON to client

    Message shapes:
    - Final result:     {"type": "transcript", "text": "...", "is_final": true, "intent": {...}}
    - Interim result:   {"type": "transcript", "text": "...", "is_final": false}
    - Action result:    {"type": "action", "text": "...", "intent": "...", "action": "...", "library_key": "...", "screen": "...", "content_type": "...", "confidence": 0.0, "source": "intent|search|llm", "status": "ok"}
    - Error:            {"type": "error", "message": "safe error message"}

    Client -> server control messages (JSON text frames):
    - {"type": "context", "current_library": "...", "previous_library": "...", "current_screen": "...", "current_content_type": "..."}
    """
    await websocket.accept()

    # Deepgram SDK callbacks fire on a foreign thread; capture the main event
    # loop so we can schedule sends safely from those callbacks.
    _ws_loop = asyncio.get_running_loop()

    def _schedule_send(coro):
        asyncio.run_coroutine_threadsafe(coro, _ws_loop)

    # Initialize STT service if not already initialized
    stt_service = get_stt_service()
    if stt_service is None:
        # Load API key from environment
        import os
        from dotenv import load_dotenv
        load_dotenv()
        api_key = os.environ.get("DEEPGRAM_API_KEY")
        if not api_key:
            await websocket.close(code=1011, reason="Deepgram API key not configured")
            return
        if not initialize_stt_service(api_key):
            await websocket.close(code=1011, reason="Failed to initialize Deepgram STT service")
            return

    service = get_stt_service()

    # PHASE 14: per-connection frontend app context (updated via control messages)
    app_context: Dict[str, Any] = {}
    # PHASE 12/14 race protection: monotonic per-connection command sequence.
    # _process_final tasks can complete out of order (LLM/search latency differs),
    # so each result is tagged with a seq. When a newer command has already
    # started, the older result is dropped - rapid "다음"+"다음" never lets a
    # stale backend result overwrite newer frontend navigation state.
    command_seq = 0

    async def _process_final(text: str, intent_data: Dict[str, Any]) -> None:
        """Final transcript -> intent -> (search | LLM fallback) -> normalized action."""
        nonlocal command_seq
        try:
            command_seq += 1
            my_seq = command_seq

            intent = intent_data.get("name", "")
            confidence = float(intent_data.get("confidence", 0.0))
            below_threshold = bool(intent_data.get("below_threshold", True))

            if not intent:
                # Intent model unavailable -> behave like an ambiguous command
                below_threshold = True

            shortcut_action = resolve_presentation_shortcut(text, confidence)
            if shortcut_action is not None:
                action_data = shortcut_action
            elif intent == "SEARCH" and not below_threshold:
                # Clear SEARCH -> real RAG (retrieval + augmentation + generation)
                action_data = await asyncio.to_thread(_run_rag_sync, text, app_context)
            elif should_use_llm(intent, confidence, below_threshold):
                # Ambiguous / context-dependent -> PHASE 13 LLM fallback
                llm_result = await asyncio.to_thread(
                    interpret_ambiguous_command, text, app_context
                )
                if llm_result.get("needs_search"):
                    # Ambiguous question requiring search -> real RAG
                    action_data = await asyncio.to_thread(_run_rag_sync, text, app_context)
                else:
                    action_data = _resolve_llm_action(text, llm_result, confidence)
            else:
                action_data = resolve_command_action(
                    intent, text, confidence, below_threshold, app_context
                )

            if my_seq < command_seq:
                # A newer command started while this one was in flight; drop the stale result.
                logger.info(f"Dropping stale command action (seq {my_seq} < {command_seq})")
                return

            msg = {
                "type": "action",
                "text": text,
                "intent": intent,
                "seq": my_seq,
                "status": "ok",
                **action_data,
            }
            await websocket.send_text(json.dumps(msg))
        except Exception as e:
            logger.error(f"Command action error: {e}")
            err = {"type": "error", "message": "Command processing failed", "text": text}
            await websocket.send_text(json.dumps(err))

    # Register callbacks
    def on_transcript(data):
        try:
            # Only send if websocket is still connected
            if websocket.application_state == WebSocketState.CONNECTED:
                is_final = data.get("is_final", False) if isinstance(data, dict) else False
                text = data.get("text", "")

                if is_final and text.strip():
                    # For final transcripts, run intent classification
                    intent_data = {"name": "", "confidence": 0.0, "below_threshold": True}
                    try:
                        prediction = predict_intent(text, threshold=INTENT_CONFIDENCE_THRESHOLD)
                        intent_data = {
                            "name": prediction["intent"],
                            "confidence": prediction["confidence"],
                            "below_threshold": prediction["below_threshold"],
                        }
                    except Exception as e:
                        logger.error(f"Intent classification error: {e}")

                    msg = {
                        "type": "transcript",
                        "text": text,
                        "is_final": True,
                        "intent": intent_data,
                    }
                    _schedule_send(websocket.send_text(json.dumps(msg)))
                    _schedule_send(_process_final(text, intent_data))
                else:
                    # For interim transcripts, send transcript-only (no intent)
                    msg = {"type": "transcript", "text": text, "is_final": False}
                    _schedule_send(websocket.send_text(json.dumps(msg)))
        except Exception as e:
            logger.error(f"Error sending transcript: {e}")

    def on_error(message):
        try:
            if websocket.application_state == WebSocketState.CONNECTED:
                msg = {"type": "error", "message": str(message)}
                _schedule_send(websocket.send_text(json.dumps(msg)))
        except Exception as e:
            logger.error(f"Error sending error: {e}")

    def on_close():
        try:
            if websocket.application_state == WebSocketState.CONNECTED:
                _schedule_send(websocket.close())
        except Exception as e:
            logger.error(f"Error closing websocket: {e}")

    service.register_callback("transcript", on_transcript)
    service.register_callback("error", on_error)
    service.register_callback("close", on_close)

    # Accept audio from client and forward to Deepgram
    try:
        while websocket.application_state == WebSocketState.CONNECTED:
            data = await websocket.receive()
            if data["type"] == "websocket.disconnect":
                logger.info("WebSocket client disconnected")
                break
            if "text" in data:
                # Handle control messages if needed
                text_data = data["text"]
                if text_data.strip().lower() == "stop":
                    service.stop()
                    break
                elif text_data.strip().lower() == "start":
                    # STT already started during initialization
                    pass
                else:
                    # PHASE 14: control messages carry frontend app context as JSON
                    try:
                        control = json.loads(text_data)
                        if isinstance(control, dict) and control.get("type") == "context":
                            for key in ("current_library", "previous_library", "current_screen", "current_content_type"):
                                if control.get(key) is not None:
                                    app_context[key] = control[key]
                    except Exception:
                        logger.warning(f"Ignoring unknown text message: {text_data[:80]}")
            elif "bytes" in data:
                audio_bytes = data["bytes"]
                # Forward audio to Deepgram for streaming transcription
                if service:
                    service.send_audio(audio_bytes)
    except WebSocketDisconnect:
        logger.info("WebSocket client disconnected")
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        try:
            if websocket.application_state == WebSocketState.CONNECTED:
                await websocket.close(code=1011, reason=str(e))
        except Exception:
            pass
    finally:
        # Clean up callbacks
        service.unregister_callback("transcript", on_transcript)
        service.unregister_callback("error", on_error)
        service.unregister_callback("close", on_close)
        # Don't fully cleanup STT service since it may be shared
        # Just stop the connection
        # service.stop()  # Commented: shared service, only stop our connection
