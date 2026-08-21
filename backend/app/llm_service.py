"""PHASE 13: OpenAI LLM assistance for ambiguous/context-dependent commands.

Responsibility: ambiguous text + context -> normalized interpretation.
Does NOT: control React, execute Intent, call Vector RAG, modify DB, perform STT.
"""
import os
import json
import openai
from typing import Optional, Dict, Any, List

# Load .env into environment (secrets stay hidden) - same pattern as routers.py
_env_candidates = [
    os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), ".env"),
    os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".env"),
]
for _env_path in _env_candidates:
    if os.path.exists(_env_path):
        for line in open(_env_path, encoding="utf-8"):
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                os.environ.setdefault(k.strip(), v.strip())

API_KEY = os.environ.get("OPENAI_API_KEY")
LLM_MODEL = os.environ.get("OPENAI_LLM_MODEL", "gpt-5.6-luna")


class LLMService:
    """Small OpenAI LLM helper for command normalization."""

    def __init__(self):
        if not API_KEY or API_KEY.lower().startswith("your_"):
            raise ValueError("OPENAI_API_KEY not configured")
        openai.api_key = API_KEY

    def interpret_ambiguous_command(
        self,
        text: str,
        context: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Normalize ambiguous Korean voice commands.

        Args:
            text: Raw Korean command text.
            context: Optional dict with keys like:
                current_library, previous_library, current_content_type, current_screen.

        Returns:
            Dict with keys:
                normalized_text: str
                needs_search: bool
                confidence: float (0-1)
                referenced_library: Optional[str]
        """
        if context is None:
            context = {}

        current_library = context.get("current_library", "")
        previous_library = context.get("previous_library", "")

        system_prompt = (
            "You normalize ambiguous Korean voice commands for a React UI library "
            "lecture application. Use the supplied current context to produce a "
            "normalized interpretation.\n\n"
            "Rules:\n"
            "- Return ONLY valid JSON with the exact schema below\n"
            "- Do NOT execute actions\n"
            "- Do NOT answer general questions\n"
            "- Do NOT invent libraries\n"
            "- Keep output concise\n"
            "- If the command is simple and not ambiguous, set needs_search to false\n"
            "- Do not include arbitrary executable actions, Python code, SQL, React routes, or database commands\n\n"
            "Output schema:\n"
            '{"normalized_text": "Korean text describing the normalized intent", '
            '"needs_search": true/false, '
            '"confidence": 0.0-1.0, '
            '"referenced_library": "library name if mentioned, otherwise null"}'
        )

        user_prompt = (
            f"Current context:\n"
            f"- current_library: {current_library}\n"
            f"- previous_library: {previous_library}\n\n"
            f'User command: "{text}"\n\n'
            "Normalize this command into a structured interpretation."
        )

        try:
            response = openai.responses.create(
                model=LLM_MODEL,
                instructions=system_prompt,
                input=user_prompt,
                temperature=0.0,
                response_format={
                    "type": "json_object",
                    "schema": {
                        "type": "object",
                        "properties": {
                            "normalized_text": {"type": "string"},
                            "needs_search": {"type": "boolean"},
                            "confidence": {"type": "number"},
                            "referenced_library": {"type": "string", "nullable": True}
                        },
                        "required": ["normalized_text", "needs_search", "confidence"],
                        "additionalProperties": False
                    }
                }
            )

            result = response.output_text
            parsed = json.loads(result)

            parsed.setdefault("normalized_text", "")
            parsed.setdefault("needs_search", False)
            parsed.setdefault("confidence", 0.0)
            parsed.setdefault("referenced_library", None)

            parsed["confidence"] = max(0.0, min(1.0, parsed["confidence"]))

            return parsed

        except Exception:
            return {
                "normalized_text": "",
                "needs_search": False,
                "confidence": 0.0,
                "referenced_library": None
            }

    def generate_rag_answer(
        self,
        question: str,
        contexts: List[Dict[str, Any]],
    ) -> Dict[str, Any]:
        """RAG generation: answer the user's question using ONLY retrieved lecture contexts.

        Augmentation: the ACTUAL content.content from PostgreSQL is inserted into the prompt.
        Generation: OpenAI LLM produces a concise answer from that context only.

        Returns:
            Dict with keys: title, answer, sources.
            sources always come from the actually retrieved DB records (contexts),
            never from the LLM.
        """
        if not contexts:
            return {
                "title": "",
                "answer": (
                    "The stored lecture material does not contain enough information "
                    "to answer that question."
                ),
                "sources": [],
            }

        sources = [
            {
                "title": ctx.get("title", ""),
                "library": ctx.get("library_name", ""),
                "library_slug": ctx.get("library_slug", ""),
                "content_type": ctx.get("content_type", ""),
                "score": ctx.get("score", 0.0),
            }
            for ctx in contexts
        ]

        context_blocks = []
        for i, ctx in enumerate(contexts, start=1):
            context_blocks.append(
                f"[Context {i}] Library: {ctx.get('library_name', '')}\n"
                f"Category: {ctx.get('category', '')}\n"
                f"Title: {ctx.get('title', '')}\n"
                f"Content type: {ctx.get('content_type', '')}\n"
                f"Content:\n{ctx.get('content', '')}"
            )
        context_text = "\n\n".join(context_blocks)

        system_prompt = (
            "You are a concise lecture assistant for a React UI library lecture "
            "application. Answer the user's question using ONLY the supplied lecture "
            "context below.\n\n"
            "Rules:\n"
            "- Use only the supplied lecture context; do not invent unsupported information\n"
            "- If the supplied context is insufficient to answer, say that the stored "
            "lecture material does not contain enough information\n"
            "- Produce a concise, presentation-friendly answer in the same language as "
            "the user's question\n"
            "- Return ONLY valid JSON with the exact schema below\n"
            "- Do NOT include executable commands, code, SQL, or React routes\n\n"
            "Output schema:\n"
            '{"title": "short title", "answer": "concise answer"}'
        )

        user_prompt = (
            f"User question: {question}\n\n"
            f"Lecture context:\n{context_text}\n\n"
            "Answer the question using only the lecture context above."
        )

        try:
            response = openai.responses.create(
                model=LLM_MODEL,
                instructions=system_prompt,
                input=user_prompt,
                temperature=0.0,
                response_format={
                    "type": "json_object",
                    "schema": {
                        "type": "object",
                        "properties": {
                            "title": {"type": "string"},
                            "answer": {"type": "string"},
                        },
                        "required": ["title", "answer"],
                        "additionalProperties": False,
                    },
                },
            )
            parsed = json.loads(response.output_text)
            return {
                "title": parsed.get("title", ""),
                "answer": parsed.get("answer", ""),
                "sources": sources,
            }
        except Exception:
            # Generation failure -> honest fallback, never a fake answer.
            return {
                "title": "",
                "answer": "I could not generate an answer right now. Please try again.",
                "sources": sources,
            }


_llm_service: Optional[LLMService] = None


def get_llm_service() -> Optional[LLMService]:
    """Get the global LLM service instance."""
    global _llm_service
    if _llm_service is None:
        try:
            _llm_service = LLMService()
        except ValueError:
            _llm_service = None
    return _llm_service


def interpret_ambiguous_command(
    text: str,
    context: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """Convenience function to interpret ambiguous commands."""
    service = get_llm_service()
    if service is None:
        return {
            "normalized_text": "",
            "needs_search": False,
            "confidence": 0.0,
            "referenced_library": None
        }
    return service.interpret_ambiguous_command(text, context)


def generate_rag_answer(
    question: str,
    contexts: List[Dict[str, Any]],
) -> Dict[str, Any]:
    """Convenience function for RAG answer generation."""
    service = get_llm_service()
    if service is None:
        return {
            "title": "",
            "answer": "AI assistant is not configured (OPENAI_API_KEY missing).",
            "sources": [],
        }
    return service.generate_rag_answer(question, contexts)
