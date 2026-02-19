# API Reference - Indian Spices Restaurant

## Base URL

```
Production: https://indian-spices-patna.preview.emergentagent.com/api
Local: http://localhost:8001/api
```

---

## Authentication

### Login

**Endpoint:** `POST /auth/login`

**Request:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "is_admin": true,
  "username": "admin"
}
```

**Usage:**
```bash
curl -X POST https://your-domain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

---

### Register User

**Endpoint:** `POST /auth/register`

**Request:**
```json
{
  "username": "newuser",
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "user_id": "507f1f77bcf86cd799439011"
}
```

---

## Restaurant Info

### Get Restaurant Information

**Endpoint:** `GET /restaurant/info`

**Authentication:** Not required

**Response:**
```json
{
  "name": "Indian Spices",
  "tagline": "Authentic Flavors, Heart of Chiraura",
  "description": "Located conveniently near AIIMS Patna...",
  "address": "Chiraura, near AIIMS Hospital, Patna, Bihar",
  "phone": "+91 9876543210",
  "whatsapp": "+919876543210",
  "email": "contact@indianspices.com",
  "hours": "11:00 AM – 11:00 PM",
  "coordinates": {
    "lat": 25.6093,
    "lng": 85.1376
  }
}
```

---

### Update Restaurant Information

**Endpoint:** `PUT /restaurant/info`

**Authentication:** Required (Admin only)

**Headers:**
```
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json
```

**Request:**
```json
{
  "name": "Indian Spices",
  "tagline": "Updated tagline",
  "address": "New address",
  "phone": "+91 9876543210",
  "email": "new@email.com",
  "hours": "10:00 AM – 11:00 PM"
}
```

---

## Menu Management

### Get All Menu Categories

**Endpoint:** `GET /menu/categories`

**Authentication:** Not required

**Response:**
```json
[
  {
    "id": "1",
    "name": "Starters & Tandoori Specialties",
    "description": "Begin your culinary journey",
    "items": [
      {
        "id": "101",
        "name": "Paneer Tikka",
        "description": "Cottage cheese marinated in spices...",
        "price": 220,
        "image": "https://images.unsplash.com/...",
        "category": "Vegetarian",
        "spicy": "Medium",
        "available": true,
        "created_at": "2024-12-20T10:00:00",
        "updated_at": "2024-12-20T10:00:00"
      }
    ]
  }
]
```

---

### Create Menu Category

**Endpoint:** `POST /menu/category`

**Authentication:** Required (Admin only)

**Request:**
```json
{
  "name": "Desserts",
  "description": "Sweet endings",
  "items": []
}
```

**Response:**
```json
{
  "message": "Category created",
  "id": "5"
}
```

---

### Add Menu Item

**Endpoint:** `POST /menu/item?category_id={categoryId}`

**Authentication:** Required (Admin only)

**Request:**
```json
{
  "name": "Butter Chicken",
  "description": "Creamy tomato-based curry with tender chicken",
  "price": 340,
  "image": "https://images.unsplash.com/photo-xyz",
  "category": "Non-Vegetarian",
  "spicy": "Medium",
  "available": true
}
```

**Response:**
```json
{
  "message": "Item created",
  "id": "206"
}
```

**Example:**
```bash
curl -X POST "https://your-domain.com/api/menu/item?category_id=2" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Butter Chicken",
    "description": "Creamy curry",
    "price": 340,
    "category": "Non-Vegetarian",
    "spicy": "Medium",
    "available": true
  }'
```

---

### Update Menu Item

**Endpoint:** `PUT /menu/item/{itemId}`

**Authentication:** Required (Admin only)

**Request:**
```json
{
  "name": "Paneer Tikka",
  "description": "Updated description",
  "price": 250,
  "image": "https://new-image-url.com",
  "category": "Vegetarian",
  "spicy": "High",
  "available": false
}
```

**Response:**
```json
{
  "message": "Item updated"
}
```

---

### Delete Menu Item

**Endpoint:** `DELETE /menu/item/{itemId}`

**Authentication:** Required (Admin only)

**Response:**
```json
{
  "message": "Item deleted"
}
```

---

## Order Management

### Create Order

**Endpoint:** `POST /orders`

**Authentication:** Not required

**Request:**
```json
{
  "customer_name": "John Doe",
  "customer_email": "john@example.com",
  "customer_phone": "+91 9876543210",
  "items": [
    {
      "item_id": "101",
      "name": "Paneer Tikka",
      "price": 220,
      "quantity": 2,
      "subtotal": 440
    },
    {
      "item_id": "202",
      "name": "Chicken Biryani",
      "price": 320,
      "quantity": 1,
      "subtotal": 320
    }
  ],
  "total_amount": 760,
  "delivery_type": "delivery",
  "delivery_address": "123 Main Street, Patna",
  "special_instructions": "Extra spicy please"
}
```

**Response:**
```json
{
  "message": "Order created successfully",
  "order_id": "507f1f77bcf86cd799439011",
  "order_number": "ORD20241220153045"
}
```

---

### Get All Orders

**Endpoint:** `GET /orders`

**Authentication:** Required (Admin only)

**Response:**
```json
[
  {
    "id": "507f1f77bcf86cd799439011",
    "order_number": "ORD20241220153045",
    "customer_name": "John Doe",
    "customer_email": "john@example.com",
    "customer_phone": "+91 9876543210",
    "items": [...],
    "total_amount": 760,
    "payment_status": "completed",
    "payment_id": "pay_XYZ123",
    "order_status": "preparing",
    "delivery_type": "delivery",
    "delivery_address": "123 Main Street, Patna",
    "special_instructions": "Extra spicy please",
    "created_at": "2024-12-20T15:30:45",
    "updated_at": "2024-12-20T15:45:00"
  }
]
```

---

### Get Order by ID

**Endpoint:** `GET /orders/{orderId}`

**Authentication:** Not required

**Response:**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "order_number": "ORD20241220153045",
  "customer_name": "John Doe",
  "items": [...],
  "total_amount": 760,
  "payment_status": "completed",
  "order_status": "preparing"
}
```

---

### Update Order Status

**Endpoint:** `PUT /orders/{orderId}/status?status={newStatus}`

**Authentication:** Required (Admin only)

**Valid Status Values:**
- `received`
- `preparing`
- `ready`
- `delivered`
- `cancelled`

**Example:**
```bash
curl -X PUT "https://your-domain.com/api/orders/507f1f77bcf86cd799439011/status?status=preparing" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
  "message": "Order status updated"
}
```

---

## Booking Management

### Create Booking

**Endpoint:** `POST /bookings`

**Authentication:** Not required

**Request:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "+91 9876543210",
  "date": "2024-12-25",
  "time": "19:00",
  "guests": 4,
  "special_request": "Window seat please, celebrating birthday"
}
```

**Response:**
```json
{
  "message": "Booking created successfully",
  "booking_id": "507f1f77bcf86cd799439012"
}
```

---

### Get All Bookings

**Endpoint:** `GET /bookings`

**Authentication:** Required (Admin only)

**Response:**
```json
[
  {
    "id": "507f1f77bcf86cd799439012",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "phone": "+91 9876543210",
    "date": "2024-12-25",
    "time": "19:00",
    "guests": 4,
    "special_request": "Window seat please",
    "status": "pending",
    "created_at": "2024-12-20T14:00:00",
    "updated_at": "2024-12-20T14:00:00"
  }
]
```

---

### Update Booking Status

**Endpoint:** `PUT /bookings/{bookingId}/status?status={newStatus}`

**Authentication:** Required (Admin only)

**Valid Status Values:**
- `pending`
- `confirmed`
- `cancelled`

**Example:**
```bash
curl -X PUT "https://your-domain.com/api/bookings/507f1f77bcf86cd799439012/status?status=confirmed" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
  "message": "Booking status updated"
}
```

---

## Testimonial Management

### Get All Approved Testimonials

**Endpoint:** `GET /testimonials`

**Authentication:** Not required

**Response:**
```json
[
  {
    "id": "507f1f77bcf86cd799439013",
    "name": "Dr. Rajesh Kumar",
    "role": "AIIMS Doctor",
    "rating": 5,
    "comment": "Best Indian food near AIIMS!",
    "approved": true,
    "date": "2024-12-10",
    "created_at": "2024-12-10T10:00:00"
  }
]
```

---

### Submit Testimonial

**Endpoint:** `POST /testimonials`

**Authentication:** Not required

**Request:**
```json
{
  "name": "Customer Name",
  "role": "Food Lover",
  "rating": 5,
  "comment": "Amazing food and service!"
}
```

**Response:**
```json
{
  "message": "Testimonial submitted for approval",
  "testimonial_id": "507f1f77bcf86cd799439014"
}
```

---

### Get Pending Testimonials

**Endpoint:** `GET /testimonials/pending`

**Authentication:** Required (Admin only)

**Response:**
```json
[
  {
    "id": "507f1f77bcf86cd799439014",
    "name": "Customer Name",
    "role": "Food Lover",
    "rating": 5,
    "comment": "Amazing food and service!",
    "approved": false,
    "date": "2024-12-20"
  }
]
```

---

### Approve Testimonial

**Endpoint:** `PUT /testimonials/{testimonialId}/approve`

**Authentication:** Required (Admin only)

**Response:**
```json
{
  "message": "Testimonial approved"
}
```

---

## Payment Integration

### Create Payment Order

**Endpoint:** `POST /payment/create-order`

**Authentication:** Not required

**Request:**
```json
{
  "amount": 76000,
  "currency": "INR",
  "order_id": "507f1f77bcf86cd799439011"
}
```

**Note:** Amount must be in paise (₹760 = 76000 paise)

**Response:**
```json
{
  "order_id": "order_KJHGfds78fgGF",
  "amount": 76000,
  "currency": "INR",
  "key_id": "rzp_test_1234567890"
}
```

---

### Verify Payment

**Endpoint:** `POST /payment/verify`

**Authentication:** Not required

**Request:**
```json
{
  "razorpay_order_id": "order_KJHGfds78fgGF",
  "razorpay_payment_id": "pay_KJHGfds78fgGF",
  "razorpay_signature": "9a8b7c6d5e4f3g2h1i0j..."
}
```

**Response:**
```json
{
  "message": "Payment verified successfully",
  "payment_id": "pay_KJHGfds78fgGF"
}
```

---

## Gallery Management

### Get All Gallery Images

**Endpoint:** `GET /gallery`

**Authentication:** Not required

**Response:**
```json
[
  {
    "id": "507f1f77bcf86cd799439015",
    "image": "https://images.unsplash.com/photo-xyz",
    "title": "Signature Biryani",
    "category": "Food",
    "created_at": "2024-12-20T10:00:00"
  }
]
```

---

### Add Gallery Image

**Endpoint:** `POST /gallery`

**Authentication:** Required (Admin only)

**Request:**
```json
{
  "image": "https://images.unsplash.com/photo-new",
  "title": "New Dish",
  "category": "Food"
}
```

**Response:**
```json
{
  "message": "Image added",
  "id": "507f1f77bcf86cd799439016"
}
```

---

### Delete Gallery Image

**Endpoint:** `DELETE /gallery/{imageId}`

**Authentication:** Required (Admin only)

**Response:**
```json
{
  "message": "Image deleted"
}
```

---

## Special Offers

### Get Active Offers

**Endpoint:** `GET /offers`

**Authentication:** Not required

**Response:**
```json
[
  {
    "id": "507f1f77bcf86cd799439017",
    "title": "Lunch Special",
    "description": "Get 20% off on all orders between 12 PM - 3 PM",
    "valid_until": "2025-01-31",
    "active": true,
    "created_at": "2024-12-20T10:00:00"
  }
]
```

---

### Create Offer

**Endpoint:** `POST /offers`

**Authentication:** Required (Admin only)

**Request:**
```json
{
  "title": "Weekend Special",
  "description": "Buy 1 Get 1 Free on selected items",
  "valid_until": "2024-12-31",
  "active": true
}
```

**Response:**
```json
{
  "message": "Offer created",
  "id": "507f1f77bcf86cd799439018"
}
```

---

### Update Offer

**Endpoint:** `PUT /offers/{offerId}`

**Authentication:** Required (Admin only)

**Request:**
```json
{
  "title": "Updated Weekend Special",
  "description": "New description",
  "valid_until": "2025-01-15",
  "active": false
}
```

**Response:**
```json
{
  "message": "Offer updated"
}
```

---

## Error Responses

### Authentication Error (401)
```json
{
  "detail": "Invalid credentials"
}
```

### Authorization Error (403)
```json
{
  "detail": "Not authorized"
}
```

### Not Found Error (404)
```json
{
  "detail": "Item not found"
}
```

### Validation Error (422)
```json
{
  "detail": [
    {
      "loc": ["body", "email"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```

### Server Error (500)
```json
{
  "detail": "Internal server error"
}
```

---

## Rate Limiting

Currently no rate limiting is implemented.

**Recommended for Production:**
- 100 requests per minute per IP for public endpoints
- 1000 requests per minute for authenticated endpoints

---

## Webhooks

### Razorpay Webhook

**Endpoint:** `POST /payment/webhook`

**Authentication:** Razorpay signature verification

**Purpose:** Receive payment status updates from Razorpay

**Events Handled:**
- `payment.captured`
- `payment.failed`
- `payment.authorized`

---

## Testing

### Test Credentials

**Admin Login:**
- Username: `admin`
- Password: `admin123`

**Razorpay Test Card:**
- Card Number: `4111 1111 1111 1111`
- CVV: Any 3 digits
- Expiry: Any future date
- OTP: `123456`

---

## Best Practices

1. **Always use HTTPS** in production
2. **Store JWT token** securely (httpOnly cookies or secure storage)
3. **Validate input** on both client and server
4. **Handle errors gracefully** with user-friendly messages
5. **Log all transactions** for audit trail
6. **Test payment flow** thoroughly before going live
7. **Keep API keys secure** - never commit to version control

---

**API Version:** 1.0.0  
**Last Updated:** December 20, 2024
