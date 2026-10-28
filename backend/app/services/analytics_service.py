from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models import CollectionRequest
from app.schemas import DashboardStats, CategoryDistributionItem
from typing import List


class AnalyticsService:
    @staticmethod
    def get_dashboard_stats(db: Session) -> DashboardStats:
        total = db.query(CollectionRequest).count()
        completed = db.query(CollectionRequest).filter(CollectionRequest.status == "Collected").count()
        pending = db.query(CollectionRequest).filter(CollectionRequest.status == "Pending").count()
        scheduled = db.query(CollectionRequest).filter(CollectionRequest.status == "Scheduled").count()
        accepted = db.query(CollectionRequest).filter(CollectionRequest.status == "Accepted").count()

        completion_rate = (completed / total * 100.0) if total > 0 else 0.0

        return DashboardStats(
            total_requests=total,
            completed_requests=completed,
            pending_requests=pending,
            scheduled_requests=scheduled,
            accepted_requests=accepted,
            completion_rate_percent=round(completion_rate, 1)
        )

    @staticmethod
    def get_category_distribution(db: Session) -> List[CategoryDistributionItem]:
        total = db.query(CollectionRequest).count()
        if total == 0:
            return []

        results = (
            db.query(
                CollectionRequest.waste_category,
                func.count(CollectionRequest.id).label("count")
            )
            .group_by(CollectionRequest.waste_category)
            .order_by(func.count(CollectionRequest.id).desc())
            .all()
        )

        distribution = []
        for cat, count in results:
            pct = round((count / total) * 100.0, 1)
            distribution.append(CategoryDistributionItem(
                category=cat,
                count=count,
                percentage=pct
            ))

        return distribution


analytics_service = AnalyticsService()
