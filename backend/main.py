import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, SessionLocal, Base
from app.seed_data import seed_initial_data

from app.routers import (
    health,
    waste_items,
    identification,
    collection_requests,
    dashboard,
    admin,
    partners,
)

# Logging configuration
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("ecosort")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Safe startup initialization: create tables idempotently and seed default waste items
    try:
        logger.info("Initializing database tables...")
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables initialized successfully.")

        db = SessionLocal()
        try:
            seeded = seed_initial_data(db)
            logger.info("Waste items verified/seeded: %d items in catalog.", seeded)
        finally:
            db.close()
    except Exception as e:
        logger.error("Database startup warning: %s", str(e))

    yield


app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description=(
        "EcoSort Backend REST API for Smart Waste Segregation, "
        "Recycling Guidance, and Recyclable Waste Collection Coordination."
    ),
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS configuration
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    settings.frontend_origin.rstrip("/"),
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if not settings.is_production else origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(health.router)
app.include_router(waste_items.router)
app.include_router(identification.router)
app.include_router(collection_requests.router)
app.include_router(dashboard.router)
app.include_router(admin.router)
app.include_router(partners.router)


@app.get("/")
def root():
    return {
        "name": settings.app_name,
        "version": settings.app_version,
        "status": "online",
        "docs": "/docs",
        "api_health": "/api/health",
        "tagline": "Sort Smart. Waste Less. Live Greener."
    }
