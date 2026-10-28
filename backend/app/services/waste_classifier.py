import logging
from typing import Optional, Tuple
from sqlalchemy.orm import Session
from app.models import WasteItem, WasteIdentificationLog
from app.schemas import WasteIdentifyResponse

logger = logging.getLogger("ecosort.classifier")

# Allowed MIME types
ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp", "image/jpg"}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB


class WasteClassifierService:
    @staticmethod
    def validate_image_file(content_type: str, file_size: int) -> Tuple[bool, Optional[str]]:
        if content_type not in ALLOWED_IMAGE_TYPES:
            return False, f"Unsupported file format '{content_type}'. Please upload JPEG, PNG, or WebP images."
        if file_size > MAX_FILE_SIZE:
            return False, f"File size exceeds 5MB limit ({file_size / (1024*1024):.2f}MB provided)."
        return True, None

    @staticmethod
    def identify_item(
        db: Session,
        item_slug_or_name: Optional[str] = None,
        image_bytes: Optional[bytes] = None,
        image_filename: Optional[str] = None
    ) -> WasteIdentifyResponse:
        """
        Modular waste classifier.
        When no paid vision model is configured, operates in explicitly labelled
        'Academic Demo / Manual Selection Mode'. Never fabricates artificial AI confidence scores.
        """
        matched_item = None

        if item_slug_or_name:
            # Look up item in database
            clean_query = item_slug_or_name.strip()
            matched_item = db.query(WasteItem).filter(
                (WasteItem.slug == clean_query.lower()) |
                (WasteItem.name.ilike(f"%{clean_query}%"))
            ).first()

        # If still no match or no query provided, select representative item or fallback
        if not matched_item:
            # Fallback to the first item in the database or a default item
            matched_item = db.query(WasteItem).first()

        if not matched_item:
            raise ValueError("No waste catalog entries available in database.")

        # Log identification in database for activity history
        log_entry = WasteIdentificationLog(
            selected_or_predicted_item=matched_item.name,
            category=matched_item.category,
            identification_mode="demo_manual",
            confidence_score=None,  # No fabricated confidence score
            notes=f"Identified via Manual / Demo Selection (File: {image_filename or 'None'})"
        )
        db.add(log_entry)
        db.commit()

        notice = (
            "Demonstration Mode: Identified item using manual catalog selection. "
            "To preserve serverless speed and avoid paid API key dependencies, "
            "production computer vision inference is bypassed in this academic prototype."
        )

        return WasteIdentifyResponse(
            item_name=matched_item.name,
            category=matched_item.category,
            disposal_instructions=matched_item.disposal_instructions,
            recycling_information=matched_item.recycling_information,
            preparation_instructions=matched_item.preparation_instructions,
            safety_warning=matched_item.safety_warning,
            recyclable=matched_item.recyclable,
            compostable=matched_item.compostable,
            identification_mode="demo_manual",
            confidence_score=None,
            notice=notice,
        )


classifier_service = WasteClassifierService()
