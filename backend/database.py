import logging
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base
from backend.config import settings

logger = logging.getLogger(__name__)

SQLITE_FALLBACK_URL = "sqlite:///./learni_local.db"


def _build_engine(db_url: str):
    """Try to create and verify a database engine. Returns None on failure."""
    is_sqlite = db_url.startswith("sqlite")
    connect_args: dict = {"check_same_thread": False} if is_sqlite else {"connect_timeout": 5}
    try:
        eng = create_engine(
            db_url,
            connect_args=connect_args,
            pool_pre_ping=True,
            pool_timeout=5,
        )
        # Quick connectivity test
        with eng.connect() as conn:
            conn.execute(text("SELECT 1"))
        return eng
    except Exception as exc:
        logger.warning("Could not connect to %s — %s", db_url, exc)
        return None


def _get_engine():
    primary_url = settings.DATABASE_URL

    # Normalize postgres:// to postgresql:// for SQLAlchemy compatibility
    if primary_url.startswith("postgres://"):
        primary_url = primary_url.replace("postgres://", "postgresql://", 1)

    # Always try primary URL first (Supabase / PostgreSQL)
    if not primary_url.startswith("sqlite"):
        eng = _build_engine(primary_url)
        if eng is not None:
            logger.info("✅ Connected to primary database: %s", primary_url.split("@")[-1])
            return eng, primary_url
        
        # If we are in production, DO NOT fall back to SQLite to prevent silent data loss!
        if settings.APP_ENV == "production":
            raise RuntimeError(
                f"FATAL: Database connection failed for primary database URL (Supabase/PostgreSQL). "
                f"SQLite fallback is disabled in production to prevent silent data loss."
            )
        logger.warning("⚠️  Primary database unreachable. Falling back to SQLite.")

    # Fallback to SQLite for local development / offline mode
    eng = _build_engine(SQLITE_FALLBACK_URL)
    if eng is not None:
        logger.info("✅ Using SQLite fallback database: %s", SQLITE_FALLBACK_URL)
        return eng, SQLITE_FALLBACK_URL

    raise RuntimeError("Could not establish any database connection.")


engine, _active_db_url = _get_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
