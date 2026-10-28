import datetime
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.database import get_db
from app.config import settings

router = APIRouter(prefix="/api", tags=["Health"])


@router.get("/health")
def health_check(db: Session = Depends(get_db)):
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
