from typing import Optional
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import WasteIdentifyResponse
from app.services.waste_classifier import classifier_service

router = APIRouter(prefix="/api/identify", tags=["Waste Identification"])


@router.post("", response_model=WasteIdentifyResponse)
async def identify_waste(
    manual_item: Optional[str] = Form(None, description="Selected item name from manual catalog"),
    image: Optional[UploadFile] = File(None, description="Uploaded waste photo for identification"),
    db: Session = Depends(get_db)
):
    image_bytes = None
    filename = None

    if image and image.filename:
        filename = image.filename
        content_type = image.content_type or "application/octet-stream"
        
        # Read file bytes in memory (up to 5MB)
        image_bytes = await image.read()
        file_size = len(image_bytes)

        # Validate MIME type and size limit
        is_valid, error_msg = classifier_service.validate_image_file(content_type, file_size)
        if not is_valid:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=error_msg
            )

    if not manual_item and not image_bytes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please provide an image file or select an item manually."
        )

    try:
        result = classifier_service.identify_item(
            db=db,
            item_slug_or_name=manual_item,
            image_bytes=image_bytes,
            image_filename=filename
        )
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Identification processing error: {str(e)}"
        )
