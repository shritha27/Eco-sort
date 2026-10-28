import datetime
from typing import Optional
from pydantic import BaseModel, Field, field_validator, ConfigDict


# Waste Items
class WasteItemBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=200)
    category: str = Field(..., min_length=2, max_length=100)
    description: str = Field(..., min_length=5)
    disposal_instructions: str = Field(..., min_length=5)
    recycling_information: str = Field(..., min_length=5)
    preparation_instructions: str = Field(..., min_length=3)
    safety_warning: Optional[str] = None
    recyclable: bool = False
    compostable: bool = False


class WasteItemCreate(WasteItemBase):
    slug: Optional[str] = None


class WasteItemUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    disposal_instructions: Optional[str] = None
    recycling_information: Optional[str] = None
    preparation_instructions: Optional[str] = None
    safety_warning: Optional[str] = None
    recyclable: Optional[bool] = None
    compostable: Optional[bool] = None


class WasteItemOut(WasteItemBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    slug: str
    created_at: Optional[datetime.datetime] = None
    updated_at: Optional[datetime.datetime] = None


# Collection Requests
class CollectionRequestCreate(BaseModel):
    requester_name: str = Field(..., min_length=2, max_length=150)
    contact_email: Optional[str] = Field(None, max_length=150)
    contact_phone: Optional[str] = Field(None, max_length=50)
    waste_category: str = Field(..., min_length=2, max_length=100)
    description: str = Field(..., min_length=5, max_length=1000)
    quantity: float = Field(..., gt=0)
    quantity_unit: str = Field(default="kg", max_length=30)
    pickup_area: str = Field(..., min_length=3, max_length=250)
    preferred_pickup_date: datetime.date
    additional_notes: Optional[str] = None

    @field_validator("preferred_pickup_date")
    @classmethod
    def validate_future_date(cls, v: datetime.date) -> datetime.date:
        today = datetime.date.today()
        if v < today:
            raise ValueError("Preferred pickup date cannot be in the past.")
        return v

    @field_validator("quantity")
    @classmethod
    def validate_positive_quantity(cls, v: float) -> float:
        if v <= 0:
            raise ValueError("Quantity must be greater than zero.")
        if v > 10000:
            raise ValueError("Quantity exceeds reasonable single collection limit (10,000 max).")
        return v


# Public tracking view - NEVER expose private contact info (email/phone) to public
class CollectionRequestPublic(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    request_code: str
    waste_category: str
    description: str
    quantity: float
    quantity_unit: str
    pickup_area: str
    preferred_pickup_date: datetime.date
    status: str
    partner_note: Optional[str] = None
    created_at: datetime.datetime
    updated_at: Optional[datetime.datetime] = None


# Detailed view for authorized Admins and Collection Partners
class CollectionRequestAdmin(CollectionRequestPublic):
    model_config = ConfigDict(from_attributes=True)

    id: int
    requester_name: str
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    cancellation_reason: Optional[str] = None


class CollectionRequestStatusUpdate(BaseModel):
    status: str = Field(..., pattern="^(Pending|Accepted|Scheduled|Collected|Cancelled)$")
    partner_note: Optional[str] = None


class CollectionRequestCancel(BaseModel):
    cancellation_reason: Optional[str] = Field(None, max_length=500)


# Identification
class WasteIdentifyResponse(BaseModel):
    item_name: str
    category: str
    disposal_instructions: str
    recycling_information: str
    preparation_instructions: str
    safety_warning: Optional[str] = None
    recyclable: bool
    compostable: bool
    identification_mode: str  # "demo_manual" | "model_inference"
    confidence_score: Optional[float] = None
    notice: str


# Analytics & Dashboard
class DashboardStats(BaseModel):
    total_requests: int
    completed_requests: int
    pending_requests: int
    scheduled_requests: int
    accepted_requests: int
    completion_rate_percent: float


class CategoryDistributionItem(BaseModel):
    category: str
    count: int
    percentage: float
