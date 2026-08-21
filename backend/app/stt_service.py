"""
Deepgram Real-time Speech-to-Text Service

PHASE 11 responsibility:
- microphone/audio → FastAPI → Deepgram real-time STT → Korean transcript text

Responsibilities:
- create Deepgram streaming connection
- receive audio bytes from FastAPI
- send audio to Deepgram
- receive transcript events
- distinguish interim/final results
- report errors
- cleanly close resources

Do NOT connect to PyTorch Intent, Vector RAG, OpenAI LLM, or context routing.
"""

import asyncio
import logging
from typing import Optional, Callable, Any

logger = logging.getLogger(__name__)


class DeepgramSTTService:
    """Handles real-time Deepgram STT streaming."""

    def __init__(self, api_key: str):
        self.api_key = api_key
        self.client: Optional[DeepgramClient] = None
        self._is_final = False
        self._interim_text = ""
        self._callbacks = {
            "transcript": [],
            "error": [],
            "close": [],
        }
        self._connection = None

    def register_callback(self, event: str, callback: Callable):
        """Register a callback for a specific event."""
        if event in self._callbacks:
            self._callbacks[event].append(callback)
        else:
            logger.warning(f"Unknown event type: {event}")

    def unregister_callback(self, event: str, callback: Callable):
        """Remove a previously-registered callback for a specific event.

        Routers.py PHASE 14 teardown calls this in the WebSocket finally block.
        Safe no-op if the callback was never registered.
        """
        if event in self._callbacks:
            try:
                self._callbacks[event].remove(callback)
            except ValueError:
                pass  # not registered; harmless

    def _notify(self, event: str, data: Any):
        """Notify all registered callbacks for an event."""
        for cb in self._callbacks.get(event, []):
            try:
                cb(data)
            except Exception as e:
                logger.error(f"Callback error for {event}: {e}")

    def start(self):
        """Initialize the Deepgram client and streaming connection."""
        try:
            self.client = DeepgramClient(self.api_key)
            logger.info("Deepgram client initialized")
        except Exception as e:
            logger.error(f"Failed to initialize Deepgram client: {e}")
            self._notify("error", str(e))
            return False

        # Configure streaming for Nova-3 Korean with minimal options
        # Per PHASE 11 requirements:
        # - model = nova-3
        # - language = ko (Korean)
        # - smart_format = true
        # - interim_results = true
        # - reasonable endpointing for short spoken commands
        options = LiveOptions(
            model="nova-3",
            language="ko-KR",
            smart_format=True,
            interim_results=True,
            endpointing=0.5,  # Short commands - minimal endpointing
            utterance_end_ms=1000,  # 1s of silence = final
            encoding="linear16",
            channels=1,
            sample_rate=16000,
        )

        try:
            self._connection = self.client.listen.live(options=options)
            logger.info("Deepgram streaming connection established")
            self._notify("close", None)  # Signal ready
            return True
        except Exception as e:
            logger.error(f"Failed to establish Deepgram streaming connection: {e}")
            self._notify("error", str(e))
            return False

    def send_audio(self, audio_bytes: bytes):
        """Send audio bytes to Deepgram for streaming transcription."""
        if not self.client or not self._connection:
            logger.error("Deepgram streaming connection not established")
            self._notify("error", "Deepgram streaming connection not established")
            return False

        try:
            self._connection.send(audio_bytes)
            return True
        except Exception as e:
            logger.error(f"Failed to send audio to Deepgram: {e}")
            self._notify("error", str(e))
            return False

    def stop(self):
        """Cleanly close the Deepgram streaming connection."""
        if self._connection:
            try:
                self._connection.finish()
                logger.info("Deepgram streaming connection closed")
            except Exception as e:
                logger.error(f"Error closing Deepgram connection: {e}")
            finally:
                self._connection = None
        self._is_final = False
        self._interim_text = ""
        self._notify("close", None)

    def _handle_message(self, message: dict):
        """Handle incoming Deepgram transcription messages."""
        try:
            channel = message.get("channel", {})
            alternatives = channel.get("alternatives", [])

            if not alternatives:
                return

            transcript = alternatives[0].get("transcript", "").strip()
            is_final = alternatives[0].get("final", False)
            confidence = alternatives[0].get("confidence", 0.0)

            if is_final:
                self._is_final = True
                self._interim_text = ""
                # Send final transcript
                self._notify("transcript", {
                    "type": "transcript",
                    "text": transcript,
                    "is_final": True,
                    "confidence": confidence,
                })
            else:
                # Send interim transcript
                self._interim_text = transcript
                self._notify("transcript", {
                    "type": "transcript",
                    "text": transcript,
                    "is_final": False,
                    "confidence": confidence,
                })

        except Exception as e:
            logger.error(f"Error handling Deepgram message: {e}")
            self._notify("error", str(e))

    def _handle_connection(self):
        """Handle connection status changes."""
        logger.info("Deepgram streaming connection status changed")
        self._notify("close", None)

    def _handle_error(self, error: dict):
        """Handle Deepgram errors."""
        logger.error(f"Deepgram error: {error}")
        self._notify("error", str(error))


# Global STT service instance
_stt_service: Optional[DeepgramSTTService] = None


def get_stt_service() -> Optional[DeepgramSTTService]:
    """Get the global STT service instance."""
    return _stt_service


def initialize_stt_service(api_key: str) -> bool:
    """Initialize the global STT service with the given API key."""
    global _stt_service
    _stt_service = DeepgramSTTService(api_key)
    success = _stt_service.start()
    if success:
        logger.info("Deepgram STT service initialized successfully")
    else:
        logger.error("Failed to initialize Deepgram STT service")
    return success


def cleanup_stt_service():
    """Clean up the global STT service."""
    global _stt_service
    if _stt_service:
        _stt_service.stop()
        _stt_service = None
    logger.info("Deepgram STT service cleaned up")
