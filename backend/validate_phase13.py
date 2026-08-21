"""PHASE 13 validation script - verifies LLM service and routing logic."""
import sys
import os

# Add backend to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

print("=== PHASE 13 Validation ===")

# 1. Verify LLM service imports
try:
    from app.llm_service import LLMService, interpret_ambiguous_command, get_llm_service
    print("[OK] LLM service imports successfully")
except Exception as e:
    print(f"[FAIL] LLM service import error: {e}")
    sys.exit(1)

# 2. Verify routers import (which imports llm_service)
try:
    from app.routers import should_use_llm, LLMInterpretRequest, LLMInterpretResponse
    print("[OK] Routers import successfully")
except Exception as e:
    print(f"[FAIL] Routers import error: {e}")
    sys.exit(1)

# 3. Verify routing logic
print("\n=== Routing Logic Tests ===")

# NEXT should NOT use LLM
assert should_use_llm("NEXT", 0.95, False) == False, "NEXT should not use LLM"
print("[OK] NEXT -> no LLM")

# PREVIOUS should NOT use LLM
assert should_use_llm("PREVIOUS", 0.92, False) == False, "PREVIOUS should not use LLM"
print("[OK] PREVIOUS -> no LLM")

# SHOW_INSTALL should NOT use LLM
assert should_use_llm("SHOW_INSTALL", 0.88, False) == False, "SHOW_INSTALL should not use LLM"
print("[OK] SHOW_INSTALL -> no LLM")

# Clear SEARCH (high confidence) should NOT use LLM
assert should_use_llm("SEARCH", 0.85, False) == False, "Clear SEARCH should not use LLM"
print("[OK] Clear SEARCH -> no LLM")

# Ambiguous SEARCH (below threshold) SHOULD use LLM
assert should_use_llm("SEARCH", 0.45, True) == True, "Ambiguous SEARCH should use LLM"
print("[OK] Ambiguous SEARCH -> LLM fallback")

# Unknown/below-threshold SHOULD use LLM
assert should_use_llm("UNKNOWN", 0.3, True) == True, "Unknown should use LLM"
print("[OK] Unknown/below-threshold -> LLM fallback")

# 4. Verify API key is present (without printing it)
api_key = os.environ.get("OPENAI_API_KEY", "")
assert api_key and not api_key.lower().startswith("your_"), "OPENAI_API_KEY not configured"
print("[OK] OPENAI_API_KEY present and non-empty")

# 5. Verify LLM service can be instantiated
try:
    service = get_llm_service()
    assert service is not None, "LLM service is None"
    print("[OK] LLM service instantiated")
except Exception as e:
    print(f"[FAIL] LLM service instantiation error: {e}")
    sys.exit(1)

print("\n=== ALL PHASE 13 VALIDATION CHECKS PASSED ===")