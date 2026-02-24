from fastapi import APIRouter, HTTPException, Depends, Header
from typing import List, Optional
from models import (
    MenuItem, MenuCategory, Order, OrderCreate, Booking, BookingCreate,
    Testimonial, TestimonialCreate, GalleryImage, SpecialOffer,
    User, UserLogin, UserCreate, PaymentOrder, PaymentVerification,
    RestaurantInfo
)
from auth import get_password_hash, verify_password, create_access_token, decode_access_token
from datetime import datetime
import uuid
import os

router = APIRouter()

# Dependency to get database
def get_db():
    from server import db
    return db

# Dependency to verify admin token
async def verify_admin(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid authorization header")
    
    token = authorization.replace("Bearer ", "")
    payload = decode_access_token(token)
    
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    db = get_db()
    user = await db.users.find_one({"username": payload.get("sub")})
    
    if not user or not user.get("is_admin"):
        raise HTTPException(status_code=403, detail="Not authorized")
    
    return user

# ============= AUTH ROUTES =============

@router.post("/auth/register")
async def register(user_data: UserCreate):
    db = get_db()
    
    # Check if user exists
    existing_user = await db.users.find_one({"$or": [{"username": user_data.username}, {"email": user_data.email}]})
    if existing_user:
        raise HTTPException(status_code=400, detail="Username or email already exists")
    
    # Create user
    user = User(
        username=user_data.username,
        email=user_data.email,
        hashed_password=get_password_hash(user_data.password),
        is_admin=False
    )
    
    result = await db.users.insert_one(user.dict(exclude={"id"}))
    
    return {"message": "User created successfully", "user_id": str(result.inserted_id)}

@router.post("/auth/login")
async def login(credentials: UserLogin):
    db = get_db()
    
    user = await db.users.find_one({"username": credentials.username})
    if not user or not verify_password(credentials.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = create_access_token(data={"sub": user["username"], "is_admin": user.get("is_admin", False)})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "is_admin": user.get("is_admin", False),
        "username": user["username"]
    }

# ============= RESTAURANT INFO ROUTES =============

@router.get("/restaurant/info")
async def get_restaurant_info():
    db = get_db()
    info = await db.restaurant_info.find_one()
    if info:
        info["_id"] = str(info["_id"])
    return info

@router.put("/restaurant/info", dependencies=[Depends(verify_admin)])
async def update_restaurant_info(info: RestaurantInfo):
    db = get_db()
    await db.restaurant_info.update_one(
        {},
        {"$set": info.dict()},
        upsert=True
    )
    return {"message": "Restaurant info updated"}

# ============= MENU ROUTES =============

@router.get("/menu/categories", response_model=List[MenuCategory])
async def get_menu_categories():
    db = get_db()
    categories = await db.menu_categories.find().to_list(100)
    for category in categories:
        category["id"] = str(category["_id"])
        category.pop("_id", None)
    return categories

@router.post("/menu/category", dependencies=[Depends(verify_admin)])
async def create_menu_category(category: MenuCategory):
    db = get_db()
    result = await db.menu_categories.insert_one(category.dict(exclude={"id"}))
    return {"message": "Category created", "id": str(result.inserted_id)}

@router.post("/menu/item", dependencies=[Depends(verify_admin)])
async def create_menu_item(item: MenuItem, category_id: str):
    db = get_db()
    from bson import ObjectId
    
    # 1. Convert the Pydantic model to a dictionary
    item_dict = item.dict(exclude={"id"})
    
    # 2. Generate a unique ID for the item
    item_dict["id"] = str(uuid.uuid4())
    
    # 3. Ensure the category_id is stored with the item if needed
    item_dict["category_id"] = category_id
    
    # 4. Update the category document by pushing the item into the 'items' list
    try:
        result = await db.menu_categories.update_one(
            {"_id": ObjectId(category_id)},
            {"$push": {"items": item_dict}}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Category not found")
            
        return {"message": "Item created successfully", "id": item_dict["id"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/menu/item/{item_id}", dependencies=[Depends(verify_admin)])
async def update_menu_item(item_id: str, item: MenuItem):
    db = get_db()
    
    item_dict = item.dict(exclude={"id"})
    item_dict["updated_at"] = datetime.utcnow()
    
    # Use the $ positional operator to update the specific item in the array
    result = await db.menu_categories.update_one(
        {"items.id": item_id},
        {"$set": {"items.$": {**item_dict, "id": item_id}}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Item not found")
    
    return {"message": "Item updated successfully"}

@router.delete("/menu/item/{item_id}", dependencies=[Depends(verify_admin)])
async def delete_menu_item(item_id: str):
    db = get_db()
    
    result = await db.menu_categories.update_one(
        {"items.id": item_id},
        {"$pull": {"items": {"id": item_id}}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Item not found")
    
    return {"message": "Item deleted"}

# ============= ORDER ROUTES =============

@router.post("/orders", response_model=dict)
async def create_order(order_data: OrderCreate):
    db = get_db()
    
    order = Order(
        order_number=f"ORD{datetime.utcnow().strftime('%Y%m%d%H%M%S')}",
        **order_data.dict()
    )
    
    result = await db.orders.insert_one(order.dict(exclude={"id"}))
    order_id = str(result.inserted_id)
    
    return {
        "message": "Order created successfully",
        "order_id": order_id,
        "order_number": order.order_number
    }

@router.get("/orders", dependencies=[Depends(verify_admin)])
async def get_all_orders():
    db = get_db()
    orders = await db.orders.find().sort("created_at", -1).to_list(1000)
    for order in orders:
        order["id"] = str(order["_id"])
        order.pop("_id", None)
    return orders

@router.get("/orders/{order_id}")
async def get_order(order_id: str):
    db = get_db()
    from bson import ObjectId
    
    order = await db.orders.find_one({"_id": ObjectId(order_id)})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    order["id"] = str(order["_id"])
    order.pop("_id", None)
    return order

@router.put("/orders/{order_id}/status", dependencies=[Depends(verify_admin)])
async def update_order_status(order_id: str, status: str):
    db = get_db()
    from bson import ObjectId
    
    result = await db.orders.update_one(
        {"_id": ObjectId(order_id)},
        {"$set": {"order_status": status, "updated_at": datetime.utcnow()}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Order not found")
    
    return {"message": "Order status updated"}

# ============= BOOKING ROUTES =============

@router.post("/bookings")
async def create_booking(booking_data: BookingCreate):
    db = get_db()
    
    booking = Booking(**booking_data.dict())
    result = await db.bookings.insert_one(booking.dict(exclude={"id"}))
    
    return {
        "message": "Booking created successfully",
        "booking_id": str(result.inserted_id)
    }

@router.get("/bookings", dependencies=[Depends(verify_admin)])
async def get_all_bookings():
    db = get_db()
    bookings = await db.bookings.find().sort("date", -1).to_list(1000)
    for booking in bookings:
        booking["id"] = str(booking["_id"])
        booking.pop("_id", None)
    return bookings

@router.put("/bookings/{booking_id}/status", dependencies=[Depends(verify_admin)])
async def update_booking_status(booking_id: str, status: str):
    db = get_db()
    from bson import ObjectId
    
    result = await db.bookings.update_one(
        {"_id": ObjectId(booking_id)},
        {"$set": {"status": status, "updated_at": datetime.utcnow()}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    return {"message": "Booking status updated"}

# ============= TESTIMONIAL ROUTES =============

@router.get("/testimonials")
async def get_testimonials():
    db = get_db()
    testimonials = await db.testimonials.find({"approved": True}).to_list(100)
    for testimonial in testimonials:
        testimonial["id"] = str(testimonial["_id"])
        testimonial.pop("_id", None)
    return testimonials

@router.post("/testimonials")
async def create_testimonial(testimonial_data: TestimonialCreate):
    db = get_db()
    
    testimonial = Testimonial(**testimonial_data.dict(), approved=False)
    result = await db.testimonials.insert_one(testimonial.dict(exclude={"id"}))
    
    return {
        "message": "Testimonial submitted for approval",
        "testimonial_id": str(result.inserted_id)
    }

@router.get("/testimonials/pending", dependencies=[Depends(verify_admin)])
async def get_pending_testimonials():
    db = get_db()
    testimonials = await db.testimonials.find({"approved": False}).to_list(100)
    for testimonial in testimonials:
        testimonial["id"] = str(testimonial["_id"])
        testimonial.pop("_id", None)
    return testimonials

@router.put("/testimonials/{testimonial_id}/approve", dependencies=[Depends(verify_admin)])
async def approve_testimonial(testimonial_id: str):
    db = get_db()
    from bson import ObjectId
    
    result = await db.testimonials.update_one(
        {"_id": ObjectId(testimonial_id)},
        {"$set": {"approved": True}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    
    return {"message": "Testimonial approved"}

# ============= GALLERY ROUTES =============

@router.get("/gallery")
async def get_gallery():
    db = get_db()
    images = await db.gallery.find().to_list(100)
    for image in images:
        image["id"] = str(image["_id"])
        image.pop("_id", None)
    return images

@router.post("/gallery", dependencies=[Depends(verify_admin)])
async def add_gallery_image(image: GalleryImage):
    db = get_db()
    result = await db.gallery.insert_one(image.dict(exclude={"id"}))
    return {"message": "Image added", "id": str(result.inserted_id)}

@router.delete("/gallery/{image_id}", dependencies=[Depends(verify_admin)])
async def delete_gallery_image(image_id: str):
    db = get_db()
    from bson import ObjectId
    
    result = await db.gallery.delete_one({"_id": ObjectId(image_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Image not found")
    
    return {"message": "Image deleted"}

# ============= SPECIAL OFFERS ROUTES =============

@router.get("/offers")
async def get_special_offers():
    db = get_db()
    offers = await db.special_offers.find({"active": True}).to_list(100)
    for offer in offers:
        offer["id"] = str(offer["_id"])
        offer.pop("_id", None)
    return offers

@router.post("/offers", dependencies=[Depends(verify_admin)])
async def create_special_offer(offer: SpecialOffer):
    db = get_db()
    result = await db.special_offers.insert_one(offer.dict(exclude={"id"}))
    return {"message": "Offer created", "id": str(result.inserted_id)}

@router.put("/offers/{offer_id}", dependencies=[Depends(verify_admin)])
async def update_special_offer(offer_id: str, offer: SpecialOffer):
    db = get_db()
    from bson import ObjectId
    
    result = await db.special_offers.update_one(
        {"_id": ObjectId(offer_id)},
        {"$set": offer.dict(exclude={"id"})}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Offer not found")
    
    return {"message": "Offer updated"}
