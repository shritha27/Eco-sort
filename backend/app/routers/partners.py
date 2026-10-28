from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Body
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import CollectionRequest
from app.schemas import CollectionRequestAdmin
from app.security import verify_partner_access

router = APIRouter(prefix="/api/partners", tags=["Collection Partners"])


@router.get("/requests", response_model=List[CollectionRequestAdmin])
def get_partner_requests(
    status_filter: Optional[str] = None,
    db: Session = Depends(get_db),
    auth: dict = Depends(verify_partner_access)
):
    query = db.query(CollectionRequest)
    if status_filter:
        query = query.filter(CollectionRequest.status == status_filter)
    else:
        # Default to actionable requests
        query = query.filter(CollectionRequest.status.in_(["Pending", "Accepted", "Scheduled"]))

    return query.order_by(CollectionRequest.preferred_pickup_date.asc()).all()


@router.post("/requests/{request_id}/accept", response_model=CollectionRequestAdmin)
def accept_request(
    request_id: int,
    note: Optional[str] = Body(None, embed=True),
    db: Session = Depends(get_db),
    auth: dict = Depends(verify_partner_access)
):
    req = db.query(CollectionRequest).filter(CollectionRequest.id == request_id).first()
    if not req:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Request not found.")

    if req.status != "Pending":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot accept request in '{req.status}' state. Only 'Pending' requests may be accepted."
        )

    req.status = "Accepted"
    if note:
        req.partner_note = note
    db.commit()
    db.refresh(req)
    return req


@router.post("/requests/{request_id}/schedule", response_model=CollectionRequestAdmin)
def schedule_request(
    request_id: int,
    note: Optional[str] = Body(None, embed=True),
    db: Session = Depends(get_db),
    auth: dict = Depends(verify_partner_access)
):
    req = db.query(CollectionRequest).filter(CollectionRequest.id == request_id).first()
    if not req:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Request not found.")

    if req.status not in ("Pending", "Accepted"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot schedule request in '{req.status}' state."
        )

    req.status = "Scheduled"
    if note:
        req.partner_note = note
    db.commit()
    db.refresh(req)
    return req


@router.post("/requests/{request_id}/complete", response_model=CollectionRequestAdmin)
def complete_request(
    request_id: int,
    note: Optional[str] = Body(None, embed=True),
    db: Session = Depends(get_db),
    auth: dict = Depends(verify_partner_access)
):
    req = db.query(CollectionRequest).filter(CollectionRequest.id == request_id).first()
    if not req:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Request not found.")

    req.status = "Collected"
    if note:
        req.partner_note = note
    db.commit()
    db.refresh(req)
    return req
