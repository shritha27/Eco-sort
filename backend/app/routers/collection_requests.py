from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import CollectionRequest
from app.schemas import (
    CollectionRequestCreate,
    CollectionRequestPublic,
    CollectionRequestAdmin,
    CollectionRequestStatusUpdate,
    CollectionRequestCancel,
)
from app.security import generate_request_code, verify_partner_access

router = APIRouter(prefix="/api/collection-requests", tags=["Collection Requests"])


@router.post("", response_model=CollectionRequestPublic, status_code=status.HTTP_201_CREATED)
def create_collection_request(
    request_in: CollectionRequestCreate,
    db: Session = Depends(get_db)
):
    request_code = generate_request_code()

    # Ensure code uniqueness
    while db.query(CollectionRequest).filter(CollectionRequest.request_code == request_code).first():
        request_code = generate_request_code()

    new_request = CollectionRequest(
        request_code=request_code,
        requester_name=request_in.requester_name,
        contact_email=request_in.contact_email,
        contact_phone=request_in.contact_phone,
        waste_category=request_in.waste_category,
        description=request_in.description,
        quantity=request_in.quantity,
        quantity_unit=request_in.quantity_unit,
        pickup_area=request_in.pickup_area,
        preferred_pickup_date=request_in.preferred_pickup_date,
        status="Pending",
        partner_note=f"Additional instructions: {request_in.additional_notes}" if request_in.additional_notes else None,
    )
    db.add(new_request)
    db.commit()
    db.refresh(new_request)

    return new_request


@router.get("", response_model=List[CollectionRequestPublic])
def list_collection_requests(
    tracking_code: Optional[str] = Query(None, description="Look up by exact tracking code"),
    status_filter: Optional[str] = Query(None, alias="status"),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    query = db.query(CollectionRequest)

    if tracking_code:
        query = query.filter(CollectionRequest.request_code == tracking_code.strip().upper())
        return query.all()

    if status_filter:
        query = query.filter(CollectionRequest.status == status_filter)

    # Return public list with sanitized fields
    return query.order_by(CollectionRequest.created_at.desc()).limit(limit).all()


@router.get("/{request_code}", response_model=CollectionRequestPublic)
def get_request_by_tracking_code(
    request_code: str,
    db: Session = Depends(get_db)
):
    request_obj = db.query(CollectionRequest).filter(
        CollectionRequest.request_code == request_code.strip().upper()
    ).first()

    if not request_obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Collection request with code '{request_code}' was not found."
        )

    return request_obj


@router.patch("/{request_id}/status", response_model=CollectionRequestAdmin)
def update_request_status(
    request_id: int,
    status_in: CollectionRequestStatusUpdate,
    db: Session = Depends(get_db),
    auth: dict = Depends(verify_partner_access)
):
    request_obj = db.query(CollectionRequest).filter(CollectionRequest.id == request_id).first()
    if not request_obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Collection request with ID {request_id} was not found."
        )

    request_obj.status = status_in.status
    if status_in.partner_note is not None:
        request_obj.partner_note = status_in.partner_note

    db.commit()
    db.refresh(request_obj)
    return request_obj


@router.post("/{request_code}/cancel", response_model=CollectionRequestPublic)
def cancel_collection_request(
    request_code: str,
    cancel_in: Optional[CollectionRequestCancel] = None,
    db: Session = Depends(get_db)
):
    request_obj = db.query(CollectionRequest).filter(
        CollectionRequest.request_code == request_code.strip().upper()
    ).first()

    if not request_obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Collection request with code '{request_code}' was not found."
        )

    if request_obj.status != "Pending":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot cancel request in '{request_obj.status}' status. Only 'Pending' requests may be cancelled."
        )

    request_obj.status = "Cancelled"
    if cancel_in and cancel_in.cancellation_reason:
        request_obj.cancellation_reason = cancel_in.cancellation_reason

    db.commit()
    db.refresh(request_obj)
    return request_obj
