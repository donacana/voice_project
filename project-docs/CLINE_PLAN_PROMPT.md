# CLINE PLAN PROMPT

You are in **Plan mode**.

Use the attached project documents as the authoritative source of truth:

- README.md
- MASTER_PLAN.md
- ARCHITECTURE.md
- DATABASE.md
- AI_RAG.md
- FRONTEND_UI.md
- IMPLEMENTATION_STEPS.md
- TEST_CHECKLIST.md
- CLINE_RULES.md

Do **not** implement anything yet.

Forbidden during Plan mode:
- create files
- modify files
- create folders
- run terminal commands
- install packages
- run Docker
- generate implementation code

First read all attached documents.

## Plan Tasks

1. Summarize the project goal.
2. Detect requirement conflicts.
3. Identify technically risky or impossible items.
4. Review low-resource AWS constraints.
5. Analyze package/CSS conflicts among the 10 UI libraries.
6. Review the Deepgram real-time STT approach.
7. Propose PyTorch intent model input/output structure.
8. Define when OpenAI LLM should and should not be called.
9. Review OpenAI Embedding + pgvector retrieval.
10. Check whether the 3-table DB schema is sufficient.
11. Recommend the simplest stable location for lecture context state.
12. Review Direct / Context / Search routing.
13. Review Docker Compose.
14. Consider HTTPS/browser microphone requirements on AWS.
15. Propose final folder structure.
16. Explain key file responsibilities.
17. Review implementation order.
18. Improve completion criteria.
19. Find missing tests.
20. Rank technical risks by severity.
21. Estimate disk usage.

## Disk Constraint

Current free space on C: is about 30 GB.

Project-related disk usage should target **10 GB or less** and must not exceed **12 GB** without explicit user approval.

Include:
- frontend source
- node_modules
- frontend build
- backend source
- Python `.venv`
- CPU PyTorch package
- intent dataset
- model checkpoint
- Docker images
- containers
- volumes
- PostgreSQL data
- pgvector data
- npm cache
- Python cache
- Docker build cache
- temporary files

Rules:
- CPU-only PyTorch.
- No CUDA packages.
- No local Whisper.
- Deepgram and OpenAI are external APIs.
- No large local pretrained models.
- Avoid duplicate package managers.
- One Python virtual environment.
- Avoid unnecessary Docker layers/images.
- Review multi-stage Docker builds.
- Report large disk-growth operations before implementation.
- If estimated usage exceeds 10 GB, explain why and propose reductions.
- Never perform a >12 GB-risk operation without approval.

Include a compact disk estimate table:

- Frontend source
- node_modules
- frontend build
- Backend source
- Python `.venv`
- CPU PyTorch
- Intent dataset
- Model checkpoint
- PostgreSQL + pgvector data
- Docker frontend image
- Docker backend image
- Docker postgres image
- Docker volumes/cache
- Other caches/temp
- Peak development usage
- Expected production usage
- Expected remaining C: free space

## Technology Lock

Do not silently replace the approved stack.

Do not add:
- Neo4j
- GraphRAG
- Redis
- local Whisper
- Kubernetes
- another database
- another backend framework
- separate RAG router service

If a problem exists, report it using:

```text
Problem:
Why:
Impact:
Recommended change:
If unchanged:
```

Do not apply the change without user approval.

## Response Rules

Respond in concise English.

Do not:
- translate the attached documents;
- restate all requirements;
- output code;
- add motivational commentary;
- repeat obvious information.

Prefer:
- short bullets;
- compact tables;
- clear risks;
- clear decisions;
- clear final plan.

## Required Final Response Structure

### 1. Requirement Understanding
### 2. Architecture Review
### 3. Conflicts / Missing Items
### 4. Proposed Final Folder Structure
### 5. Key File Responsibilities
### 6. Implementation Order Review
### 7. Phase Completion Criteria
### 8. Disk Usage Estimate
### 9. Technical Risks
### 10. Items Requiring User Approval
### 11. Pre-Agent Final Checklist

End after the Plan.
Wait for user approval.
Do not begin implementation.
