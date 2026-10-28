from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import CollectionRequest, WasteItem
from app.schemas import CollectionRequestAdmin
from app.security import verify_admin_access
from app.services.analytics_service import analytics_service

router = APIRouter(prefix="/api/admin", tags=["Admin Operations"])


@router.get("/requests", response_model=List[CollectionRequestAdmin])
def get_all_admin_requests(
    status_filter: Optional[str] = Query(None, alias="status"),
    category_filter: Optional[str] = Query(None, alias="category"),
    limit: int = Query(100, ge=1, le=200),
    db: Session = Depends(get_db),
    admin_auth: dict = Depends(verify_admin_access)
):
    query = db.query(CollectionRequest)
    if status_filter:
        query = query.filter(CollectionRequest.status == status_filter)
    if category_filter:
        query = query.filter(CollectionRequest.waste_category == category_filter)

    return query.order_by(CollectionRequest.created_at.desc()).limit(limit).all()


@router.get("/overview")
def get_admin_overview(
    db: Session = Depends(get_db),
    admin_auth: dict = Depends(verify_admin_access)
):
    stats = analytics_service.get_dashboard_stats(db)
    items_count = db.query(WasteItem).count()

    return {
        "stats": stats,
        "total_waste_items": items_count,
        "authorization_mode": admin_auth.get("notice", "Production Key Verified"),
        "is_demo_mode": admin_auth.get("is_demo", False),
    }
