import datetime
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.database import get_db
from app.config import settings

router = APIRouter(prefix="/api", tags=["Health"])


@router.get("/health")
def health_check(db: Session = Depends(get_db)):
    if not settings.is_database_configured and settings.is_production:
        return {
            "status": "degraded",
            "service": settings.app_name,
            "version": settings.app_version,
            "environment": settings.app_env,
            "database": "unconfigured: DATABASE_URL environment variable is required in production. Please set your Neon/Supabase PostgreSQL connection string in Vercel project settings.",
            "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat()
        }

    db_status = "connected"
    try:
        db.execute(text("SELECT 1"))
    except Exception as e:
        db_status = f"unhealthy: {str(e)}"

    return {
        "status": "ok" if "unhealthy" not in db_status else "degraded",
        "service": settings.app_name,
        "version": settings.app_version,
        "environment": settings.app_env,
        "database": db_status,
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat()
    }
