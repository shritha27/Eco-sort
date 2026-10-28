import datetime
from sqlalchemy import Column, Integer, String, Text, Boolean, Float, Date, DateTime
from app.database import Base


class WasteItem(Base):
    __tablename__ = "waste_items"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False, index=True)
    slug = Column(String(200), unique=True, index=True, nullable=False)
    category = Column(String(100), nullable=False, index=True)
    description = Column(Text, nullable=False)
    disposal_instructions = Column(Text, nullable=False)
    recycling_information = Column(Text, nullable=False)
    preparation_instructions = Column(Text, nullable=False)
    safety_warning = Column(Text, nullable=True)
    recyclable = Column(Boolean, default=False, nullable=False)
    compostable = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc))
    updated_at = Column(
        DateTime,
        default=lambda: datetime.datetime.now(datetime.timezone.utc),
        onupdate=lambda: datetime.datetime.now(datetime.timezone.utc)
    )


class CollectionRequest(Base):
    __tablename__ = "collection_requests"

    id = Column(Integer, primary_key=True, index=True)
    request_code = Column(String(50), unique=True, index=True, nullable=False)
    requester_name = Column(String(150), nullable=False)
    contact_email = Column(String(150), nullable=True)
    contact_phone = Column(String(50), nullable=True)
    waste_category = Column(String(100), nullable=False, index=True)
    description = Column(Text, nullable=False)
    quantity = Column(Float, nullable=False)
    quantity_unit = Column(String(30), default="kg", nullable=False)
    pickup_area = Column(String(250), nullable=False)
    preferred_pickup_date = Column(Date, nullable=False)
    status = Column(String(50), default="Pending", index=True, nullable=False)
    partner_note = Column(Text, nullable=True)
    cancellation_reason = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc))
    updated_at = Column(
        DateTime,
        default=lambda: datetime.datetime.now(datetime.timezone.utc),
        onupdate=lambda: datetime.datetime.now(datetime.timezone.utc)
    )


class WasteIdentificationLog(Base):
    __tablename__ = "waste_identification_logs"

    id = Column(Integer, primary_key=True, index=True)
    selected_or_predicted_item = Column(String(200), nullable=False)
    category = Column(String(100), nullable=False)
    identification_mode = Column(String(50), nullable=False)  # "demo_manual" | "model_inference"
    confidence_score = Column(Float, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc))
