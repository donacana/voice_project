"""
Deepgram real-time STT service.

Android Push-to-Talk
→ Raw PCM16 / 16kHz / Mono
→ Deepgram Nova-3
→ transcript callback
"""

import logging
import threading
from typing import Any, Callable, Optional

from deepgram import DeepgramClient
from deepgram.core.events import EventType
from deepgram.listen.v1.types import ListenV1Results


logger = logging.getLogger(__name__)


class DeepgramSTTService:
    """
    One Deepgram streaming session per Push-to-Talk press.
    """

    def __init__(self, api_key: str):
        self.api_key = api_key

        self.client: Optional[DeepgramClient] = None

        self._connection_cm = None
        self._connection = None

        self._listen_thread: Optional[threading.Thread] = None

        self._callbacks = {
            "transcript": [],
            "error": [],
            "close": [],
        }

        self._open_event = threading.Event()
        self._final_event = threading.Event()

        self._state_lock = threading.Lock()

        self._closing = False

        self._finalize_requested = False
        self._final_emitted = False

        self._final_parts: list[str] = []

        self._interim_text = ""
        self._last_confidence = 0.0

    # =========================================================
    # Callback
    # =========================================================

    def register_callback(
        self,
        event: str,
        callback: Callable,
    ):
        if event in self._callbacks:
            self._callbacks[event].append(callback)

    def unregister_callback(
        self,
        event: str,
        callback: Callable,
    ):
        if event in self._callbacks:
            try:
                self._callbacks[event].remove(callback)

            except ValueError:
                pass

    def _notify(
        self,
        event: str,
        data: Any,
    ):
        callbacks = list(
            self._callbacks.get(event, [])
        )

        for callback in callbacks:
            try:
                callback(data)

            except Exception as exc:
                logger.exception(
                    "STT callback failed: %s",
                    exc,
                )

    # =========================================================
    # State
    # =========================================================

    def _reset_session_state(self):
        self._open_event.clear()
        self._final_event.clear()

        self._closing = False

        self._finalize_requested = False
        self._final_emitted = False

        self._final_parts = []

        self._interim_text = ""
        self._last_confidence = 0.0

    # =========================================================
    # Start
    # =========================================================

    def start(self) -> bool:
        """
        Start one Deepgram session.

        Android:
        start_ptt
        ↓
        this method
        """

        if self._connection is not None:
            return True

        self._reset_session_state()

        try:
            self.client = DeepgramClient(
                api_key=self.api_key
            )

            self._connection_cm = (
                self.client.listen.v1.connect(
                    model="nova-3",

                    language="ko-KR",

                    encoding="linear16",

                    sample_rate=16000,

                    channels=1,

                    interim_results=True,

                    smart_format=True,

                    endpointing="500",

                    utterance_end_ms="1000",
                )
            )

            self._connection = (
                self._connection_cm.__enter__()
            )

            # Deepgram events
            self._connection.on(
                EventType.OPEN,
                self._handle_open,
            )

            self._connection.on(
                EventType.MESSAGE,
                self._handle_message,
            )

            self._connection.on(
                EventType.ERROR,
                self._handle_error,
            )

            self._connection.on(
                EventType.CLOSE,
                self._handle_close,
            )

            # Deepgram receive loop runs separately.
            self._listen_thread = threading.Thread(
                target=self._listen_loop,
                name="deepgram-listen",
                daemon=True,
            )

            self._listen_thread.start()

            # Wait until Deepgram actually opens.
            if not self._open_event.wait(
                timeout=5.0
            ):
                raise RuntimeError(
                    "Deepgram connection open timeout"
                )

            logger.info(
                "Deepgram STT session started"
            )

            return True

        except Exception as exc:

            logger.exception(
                "Failed to start Deepgram STT: %s",
                exc,
            )

            self._notify(
                "error",
                str(exc),
            )

            self._force_cleanup()

            return False

    # =========================================================
    # Deepgram receive loop
    # =========================================================

    def _listen_loop(self):

        try:
            if self._connection is not None:
                self._connection.start_listening()

        except Exception as exc:

            if not self._closing:

                logger.exception(
                    "Deepgram listen loop failed: %s",
                    exc,
                )

                self._notify(
                    "error",
                    str(exc),
                )

    # =========================================================
    # Audio
    # =========================================================

    def send_audio(
        self,
        audio_bytes: bytes,
    ) -> bool:
        """
        Android Binary WebSocket Frame

        Raw PCM
        16kHz
        Mono
        PCM16 / linear16
        """

        if self._connection is None:
            return False

        try:

            self._connection.send_media(
                audio_bytes
            )

            return True

        except Exception as exc:

            logger.exception(
                "Failed to send Deepgram audio: %s",
                exc,
            )

            self._notify(
                "error",
                str(exc),
            )

            return False

    # =========================================================
    # Stop
    # =========================================================

    def stop(self):
        """
        stop_ptt

        ↓

        Finalize transcript

        ↓

        Close only Deepgram session.

        IMPORTANT:
        Android WebSocket remains connected.
        """

        if self._connection is None:
            return

        self._closing = True
        self._finalize_requested = True

        try:

            # Ask Deepgram to finalize remaining speech.
            self._connection.send_finalize()

            # Give the final transcript a short time to arrive.
            self._final_event.wait(
                timeout=1.5
            )

            # Fallback if Deepgram did not flag
            # the final event before timeout.
            if not self._final_emitted:
                self._emit_pending_final()

            # Close only Deepgram stream.
            self._connection.send_close_stream()

        except Exception as exc:

            logger.exception(
                "Failed to stop Deepgram STT cleanly: %s",
                exc,
            )

            self._notify(
                "error",
                str(exc),
            )

        finally:

            if (
                self._listen_thread
                and self._listen_thread.is_alive()
            ):
                self._listen_thread.join(
                    timeout=2.0
                )

            self._force_cleanup()

            logger.info(
                "Deepgram STT session stopped"
            )

    # =========================================================
    # Deepgram events
    # =========================================================

    def _handle_open(
        self,
        _event,
    ):
        self._open_event.set()

    def _handle_message(
        self,
        message,
    ):
        """
        Deepgram message
        → transcript callback
        """

        if not isinstance(
            message,
            ListenV1Results,
        ):
            return

        channel = getattr(
            message,
            "channel",
            None,
        )

        alternatives = (
            getattr(
                channel,
                "alternatives",
                None,
            )
            if channel
            else None
        )

        if not alternatives:
            return

        alternative = alternatives[0]

        transcript = (
            getattr(
                alternative,
                "transcript",
                "",
            )
            or ""
        ).strip()

        confidence = float(
            getattr(
                alternative,
                "confidence",
                0.0,
            )
            or 0.0
        )

        is_final = bool(
            getattr(
                message,
                "is_final",
                False,
            )
        )

        speech_final = bool(
            getattr(
                message,
                "speech_final",
                False,
            )
        )

        from_finalize = bool(
            getattr(
                message,
                "from_finalize",
                False,
            )
        )

        self._last_confidence = confidence

        # -----------------------------------------------------
        # Final segment
        # -----------------------------------------------------

        if is_final:

            if transcript:

                with self._state_lock:

                    if (
                        not self._final_parts
                        or self._final_parts[-1]
                        != transcript
                    ):
                        self._final_parts.append(
                            transcript
                        )

                    self._interim_text = ""

            # PTT command is committed after stop_ptt.
            if (
                self._finalize_requested
                and (
                    from_finalize
                    or speech_final
                )
            ):
                self._emit_pending_final()

            return

        # -----------------------------------------------------
        # Interim transcript
        # -----------------------------------------------------

        if transcript:

            self._interim_text = transcript

            self._notify(
                "transcript",
                {
                    "type": "transcript",
                    "text": transcript,
                    "is_final": False,
                    "confidence": confidence,
                },
            )

    # =========================================================
    # Final transcript
    # =========================================================

    def _emit_pending_final(self):

        with self._state_lock:

            if self._final_emitted:
                return

            parts = list(
                self._final_parts
            )

            interim = (
                self._interim_text.strip()
            )

            if (
                interim
                and (
                    not parts
                    or parts[-1] != interim
                )
            ):
                parts.append(
                    interim
                )

            text = " ".join(
                part
                for part in parts
                if part
            ).strip()

            if not text:

                self._final_event.set()

                return

            self._final_emitted = True

            self._final_event.set()

            confidence = (
                self._last_confidence
            )

        self._notify(
            "transcript",
            {
                "type": "transcript",
                "text": text,
                "is_final": True,
                "confidence": confidence,
            },
        )

    # =========================================================
    # Error / Close
    # =========================================================

    def _handle_error(
        self,
        error,
    ):

        logger.error(
            "Deepgram error: %s",
            error,
        )

        self._notify(
            "error",
            str(error),
        )

    def _handle_close(
        self,
        _event,
    ):

        self._open_event.clear()

        self._notify(
            "close",
            None,
        )

    # =========================================================
    # Cleanup
    # =========================================================

    def _force_cleanup(self):

        connection_cm = (
            self._connection_cm
        )

        self._connection = None
        self._connection_cm = None
        self._listen_thread = None

        if connection_cm is not None:

            try:

                connection_cm.__exit__(
                    None,
                    None,
                    None,
                )

            except Exception:
                pass

        self.client = None

        self._open_event.clear()


# =============================================================
# Legacy/global service
# =============================================================

_stt_service: Optional[
    DeepgramSTTService
] = None


def get_stt_service() -> Optional[
    DeepgramSTTService
]:
    return _stt_service


def initialize_stt_service(
    api_key: str,
) -> bool:

    global _stt_service

    _stt_service = (
        DeepgramSTTService(
            api_key
        )
    )

    return _stt_service.start()


def cleanup_stt_service():

    global _stt_service

    if _stt_service is not None:

        _stt_service.stop()

        _stt_service = None