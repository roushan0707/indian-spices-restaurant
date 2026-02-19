from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from bson import ObjectId

# Custom ObjectId type for Pydantic
class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")

# Restaurant Info Models
class RestaurantInfo(BaseModel):
    name: str
    tagline: str
    description: str
    address: str
    phone: str
    whatsapp: str
    email: EmailStr
    hours: str
    coordinates: dict

# Menu Models
class MenuItem(BaseModel):
    id: Optional[str] = None
    name: str
    description: str
    price: float
    image: Optional[str] = None
    category: str
    spicy: str = "None"
    available: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class MenuCategory(BaseModel):
    id: Optional[str] = None
    name: str
    description: str
    items: List[MenuItem] = []

# Order Models
class OrderItem(BaseModel):
    item_id: str
    name: str
    price: float
    quantity: int
    subtotal: float

class Order(BaseModel):
    id: Optional[str] = None
    order_number: str
    customer_name: str
    customer_email: EmailStr
    customer_phone: str
    items: List[OrderItem]
    total_amount: float
    payment_status: str = "pending"  # pending, completed, failed
    payment_id: Optional[str] = None
    order_status: str = "received"  # received, preparing, ready, delivered, cancelled
    delivery_type: str = "pickup"  # pickup, delivery
    delivery_address: Optional[str] = None
    special_instructions: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class OrderCreate(BaseModel):
    customer_name: str
    customer_email: EmailStr
    customer_phone: str
    items: List[OrderItem]
    total_amount: float
    delivery_type: str = "pickup"
    delivery_address: Optional[str] = None
    special_instructions: Optional[str] = None

# Booking Models
class Booking(BaseModel):
    id: Optional[str] = None
    name: str
    email: EmailStr
    phone: str
    date: str
    time: str
    guests: int
    special_request: Optional[str] = None
    status: str = "pending"  # pending, confirmed, cancelled
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class BookingCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str
    date: str
    time: str
    guests: int
    special_request: Optional[str] = None

# Testimonial Models
class Testimonial(BaseModel):
    id: Optional[str] = None
    name: str
    role: str
    rating: int
    comment: str
    approved: bool = False
    date: str = Field(default_factory=lambda: datetime.utcnow().strftime("%Y-%m-%d"))
    created_at: datetime = Field(default_factory=datetime.utcnow)

class TestimonialCreate(BaseModel):
    name: str
    role: str
    rating: int
    comment: str

# Gallery Models
class GalleryImage(BaseModel):
    id: Optional[str] = None
    image: str
    title: str
    category: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Special Offers Models
class SpecialOffer(BaseModel):
    id: Optional[str] = None
    title: str
    description: str
    valid_until: str
    active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)

# User Models (for admin)
class User(BaseModel):
    id: Optional[str] = None
    email: EmailStr
    username: str
    hashed_password: str
    is_admin: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)

class UserLogin(BaseModel):
    username: str
    password: str

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

# Payment Models
class PaymentOrder(BaseModel):
    amount: int  # Amount in paise
    currency: str = "INR"
    order_id: str

class PaymentVerification(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str
