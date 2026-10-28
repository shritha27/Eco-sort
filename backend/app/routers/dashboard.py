from typing import List, Dict
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import DashboardStats, CategoryDistributionItem
from app.services.analytics_service import analytics_service

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])


@router.get("/stats", response_model=DashboardStats)
def get_stats(db: Session = Depends(get_db)):
    return analytics_service.get_dashboard_stats(db)


@router.get("/category-distribution", response_model=List[CategoryDistributionItem])
def get_category_distribution(db: Session = Depends(get_db)):
    return analytics_service.get_category_distribution(db)


@router.get("/daily-tips", response_model=List[Dict[str, str]])
def get_daily_tips():
    return [
        {
            "id": "tip-1",
            "category": "Contamination Prevention",
            "title": "Rinse Before Binning",
            "text": "Food residue on recyclables contaminates entire recycling batches. Rinse plastic and glass jars before sorting."
        },
        {
            "id": "tip-2",
            "category": "Composting",
            "title": "Balance Greens and Browns",
            "text": "For rapid odor-free composting, balance nitrogen-rich vegetable scraps (greens) with carbon-rich dried leaves or shredded cardboard (browns)."
        },
        {
            "id": "tip-3",
            "category": "Hazardous Waste",
            "title": "Never Trash Batteries",
            "text": "Corroded batteries leak toxic cadmium and lead into groundwater. Always store them safely and hand over to certified e-waste recyclers."
        },
        {
            "id": "tip-4",
            "category": "Plastic Segregation",
            "title": "Check Resin Codes",
            "text": "Rigid PET (#1) and HDPE (#2) bottles are the most widely recycled plastics. Thin plastic film wraps require separate specialized recovery."
        }
    ]
