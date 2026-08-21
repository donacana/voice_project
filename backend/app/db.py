"""
Database models and session management
"""
from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, ForeignKey, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from pgvector.sqlalchemy import Vector
from datetime import datetime
import os

# Load .env into environment before reading DATABASE_URL so local runs pick up
# the correct credentials.  Uses setdefault so Docker-injected env vars always
# take precedence.  Same pattern as routers.py / embed_lecture.py.
_env_candidates = [
    os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), ".env"),  # project root
    os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".env"),                  # backend/
]
for _env_path in _env_candidates:
    if os.path.exists(_env_path):
        for line in open(_env_path, encoding="utf-8"):
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                os.environ.setdefault(k.strip(), v.strip())

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:password@localhost:5432/voice_lecture")

engine = create_engine(DATABASE_URL, echo=False)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Models (placeholder - will be expanded in PHASE 6)
class UILibrary(Base):
    __tablename__ = "ui_libraries"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), unique=True, nullable=False, index=True)
    slug = Column(String(255), unique=True, nullable=False)
    category = Column(String(255), nullable=False)
    description = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

class LectureContent(Base):
    __tablename__ = "lecture_contents"
    
    id = Column(Integer, primary_key=True, index=True)
    library_id = Column(Integer, ForeignKey("ui_libraries.id"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    content_type = Column(String(255), nullable=False)  # introduction, features_use_case, comparison, install, example
    display_order = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)

    library = relationship("UILibrary", backref="lecture_contents")

class Embedding(Base):
    __tablename__ = "embeddings"
    
    id = Column(Integer, primary_key=True, index=True)
    content_id = Column(Integer, ForeignKey("lecture_contents.id"), nullable=False, unique=True, index=True)
    embedding = Column(Vector, nullable=False)  # pgvector column; dimension decided in Embedding phase
    embedding_model = Column(String(255), default="openai")
    created_at = Column(DateTime, default=datetime.utcnow)

    content = relationship("LectureContent", backref="embeddings")

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Create tables
def init_db():
    with engine.connect() as conn:
        conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector"))
        conn.commit()
    Base.metadata.create_all(bind=engine)
