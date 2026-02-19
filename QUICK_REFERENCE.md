# Quick Reference Guide - Indian Spices Restaurant

## 🔐 Admin Access

**URL:** `/admin/login`  
**Username:** `admin`  
**Password:** `admin123`

---

## 📱 Key URLs

| Page | URL | Description |
|------|-----|-------------|
| Home | `/` | Main landing page |
| Checkout | `/checkout` | Order checkout page |
| Order Success | `/order-success` | After payment confirmation |
| Admin Login | `/admin/login` | Admin authentication |
| Admin Dashboard | `/admin/dashboard` | Management panel |

---

## 🎯 Quick Actions

### For Restaurant Staff

**Process New Order:**
1. Login to admin dashboard
2. Go to "Orders" tab
3. Click "Start Preparing" → "Mark Ready" → "Delivered"

**Confirm Table Booking:**
1. Go to "Bookings" tab
2. Review details
3. Click "Confirm"
4. Call customer

**Update Menu Availability:**
- Use API endpoint: `PUT /api/menu/item/{itemId}`
- Set `"available": false` for out-of-stock items

---

## 💻 Technical Quick Commands

### Check Service Status
```bash
sudo supervisorctl status
```

### Restart Services
```bash
# Restart backend
sudo supervisorctl restart backend

# Restart frontend
sudo supervisorctl restart frontend

# Restart all
sudo supervisorctl restart all
```

### View Logs
```bash
# Backend logs
tail -f /var/log/supervisor/backend.out.log

# Frontend logs
tail -f /var/log/supervisor/frontend.out.log

# Error logs
tail -f /var/log/supervisor/backend.err.log
```

### MongoDB Access
```bash
mongosh
use test_database
db.orders.find().pretty()  # View all orders
db.bookings.find().pretty()  # View all bookings
```

---

## 🔑 Environment Variables

**Backend (.env location):** `/app/backend/.env`

```env
MONGO_URL="mongodb://localhost:27017"
DB_NAME="test_database"
JWT_SECRET_KEY="your-secret-key"
RAZORPAY_KEY_ID="your_key_id"
RAZORPAY_KEY_SECRET="your_secret"
```

**Frontend (.env location):** `/app/frontend/.env`

```env
REACT_APP_BACKEND_URL=https://your-domain.com
```

---

## 📊 Order Status Flow

```
received → preparing → ready → delivered
```

**Status Meanings:**
- `received` - New order, payment confirmed
- `preparing` - Kitchen is cooking
- `ready` - Food ready for pickup/delivery
- `delivered` - Order completed

---

## 🛠️ Common API Calls

### Get Authentication Token
```bash
curl -X POST https://your-domain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Get All Orders
```bash
curl -X GET https://your-domain.com/api/orders \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Update Order Status
```bash
curl -X PUT "https://your-domain.com/api/orders/ORDER_ID/status?status=preparing" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Menu
```bash
curl -X GET https://your-domain.com/api/menu/categories
```

---

## 🐛 Troubleshooting Checklist

**Backend Issues:**
- [ ] Check if backend is running: `sudo supervisorctl status backend`
- [ ] Check MongoDB connection
- [ ] Review error logs: `tail -f /var/log/supervisor/backend.err.log`
- [ ] Restart backend: `sudo supervisorctl restart backend`

**Frontend Issues:**
- [ ] Check if frontend is running: `sudo supervisorctl status frontend`
- [ ] Clear browser cache and localStorage
- [ ] Check console for errors (F12 in browser)
- [ ] Restart frontend: `sudo supervisorctl restart frontend`

**Payment Issues:**
- [ ] Verify Razorpay keys in `/app/backend/.env`
- [ ] Check if using correct keys (test vs live)
- [ ] Test with test card: 4111 1111 1111 1111

**Database Issues:**
- [ ] Check MongoDB is running: `sudo systemctl status mongod`
- [ ] Verify connection string in .env
- [ ] Check database exists: `mongosh` → `show dbs`

---

## 📞 Emergency Contacts

**Technical Support:**
- Check logs first
- Review documentation
- Test API endpoints with curl

**Razorpay Support:**
- https://razorpay.com/support
- support@razorpay.com

---

## 🎯 Daily Checklist

### Morning Routine
- [ ] Check admin dashboard
- [ ] Review pending orders
- [ ] Confirm today's bookings
- [ ] Check menu item availability

### During Service
- [ ] Monitor new orders
- [ ] Update order status promptly
- [ ] Respond to bookings quickly
- [ ] Mark unavailable items

### End of Day
- [ ] Review completed orders
- [ ] Check revenue total
- [ ] Update menu for tomorrow
- [ ] Backup important data

---

## 🚨 Critical Numbers

**MongoDB Port:** 27017  
**Backend Port:** 8001  
**Frontend Port:** 3000

**Default Admin:**
- Username: `admin`
- Password: `admin123`

⚠️ **Change default password immediately!**

---

## 📦 File Locations

| Component | Location |
|-----------|----------|
| Backend API | `/app/backend/server.py` |
| Backend Routes | `/app/backend/routes.py` |
| Backend Models | `/app/backend/models.py` |
| Frontend App | `/app/frontend/src/App.js` |
| Menu Component | `/app/frontend/src/components/Menu.jsx` |
| Cart Context | `/app/frontend/src/context/CartContext.jsx` |
| Admin Dashboard | `/app/frontend/src/pages/AdminDashboard.jsx` |
| API Client | `/app/frontend/src/api/index.js` |

---

**Last Updated:** December 20, 2024  
**Version:** 1.0.0
