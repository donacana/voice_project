"""Syntax/import validation for the Android remote backend changes.

Does NOT start the server or connect to PostgreSQL.
"""
import py_compile
import sys

files = [
    "app/routers.py",
    "app/stt_service.py",
    "app/main.py",
]

ok = True
for f in files:
    try:
        py_compile.compile(f, doraise=True)
        print(f"OK: {f}")
    except py_compile.PyCompileError as e:
        ok = False
        print(f"FAIL: {f}: {e}")

# Verify the Android endpoint and connection manager exist in routers.py
try:
    src = open("app/routers.py", encoding="utf-8").read()
    checks = {
        "RemoteConnectionManager": "RemoteConnectionManager" in src,
        "/ws/android": '"/ws/android"' in src,
        "/ws/commands": '"/ws/commands"' in src,
        "DeepgramSTTService import": "DeepgramSTTService" in src,
        "broadcast_action": "broadcast_action" in src,
        "broadcast_remote_status": "broadcast_remote_status" in src,
        "unregister_android": "unregister_android" in src,
        "register_react": "register_react" in src,
    }
    for name, present in checks.items():
        status = "OK" if present else "MISSING"
        print(f"{status}: {name}")
        if not present:
            ok = False
except Exception as e:
    ok = False
    print(f"FAIL: reading routers.py: {e}")

print("RESULT:", "PASS" if ok else "FAIL")
sys.exit(0 if ok else 1)