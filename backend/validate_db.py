"""Database validation script — READ-ONLY.

This script NEVER modifies project data. It validates:
1. PostgreSQL connection
2. pgvector extension
3. The 3 core tables exist
4. Row counts match the expected project state (10 libraries / 50 contents / 50 embeddings)
5. Foreign-key relationships work (checked against existing rows)

It contains NO .delete(), DELETE FROM, DROP, or TRUNCATE operations.
If this script ever writes to the DB, that is a bug — fix it.
"""
from sqlalchemy import text
from app.db import engine, SessionLocal, UILibrary, LectureContent, Embedding


def main():
    print("=== 1. Backend connects to PostgreSQL ===")
    with engine.connect() as conn:
        result = conn.execute(text("SELECT version()"))
        print(f"  Connected: {result.scalar()[:50]}...")

    print("\n=== 2. pgvector extension exists ===")
    with engine.connect() as conn:
        result = conn.execute(
            text("SELECT extname, extversion FROM pg_extension WHERE extname = 'vector'")
        )
        row = result.fetchone()
        assert row is not None, "pgvector extension missing"
        print(f"  {row.extname} {row.extversion}")

    print("\n=== 3. The 3 core tables exist ===")
    with engine.connect() as conn:
        result = conn.execute(
            text("SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename")
        )
        tables = [r[0] for r in result]
        print(f"  Tables: {tables}")
        for t in ["ui_libraries", "lecture_contents", "embeddings"]:
            assert t in tables, f"Missing table: {t}"

    print("\n=== 4. READ-ONLY row-count check (project data must be preserved) ===")
    db = SessionLocal()
    try:
        lib_count = db.query(UILibrary).count()
        content_count = db.query(LectureContent).count()
        emb_count = db.query(Embedding).count()
        print(f"  ui_libraries:     {lib_count}  (expected 10)")
        print(f"  lecture_contents: {content_count}  (expected 50)")
        print(f"  embeddings:       {emb_count}  (expected 50)")
        assert lib_count == 10, f"Expected 10 libraries, got {lib_count}"
        assert content_count == 50, f"Expected 50 lecture contents, got {content_count}"
        assert emb_count == 50, f"Expected 50 embeddings, got {emb_count}"
    finally:
        db.close()

    print("\n=== 5. Foreign-key relationships (checked on existing rows, read-only) ===")
    db = SessionLocal()
    try:
        lib = db.query(UILibrary).first()
        assert lib is not None, "No library rows to validate relationships"
        contents = db.query(LectureContent).filter_by(library_id=lib.id).all()
        assert len(contents) == 5, f"Expected 5 contents per library, got {len(contents)}"
        print(
            f"  ORM relationship: lecture_contents.library_id -> ui_libraries.id OK "
            f"({lib.name}, {len(contents)} contents)"
        )

        content = contents[0]
        emb = db.query(Embedding).filter_by(content_id=content.id).first()
        assert emb is not None, f"No embedding for content_id={content.id}"
        print(f"  ORM relationship: embeddings.content_id -> lecture_contents.id OK (content_id={content.id})")

        with engine.connect() as conn:
            orphan_lecture = conn.execute(text(
                "SELECT COUNT(*) FROM lecture_contents lc "
                "LEFT JOIN ui_libraries ul ON lc.library_id = ul.id WHERE ul.id IS NULL"
            )).scalar()
            orphan_emb = conn.execute(text(
                "SELECT COUNT(*) FROM embeddings e "
                "LEFT JOIN lecture_contents lc ON e.content_id = lc.id WHERE lc.id IS NULL"
            )).scalar()
            assert orphan_lecture == 0, f"Orphan lecture_contents: {orphan_lecture}"
            assert orphan_emb == 0, f"Orphan embeddings: {orphan_emb}"
            print("  FK integrity: 0 orphan lecture_contents, 0 orphan embeddings OK")
    finally:
        db.close()

    print("\nALL DATABASE VALIDATION CHECKS PASSED (read-only, no data modified)")


if __name__ == "__main__":
    main()