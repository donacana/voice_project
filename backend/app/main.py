from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.db import init_db

# Lifespan context for startup/shutdown
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("Backend starting up...")
    init_db()
    yield
    # Shutdown
    print("Backend shutting down...")

# Create FastAPI app
app = FastAPI(
    title="Voice Lecture API",
    description="Backend for React UI Voice Lecture",
    version="1.0.0",
    lifespan=lifespan
)

# Add CORS middleware - only for React dev origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include search router for Vector RAG retrieval
from app.routers import router
app.include_router(router, prefix="/api")

# Health check endpoint
@app.get("/health")
async def health():
    return {"status": "ok"}

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Voice Lecture API",
        "docs": "/docs",
        "health": "/health"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)