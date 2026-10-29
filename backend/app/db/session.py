import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings

logger = logging.getLogger(__name__)

Base = declarative_base()

def get_engine():
    """Attempts to connect using configured DATABASE_URL (MySQL); falls back to SQLite if unavailable."""
    url = settings.DATABASE_URL
    try:
        if url.startswith("mysql"):
            # Try to establish connection
            test_engine = create_engine(url, pool_pre_ping=True, pool_recycle=3600)
            with test_engine.connect() as conn:
                logger.info("Successfully connected to primary MySQL database.")
            return test_engine
        elif url.startswith("sqlite"):
            return create_engine(url, connect_args={"check_same_thread": False})
        else:
            return create_engine(url, pool_pre_ping=True)
    except Exception as e:
        logger.warning(
            f"Could not connect to primary DATABASE_URL ({url}): {e}. "
            f"Falling back to local SQLite ({settings.SQLITE_FALLBACK_URL}) for continuous development & testing."
        )
        return create_engine(settings.SQLITE_FALLBACK_URL, connect_args={"check_same_thread": False})

engine = get_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    """FastAPI dependency that provides a transactional database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
