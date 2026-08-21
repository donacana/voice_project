import sys

try:
    import openai
    import fastapi
    import torch
    print(f"{sys.executable}: BACKEND_DEPS_OK")
except ImportError as e:
    print(f"{sys.executable}: MISSING {e}")