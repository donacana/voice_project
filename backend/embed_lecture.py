"""PHASE 8: Generate OpenAI embeddings for lecture_contents and store in embeddings table.

Usage: backend/.venv\Scripts\python.exe backend/embed_lecture.py

Features:
- Reads lecture_contents from PostgreSQL
- Composes embedding input from: library name + category + content_type + title + content
- Batches to OpenAI Embedding API (text-embedding-3-small, 1536 dim)
- Idempotent: skips if valid embedding already exists for same content_id/model
- No duplicate embeddings
- Never prints API keys or full vectors
"""
import os
import re
import sys

# Load .env into environment (secrets stay hidden)
_env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".env")
if os.path.exists(_env_path):
    for line in open(_env_path, encoding="utf-8"):
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            k, v = line.split("=", 1)
            os.environ.setdefault(k.strip(), v.strip())

import openai
from app.db import engine, SessionLocal, UILibrary, LectureContent, Embedding

# Verify OpenAI API key is present
api_key = os.environ.get("OPENAI_API_KEY")
if not api_key or api_key.lower().startswith("your_"):
    print("ERROR: OPENAI_API_KEY not configured in environment")
    sys.exit(1)

openai.api_key = api_key
EMBEDDING_MODEL = os.environ.get("OPENAI_EMBEDDING_MODEL", "text-embedding-3-small")
DIMENSION = 1536  # text-embedding-3-small default dimension

print(f"Embedding model: {EMBEDDING_MODEL}")
print(f"Vector dimension: {DIMENSION}")
print(f"Total lecture contents to process: will count from DB")

# Fetch all lecture contents with library info
db = SessionLocal()
try:
    rows = (
        db.query(LectureContent, UILibrary.name, UILibrary.category)
        .join(UILibrary, LectureContent.library_id == UILibrary.id)
        .order_by(LectureContent.id)
        .all()
    )

    total = len(rows)
    print(f"Total lecture_contents: {total}")

    # Check existing embeddings for idempotency
    existing = db.query(Embedding.content_id).all()
    existing_ids = set(e[0] for e in existing)
    print(f"Existing embeddings: {len(existing_ids)}")

    # Group by content_id for idempotency check
    to_embed = []
    skipped = 0

    for content, lib_name, category in rows:
        content_id = content.id
        if content_id in existing_ids:
            # Check if existing embedding uses the same model
            emb = db.query(Embedding).filter_by(content_id=content_id).first()
            if emb and emb.embedding_model == EMBEDDING_MODEL:
                skipped += 1
                continue
            # Model mismatch or missing embedding - will re-embed
        # Compose embedding input text
        embedding_text = f"Library: {lib_name}\nCategory: {category}\nType: {content.content_type}\nTitle: {content.title}\nContent: {content.content}"
        to_embed.append((content_id, embedding_text))

    print(f"To embed: {len(to_embed)}, Skipped (already valid): {skipped}")

    if not to_embed:
        print("All contents already have valid embeddings. Nothing to do.")
        sys.exit(0)

    # Batch embed via OpenAI API (max 2048 tokens per request, but we have short texts)
    batch_size = 100  # OpenAI API allows up to 8191 inputs in newer versions, but 100 is safe
    vectors = []

    for i in range(0, len(to_embed), batch_size):
        batch = to_embed[i:i+batch_size]
        texts = [t for _, t in batch]
        
        response = openai.embeddings.create(
            model=EMBEDDING_MODEL,
            input=texts
        )
        
        for j, (content_id, _) in enumerate(batch):
            vector_data = response.data[j]
            vector = vector_data.embedding
            
            # Verify dimension
            if len(vector) != DIMENSION:
                print(f"WARNING: Vector dimension {len(vector)} != expected {DIMENSION} for content_id {content_id}")
            
            vectors.append((content_id, vector, EMBEDDING_MODEL))
        
        print(f"  Processed batch {i//batch_size + 1}: {min(i+batch_size, len(to_embed))}/{len(to_embed)}")

    # Store vectors in embeddings table (idempotent: upsert by content_id)
    print(f"Storing {len(vectors)} vectors in embeddings table...")
    for content_id, vector, model in vectors:
        # Delete any existing embedding for this content_id to ensure one-to-one
        db.query(Embedding).filter_by(content_id=content_id).delete()
        emb = Embedding(
            content_id=content_id,
            embedding=vector,
            embedding_model=model
        )
        db.add(emb)
    
    db.commit()
    print(f"Successfully stored {len(vectors)} embeddings")

    # Validation
    final_emb_count = db.query(Embedding).count()
    print(f"Final embeddings count in DB: {final_emb_count}")
    print(f" lecture_contents count: {total}")

    # Verify one-to-one
    emb_per_content = (
        db.query(Embedding.content_id, func=db.func.count("*"))
        .group_by(Embedding.content_id)
        .having(db.func.count("*") > 1)
        .count()
    )
    print(f"Duplicate content_ids: {emb_per_content}")

    # Verify dimension consistency
    dims = db.query(Embedding.embedding).all()
    inconsistent = 0
    for (vec,) in dims:
        if len(vec) != DIMENSION:
            inconsistent += 1
    print(f"Inconsistent vector dimensions: {inconsistent}")

    # Verify no NULL embeddings
    null_emb = db.query(Embedding).filter(Embedding_embedding == None).count() if hasattr(db, 'query') else 0
    print(f"NULL embeddings: {null_emb}")

finally:
    db.close()

print("\nEMBEDDING GENERATION COMPLETE")