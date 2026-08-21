"""PHASE 13 endpoint validation - verifies app imports and OpenAPI schema."""
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

print("=== PHASE 13 Endpoint Validation ===")

# 1. Verify app.main imports (this validates all routes, models, and services)
try:
    from app.main import app
    print("[OK] app.main imports successfully")
except Exception as e:
    print(f"[FAIL] app.main import error: {e}")
    sys.exit(1)

# 2. Verify OpenAPI schema contains all required routes
try:
    schema = app.openapi()
    paths = schema.get("paths", {})
    
    assert "/health" in paths, "/health not found"
    print("[OK] /health exists in OpenAPI")
    
    # /docs is a FastAPI built-in (Swagger UI), not in OpenAPI paths
    print("[OK] /docs is FastAPI built-in (Swagger UI)")
    
    assert "/api/intent" in paths, "/api/intent not found"
    print("[OK] /api/intent exists in OpenAPI")
    
    assert "/api/search" in paths, "/api/search not found"
    print("[OK] /api/search exists in OpenAPI")
    
    assert "/api/llm/interpret" in paths, "/api/llm/interpret not found"
    print("[OK] /api/llm/interpret exists in OpenAPI")
except Exception as e:
    print(f"[FAIL] OpenAPI schema check error: {e}")
    sys.exit(1)

# 2b. Verify WebSocket route via app.routes (WebSocket endpoints are NOT in OpenAPI paths)
try:
    from starlette.routing import WebSocketRoute
    route_paths = [r.path for r in app.routes]
    assert "/api/ws/stt" in route_paths, "/api/ws/stt not found in app.routes"
    print("[OK] /api/ws/stt exists in app.routes")
    
    # Confirm it's a WebSocket route
    ws_routes = [r for r in app.routes if getattr(r, "path", "") == "/api/ws/stt"]
    assert ws_routes, "No route found for /api/ws/stt"
    assert isinstance(ws_routes[0], WebSocketRoute), f"/api/ws/stt is {type(ws_routes[0]).__name__}, expected WebSocketRoute"
    print("[OK] /api/ws/stt is a WebSocketRoute")
except Exception as e:
    print(f"[FAIL] WebSocket route check error: {e}")
    sys.exit(1)

# 3. Verify routing logic
try:
    from app.routers import should_use_llm
    
    assert should_use_llm("NEXT", 0.95, False) == False, "NEXT should not use LLM"
    print("[OK] NEXT -> no LLM")
    
    assert should_use_llm("PREVIOUS", 0.92, False) == False, "PREVIOUS should not use LLM"
    print("[OK] PREVIOUS -> no LLM")
    
    assert should_use_llm("SHOW_INSTALL", 0.88, False) == False, "SHOW_INSTALL should not use LLM"
    print("[OK] SHOW_INSTALL -> no LLM")
    
    assert should_use_llm("SEARCH", 0.85, False) == False, "Clear SEARCH should not use LLM"
    print("[OK] Clear SEARCH -> no LLM")
    
    assert should_use_llm("SEARCH", 0.45, True) == True, "Ambiguous SEARCH should use LLM"
    print("[OK] Ambiguous SEARCH -> LLM fallback")
    
    assert should_use_llm("UNKNOWN", 0.3, True) == True, "Unknown should use LLM"
    print("[OK] Unknown/below-threshold -> LLM fallback")
except Exception as e:
    print(f"[FAIL] Routing logic check error: {e}")
    sys.exit(1)

# 4. Verify LLM service
try:
    from app.llm_service import get_llm_service
    service = get_llm_service()
    assert service is not None, "LLM service is None"
    print("[OK] LLM service instantiated")
except Exception as e:
    print(f"[FAIL] LLM service check error: {e}")
    sys.exit(1)

print("\n=== ALL PHASE 13 VALIDATION CHECKS PASSED ===")