"""PHASE 14 validation helper - mirrors the frontend handleVoiceAction mapping.

This is a pure-Python replica of frontend/src/App.tsx handleVoiceAction used to
validate the action -> navigation contract without a browser. It calls the same
named methods a React component would call: next_library(), prev_library(),
navigate(screen, library).
"""


class ActionExecutor:
    """Replicates frontend handleVoiceAction dispatch for validation."""

    def __init__(self, nav):
        """
        nav must expose:
          - next_library()
          - prev_library()
          - navigate(screen, library)
        """
        self.nav = nav

    def execute(self, action: dict) -> None:
        act = action.get("action")
        library_key = action.get("library_key")
        screen = action.get("screen")
        content_type = action.get("content_type")

        if act == "NEXT":
            self.nav.next_library()
        elif act == "PREVIOUS":
            self.nav.prev_library()
        elif act == "HOME":
            self.nav.navigate("intro", self._current_library())
        elif act == "OVERVIEW":
            self.nav.navigate("library-overview", self._current_library())
        elif act == "SHOW_DEMO":
            self.nav.navigate("library-demo", self._current_library())
        elif act == "SHOW_LECTURE":
            self.nav.navigate("lecture-content", self._current_library())
            if content_type:
                self._set_content_type(content_type)
        elif act == "SHOW_INSTALL":
            # Preserve current library; open installation lecture content
            self.nav.navigate("lecture-content", self._current_library())
            self._set_content_type("install")
        elif act == "SELECT_LIBRARY":
            if library_key:
                target_screen = screen or "library-demo"
                self.nav.navigate(target_screen, library_key)
                if content_type:
                    self._set_content_type(content_type)
        elif act == "SEARCH_RESULT":
            if library_key:
                self.nav.navigate("lecture-content", library_key)
                if content_type:
                    self._set_content_type(content_type)
        else:
            pass  # ignore unknown actions

    def _current_library(self) -> str:
        return self.nav.current["library"]

    def _set_content_type(self, content_type: str) -> None:
        if hasattr(self.nav, "current"):
            self.nav.current["content_type"] = content_type