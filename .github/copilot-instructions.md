# Copilot Instructions

Base on Ponytail: prefer the smallest correct implementation, do not over-engineer, reuse existing code and installed dependencies before adding anything new, and avoid unnecessary abstractions.

Project rules:
- Work only on the explicitly requested PHASE.
- Never automatically proceed to the next PHASE.
- Stop after completing the requested PHASE and wait for user approval.
- Prefer the smallest correct implementation.
- Avoid over-engineering.
- Reuse existing code and installed dependencies before adding new code or packages.
- Do not create unnecessary abstractions, files, folders, services, helpers, or dependencies.
- Do not silently change the approved architecture.

Approved stack:
- Frontend: React, Vite
- Backend: FastAPI
- Database: PostgreSQL + pgvector
- Speech-to-Text: Deepgram API
- Intent Classification: PyTorch, CPU-only, lightweight classifier only
- LLM: OpenAI API only when ambiguity, context, comparison, or synthesis requires it
- Embedding: OpenAI Embedding API
- Retrieval: Vector RAG only
- Deployment: Docker Compose, AWS

Forbidden unless explicitly approved later:
- Neo4j
- GraphRAG
- Redis
- local Whisper
- CUDA
- Kubernetes
- large local pretrained AI models
- another backend framework
- another database
- unnecessary microservices
- separate RAG Router service

AI routing priority:
1. Deterministic existing content
2. Current lecture context
3. Vector RAG
4. LLM only when actually required

Project limits:
- Target total project size <= 10 GB
- Hard stop at 12 GB without explicit user approval
- CPU-only PyTorch
- No CUDA
- No local Whisper
- No large local models
- One Python virtual environment
- One JavaScript package manager

Dependency rules:
- Prefer official/current packages.
- Avoid deprecated packages.
- Avoid duplicate dependencies.
- Do not run npm audit fix --force without approval.
- Do not perform unrelated major dependency upgrades.

Validation rules:
- Validate after meaningful changes.
- Fix failures before continuing.
- Never claim something works without a real validation step.
- If blocked, report the actual blocker instead of silently substituting another architecture or library.

Ponytail summary:
- Do not write code before checking whether it is needed at all.
- Reuse existing helpers, patterns, and installed packages first.
- Fix the root cause instead of symptoms.
- Prefer the shortest working diff that is correct.
- Keep deliberate simplifications visible and explicit.
- Stop when the requested PHASE is complete and wait for approval.
