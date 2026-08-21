# React UI Voice Lecture Project

A voice-controlled React web application demonstrating 10 different UI library approaches.

## Quick Start

### Development

```bash
# Terminal 1: Frontend
cd frontend
npm install
npm run dev

# Terminal 2: Backend
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
python -m uvicorn app.main:app --reload

# Terminal 3 (optional): PostgreSQL
docker compose up postgres
```

### Build & Deploy

```bash
# Build frontend
cd frontend
npm run build

# Build Docker Compose stack
docker compose up --build
```

## Architecture

- **Frontend:** React + Vite
- **Backend:** FastAPI
- **Database:** PostgreSQL + pgvector
- **Speech-to-Text:** Deepgram API
- **Intent Classification:** PyTorch (trained in-project)
- **LLM Fallback:** OpenAI API
- **Embeddings:** OpenAI Embedding API
- **Deployment:** Docker Compose

## Documentation

See [project-docs/](project-docs/) for detailed documentation:
- MASTER_PLAN.md — Overall project vision
- ARCHITECTURE.md — System design
- DATABASE.md — Data schema
- AI_RAG.md — AI/RAG logic
- FRONTEND_UI.md — UI requirements
- IMPLEMENTATION_STEPS.md — Phase-by-phase roadmap
- TEST_CHECKLIST.md — Validation criteria
- CLINE_RULES.md — Implementation rules

## Phases

1. PHASE 1: Project skeleton ✓
2. PHASE 2: Frontend base (React + Vite)
3. PHASE 3-5: UI libraries + lecture UI
4. PHASE 6-9: Database + embeddings
5. PHASE 10-14: PyTorch + Deepgram + LLM
6. PHASE 15-18: End-to-end + Docker + AWS

## Environment Setup

Copy `.env.example` to `.env` and populate:

```bash
DEEPGRAM_API_KEY=...
OPENAI_API_KEY=...
POSTGRES_USER=postgres
POSTGRES_PASSWORD=...
POSTGRES_DB=voice_lecture
DATABASE_URL=postgresql://...
```

## Disk Usage Target

- Development: ≤ 10 GB (soft target)
- Hard limit: 12 GB without approval
- No CUDA, no local Whisper, no large pretrained models

## License

Internal project.
