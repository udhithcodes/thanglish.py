import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.db.session import engine, SessionLocal, Base
from app.db.init_db import init_db_data
from app.models import *  # Import all models to ensure metadata is populated

# Import API Routers
from app.api.v1.auth import router as auth_router
from app.api.v1.questions import router as questions_router
from app.api.v1.quiz import router as quiz_router
from app.api.v1.bookmarks import router as bookmarks_router
from app.api.v1.progress import router as progress_router
from app.api.v1.admin import router as admin_router

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("thanglish.py")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: ensure tables exist and seed initial questions
    try:
        logger.info("Initializing database tables...")
        Base.metadata.create_all(bind=engine)
        db = SessionLocal()
        try:
            init_db_data(db)
        finally:
            db.close()
        logger.info("Database initialized successfully.")
    except Exception as e:
        logger.error(f"Error during database initialization: {e}")
    yield
    # Shutdown logic if needed

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Learn Python in Your Language: English, Tanglish, and Tamil.",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API Routers
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(questions_router, prefix=settings.API_V1_STR)
app.include_router(quiz_router, prefix=settings.API_V1_STR)
app.include_router(bookmarks_router, prefix=settings.API_V1_STR)
app.include_router(progress_router, prefix=settings.API_V1_STR)
app.include_router(admin_router, prefix=settings.API_V1_STR)

@app.get("/api/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "project": settings.PROJECT_NAME,
        "database": engine.url.drivername,
        "mode": "production" if "mysql" in engine.url.drivername else "development"
    }

@app.get("/", tags=["Root"])
def root():
    return {
        "message": "Welcome to thanglish.py API — Learn Python. Understand English. Think in Your Language.",
        "docs_url": "/docs"
    }
