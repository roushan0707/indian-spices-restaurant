# Indian Spices Restaurant - Complete System Documentation

**Version:** 1.0.0  
**Last Updated:** December 20, 2024  
**Restaurant:** Indian Spices, Chiraura, Patna (Near AIIMS Hospital)

---

## 📋 Table of Contents

1. [System Overview](#system-overview)
2. [Quick Start Guide](#quick-start-guide)
3. [Admin Dashboard Guide](#admin-dashboard-guide)
4. [Menu Management](#menu-management)
5. [Order Management](#order-management)
6. [Booking Management](#booking-management)
7. [Payment System](#payment-system)
8. [API Documentation](#api-documentation)
9. [Customer Journey](#customer-journey)
10. [Troubleshooting](#troubleshooting)

---

## 🎯 System Overview

### What You Have Built

A complete restaurant management system with:

**Frontend Features:**
- Beautiful landing page with hero section
- Dynamic menu display with cart functionality
- Online ordering with Razorpay payment integration
- Table booking system
- Contact form with Google Maps
- Customer testimonials and gallery
- Mobile-responsive design

**Backend Features:**
- RESTful API built with FastAPI
- MongoDB database for data storage
- User authentication with JWT
- Admin dashboard for management
- Order processing and tracking
- Booking management
- Payment integration with Razorpay

**Admin Panel:**
- Real-time order management
- Booking confirmations
- Menu item management
- Revenue tracking
- Customer data management

---

## 🚀 Quick Start Guide

### Default Admin Credentials

**Login URL:** `https://your-domain.com/admin/login`

```
Username: admin
Password: admin123
```

⚠️ **IMPORTANT:** Change these credentials after first login!

### First Time Setup Checklist

1. ✅ Login to admin dashboard
2. ✅ Update restaurant information
3. ✅ Add/update menu items with real images
4. ✅ Configure Razorpay API keys (in backend .env)
5. ✅ Test order flow
6. ✅ Update contact information
7. ✅ Add real testimonials

---

## 👨‍💼 Admin Dashboard Guide

### Accessing the Dashboard

1. Navigate to `/admin/login`
2. Enter credentials
3. Click "Login"
4. You'll be redirected to dashboard

### Dashboard Overview

The dashboard has 4 main sections accessible via tabs:

#### 1. **Statistics Cards** (Top Section)

- **Total Orders:** Total number of orders placed
- **Total Revenue:** Sum of all completed payments
- **Pending Bookings:** Bookings awaiting confirmation
- **Menu Items:** Total dishes available

#### 2. **Orders Tab**

**What You See:**
- Order number (e.g., ORD20241220153045)
- Customer name, phone, email
- Order total amount
- Number of items
- Order status badges
- Payment status badges

**Order Status Flow:**
```
received → preparing → ready → delivered
```

**Actions Available:**
- **Start Preparing:** Moves order from "received" to "preparing"
- **Mark Ready:** Moves from "preparing" to "ready"
- **Delivered:** Marks order as completed

**How to Process an Order:**

1. New order arrives with status "received"
2. Click "Start Preparing" when kitchen begins work
3. Click "Mark Ready" when food is ready for pickup/delivery
4. Click "Delivered" once customer receives order

#### 3. **Bookings Tab**

**What You See:**
- Customer name and contact details
- Booking date and time
- Number of guests
- Special requests (if any)
- Status badge

**Actions Available:**
- **Confirm:** Accept the table booking
- **Cancel:** Reject or cancel the booking

**How to Manage Bookings:**

1. Review new booking details
2. Check table availability for that date/time
3. Click "Confirm" to accept
4. Customer will be notified (manual notification for now)

#### 4. **Menu Tab**

**What You See:**
- All menu categories (Starters, Main Course, Breads, Beverages)
- Items under each category
- Item name and price
- Availability status

**Current Functionality:**
- View all menu items
- Check availability status

**To Add/Edit Items:** (Via API - see API Documentation)

---

## 🍽️ Menu Management

### Current Menu Structure

Your menu has 4 categories:

1. **Starters & Tandoori Specialties**
   - Paneer Tikka (₹220)
   - Tandoori Chicken (₹280)
   - Samosa Platter (₹120)

2. **Main Course**
   - Paneer Butter Masala (₹260)
   - Chicken Biryani (₹320)
   - Mutton Handi (₹380)
   - Dal Tadka (₹180)
   - Mix Veg Curry (₹220)

3. **Breads**
   - Butter Naan (₹50)
   - Garlic Naan (₹60)
   - Tandoori Roti (₹30)

4. **Beverages**
   - Lassi (₹70)
   - Masala Chai (₹40)

### How to Add a New Menu Item

**Method 1: Using API (Recommended)**

```bash
curl -X POST "https://your-domain.com/api/menu/item?category_id=CATEGORY_ID" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Butter Chicken",
    "description": "Creamy tomato-based curry with tender chicken",
    "price": 340,
    "image": "https://example.com/image.jpg",
    "category": "Non-Vegetarian",
    "spicy": "Medium",
    "available": true
  }'
```

**Method 2: Directly in MongoDB**

Connect to MongoDB and insert into `menu_categories` collection.

### How to Update Menu Item Price

```bash
curl -X PUT "https://your-domain.com/api/menu/item/ITEM_ID" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Paneer Tikka",
    "description": "Cottage cheese marinated in spices",
    "price": 250,
    "category": "Vegetarian",
    "spicy": "Medium",
    "available": true
  }'
```

### How to Mark Item as Unavailable

When an item is out of stock:

```bash
curl -X PUT "https://your-domain.com/api/menu/item/ITEM_ID" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "available": false
  }'
```

Customers will see "Unavailable" badge and cannot add to cart.

---

## 📦 Order Management

### Order Lifecycle

```
1. Customer adds items to cart
2. Customer proceeds to checkout
3. Customer fills delivery details
4. Customer pays via Razorpay
5. Order created with status "received"
6. You see order in admin dashboard
7. You process: received → preparing → ready → delivered
```

### Order Details You Receive

- **Order Number:** Unique identifier (e.g., ORD20241220153045)
- **Customer Info:** Name, phone, email
- **Items Ordered:** List with quantities
- **Total Amount:** Final payment amount
- **Delivery Type:** Pickup or Delivery
- **Delivery Address:** (if delivery type)
- **Special Instructions:** Customer notes
- **Payment Status:** pending/completed/failed
- **Payment ID:** Razorpay payment ID

### How to Handle Orders

#### New Order Arrives

1. Check payment status = "completed"
2. Review items and special instructions
3. Note delivery type and address
4. Click "Start Preparing"

#### While Preparing

1. Ensure all items are available
2. Follow special instructions
3. Prepare food with care
4. Click "Mark Ready" when done

#### For Delivery Orders

1. Arrange delivery person
2. Pack order carefully
3. Provide delivery address to driver
4. Mark as "Delivered" after confirmation

#### For Pickup Orders

1. Keep ready at pickup counter
2. Call customer when ready (use phone number)
3. Verify order number with customer
4. Mark as "Delivered" after handover

---

## 📅 Booking Management

### Booking Information You Receive

- Customer name and contact
- Requested date and time
- Number of guests
- Special requests (birthday, anniversary, dietary needs)

### How to Confirm Bookings

1. **Check Availability**
   - Verify you have tables available
   - Check if date/time works for your schedule

2. **Confirm Booking**
   - Click "Confirm" button
   - Note down in your register
   - Call customer to confirm (use phone number)

3. **Prepare for Guest**
   - Arrange table for specified number of guests
   - Note any special requests
   - Have table ready 15 minutes before time

### How to Cancel Bookings

1. Click "Cancel" button
2. Call customer to inform and apologize
3. Offer alternative dates if possible

---

## 💳 Payment System

### Razorpay Integration

Your system uses Razorpay for secure payments.

### Payment Flow

1. Customer clicks "Proceed to Payment"
2. Razorpay checkout opens
3. Customer enters card/UPI details
4. Payment processed securely
5. Success → Order created
6. Failure → Customer notified

### Razorpay Configuration

**Location:** `/app/backend/.env`

```env
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
```

### Getting Razorpay Keys

1. Sign up at https://razorpay.com
2. Complete KYC verification
3. Go to Settings → API Keys
4. Generate Live Keys (for production)
5. Add keys to `.env` file
6. Restart backend server

### Test Payments

**Test Card:** 4111 1111 1111 1111  
**CVV:** Any 3 digits  
**Expiry:** Any future date  
**OTP:** 123456

⚠️ **Note:** Test mode doesn't charge real money!

### Payment Status

- **pending:** Payment initiated but not completed
- **completed:** Payment successful
- **failed:** Payment declined/failed

---

## 📡 API Documentation

### Base URL

```
https://your-domain.com/api
```

### Authentication

Most admin endpoints require authentication token.

**Get Token:**
```bash
POST /api/auth/login
{
  "username": "admin",
  "password": "admin123"
}

Response:
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer",
  "is_admin": true,
  "username": "admin"
}
```

**Use Token:**
```bash
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

### Key API Endpoints

#### Restaurant Info

```bash
# Get restaurant info
GET /api/restaurant/info

# Update restaurant info (Admin only)
PUT /api/restaurant/info
Authorization: Bearer TOKEN
{
  "name": "Indian Spices",
  "tagline": "Authentic Flavors, Heart of Chiraura",
  "address": "Chiraura, near AIIMS Hospital, Patna, Bihar",
  "phone": "+91 9876543210",
  "email": "contact@indianspices.com"
}
```

#### Menu

```bash
# Get all menu categories
GET /api/menu/categories

# Add menu item (Admin only)
POST /api/menu/item?category_id={categoryId}
Authorization: Bearer TOKEN
{
  "name": "Dish Name",
  "description": "Description",
  "price": 250,
  "image": "https://...",
  "category": "Vegetarian",
  "spicy": "Medium",
  "available": true
}

# Update menu item (Admin only)
PUT /api/menu/item/{itemId}
Authorization: Bearer TOKEN

# Delete menu item (Admin only)
DELETE /api/menu/item/{itemId}
Authorization: Bearer TOKEN
```

#### Orders

```bash
# Create order (Customer)
POST /api/orders
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
    }
  ],
  "total_amount": 440,
  "delivery_type": "pickup"
}

# Get all orders (Admin only)
GET /api/orders
Authorization: Bearer TOKEN

# Update order status (Admin only)
PUT /api/orders/{orderId}/status?status=preparing
Authorization: Bearer TOKEN
```

#### Bookings

```bash
# Create booking (Customer)
POST /api/bookings
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "+91 9876543210",
  "date": "2024-12-25",
  "time": "19:00",
  "guests": 4,
  "special_request": "Window seat please"
}

# Get all bookings (Admin only)
GET /api/bookings
Authorization: Bearer TOKEN

# Update booking status (Admin only)
PUT /api/bookings/{bookingId}/status?status=confirmed
Authorization: Bearer TOKEN
```

---

## 👥 Customer Journey

### Step-by-Step Customer Experience

#### 1. Landing on Website

Customer sees:
- Beautiful hero section with restaurant image
- "Order via WhatsApp" and "View Menu" buttons
- Location badge: "Near AIIMS Hospital, Patna"
- Opening hours

#### 2. Browsing Menu

- Clicks "View Menu" or scrolls down
- Sees categorized menu with food images
- Filters by category (Starters, Main, Breads, etc.)
- Views prices and spice levels
- Sees vegetarian/non-veg indicators

#### 3. Adding to Cart

- Clicks "Add to Cart" on desired items
- Sees toast notification: "Item added to cart"
- Floating cart icon shows item count
- Can continue shopping or checkout

#### 4. Viewing Cart

- Clicks floating cart button
- Drawer opens from right side
- Reviews items, quantities, prices
- Can adjust quantities (+/-)
- Can remove items
- Sees total amount
- Clicks "Proceed to Checkout"

#### 5. Checkout

- Fills delivery details:
  - Name, email, phone
  - Delivery type (Pickup/Delivery)
  - Address (if delivery)
  - Special instructions
- Reviews order summary
- Clicks "Proceed to Payment"

#### 6. Payment

- Razorpay checkout opens
- Enters payment details
- Completes payment
- Redirected to success page

#### 7. Order Confirmation

- Sees order number
- Gets confirmation message
- Can return to home or view order

---

## 🔧 Troubleshooting

### Common Issues & Solutions

#### Backend Not Starting

**Error:** "Module not found" or import errors

**Solution:**
```bash
cd /app/backend
pip install -r requirements.txt
sudo supervisorctl restart backend
```

#### Frontend Not Loading

**Check logs:**
```bash
tail -f /var/log/supervisor/frontend.*.log
```

**Restart:**
```bash
sudo supervisorctl restart frontend
```

#### Orders Not Creating

**Check:**
1. Backend is running
2. MongoDB is connected
3. API endpoint is accessible

**Test:**
```bash
curl https://your-domain.com/api/
```

Should return: `{"message": "Indian Spices Restaurant API", "version": "1.0.0"}`

#### Payment Not Working

**Check:**
1. Razorpay keys in `/app/backend/.env`
2. Keys are correct (ID and SECRET)
3. Using test keys for testing, live keys for production

**Test Payment:**
Use test card: 4111 1111 1111 1111

#### Admin Login Failing

**Check:**
1. Using correct credentials
2. Backend API is accessible
3. Check browser console for errors

**Reset Admin Password:**
```bash
# Connect to MongoDB
mongosh
use test_database
db.users.updateOne(
  {username: "admin"},
  {$set: {hashed_password: "NEW_HASHED_PASSWORD"}}
)
```

#### Cart Not Saving

Cart uses browser localStorage.

**Clear and Reset:**
```javascript
localStorage.removeItem('cart')
```

Then refresh page.

---

## 📊 Database Structure

### Collections in MongoDB

#### users
```javascript
{
  username: "admin",
  email: "admin@indianspices.com",
  hashed_password: "...",
  is_admin: true
}
```

#### menu_categories
```javascript
{
  id: "1",
  name: "Starters & Tandoori Specialties",
  description: "Begin your culinary journey",
  items: [
    {
      id: "101",
      name: "Paneer Tikka",
      description: "...",
      price: 220,
      image: "...",
      category: "Vegetarian",
      spicy: "Medium",
      available: true
    }
  ]
}
```

#### orders
```javascript
{
  order_number: "ORD20241220153045",
  customer_name: "John Doe",
  customer_email: "john@example.com",
  customer_phone: "+91 9876543210",
  items: [...],
  total_amount: 440,
  payment_status: "completed",
  order_status: "received",
  delivery_type: "pickup",
  created_at: ISODate("...")
}
```

#### bookings
```javascript
{
  name: "Jane Smith",
  email: "jane@example.com",
  phone: "+91 9876543210",
  date: "2024-12-25",
  time: "19:00",
  guests: 4,
  status: "pending",
  created_at: ISODate("...")
}
```

---

## 🚀 Next Steps

### To Go Live

1. **Get Razorpay Live Keys**
   - Complete KYC
   - Generate live API keys
   - Update .env file

2. **Update Real Data**
   - Add real menu items with photos
   - Update restaurant contact info
   - Add real testimonials

3. **Test Everything**
   - Place test orders
   - Test payment flow
   - Test admin dashboard
   - Test on mobile devices

4. **Marketing**
   - Share website link
   - Add to Google Maps
   - Create social media pages
   - Print QR codes for tables

5. **Monitor**
   - Check orders daily
   - Respond to bookings promptly
   - Keep menu updated
   - Track revenue

---

## 📞 Support Contact

For technical issues with the system:
- Backend logs: `/var/log/supervisor/backend.*.log`
- Frontend logs: `/var/log/supervisor/frontend.*.log`

For Razorpay issues:
- https://razorpay.com/support

---

**🎉 Congratulations! Your restaurant is now online!**

**Built with ❤️ for Indian Spices, Chiraura, Patna**
