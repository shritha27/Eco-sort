from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, func
from app.database import get_db
from app.models import WasteItem
from app.schemas import WasteItemOut, WasteItemCreate, WasteItemUpdate
from app.seed_data import slugify
from app.security import verify_admin_access

router = APIRouter(prefix="/api/waste-items", tags=["Waste Guide"])


@router.get("", response_model=List[WasteItemOut])
def get_waste_items(
    category: Optional[str] = Query(None, description="Filter by category"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db)
):
    query = db.query(WasteItem)
    if category:
        query = query.filter(WasteItem.category == category)
    return query.order_by(WasteItem.name.asc()).offset(skip).limit(limit).all()


@router.get("/categories", response_model=List[str])
def get_categories(db: Session = Depends(get_db)):
    results = db.query(WasteItem.category).distinct().all()
    return [r[0] for r in results if r[0]]


@router.get("/search", response_model=List[WasteItemOut])
def search_waste_items(
    q: str = Query(..., min_length=1, description="Search term for waste item or instructions"),
    db: Session = Depends(get_db)
):
    search_term = f"%{q.strip()}%"
    results = db.query(WasteItem).filter(
        or_(
            WasteItem.name.ilike(search_term),
            WasteItem.description.ilike(search_term),
            WasteItem.disposal_instructions.ilike(search_term),
            WasteItem.recycling_information.ilike(search_term),
            WasteItem.category.ilike(search_term)
        )
    ).order_by(WasteItem.name.asc()).limit(30).all()
    return results


@router.get("/{item_id}", response_model=WasteItemOut)
def get_waste_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(WasteItem).filter(WasteItem.id == item_id).first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Waste item with ID {item_id} not found."
        )
    return item


@router.post("", response_model=WasteItemOut, status_code=status.HTTP_201_CREATED)
def create_waste_item(
    item_in: WasteItemCreate,
    db: Session = Depends(get_db),
    admin_auth: dict = Depends(verify_admin_access)
):
    slug = item_in.slug or slugify(item_in.name)
    existing = db.query(WasteItem).filter(WasteItem.slug == slug).first()
    if existing:
        slug = f"{slug}-{int(func.random() * 1000)}"

    item = WasteItem(
        name=item_in.name,
        slug=slug,
        category=item_in.category,
        description=item_in.description,
        disposal_instructions=item_in.disposal_instructions,
        recycling_information=item_in.recycling_information,
        preparation_instructions=item_in.preparation_instructions,
        safety_warning=item_in.safety_warning,
        recyclable=item_in.recyclable,
        compostable=item_in.compostable,
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.put("/{item_id}", response_model=WasteItemOut)
def update_waste_item(
    item_id: int,
    item_in: WasteItemUpdate,
    db: Session = Depends(get_db),
    admin_auth: dict = Depends(verify_admin_access)
):
    item = db.query(WasteItem).filter(WasteItem.id == item_id).first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Waste item with ID {item_id} not found."
        )

    update_data = item_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(item, field, value)

    db.commit()
    db.refresh(item)
    return item


@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_waste_item(
    item_id: int,
    db: Session = Depends(get_db),
    admin_auth: dict = Depends(verify_admin_access)
):
    item = db.query(WasteItem).filter(WasteItem.id == item_id).first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Waste item with ID {item_id} not found."
        )
    db.delete(item)
    db.commit()
    return None
