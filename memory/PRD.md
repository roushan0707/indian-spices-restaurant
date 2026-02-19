# Indian Spices Restaurant Website - Product Requirements Document

**Last Updated:** December 20, 2024

## Original Problem Statement

Build a dynamic restaurant website for "Indian Spices" located in Chiraura, Patna (near AIIMS Hospital) that showcases authentic Indian cuisine with:
- Blend of traditional Bihari hospitality and modern dining
- Color palette: Deep Saffron, Charcoal Grey, and Cream
- WhatsApp ordering functionality
- Comprehensive menu display
- Table booking system
- Contact information with Google Maps
- Mobile-first responsive design

## Architecture & Tech Stack

### Frontend
- **Framework:** React 19.0.0
- **Styling:** Tailwind CSS with shadcn/ui components
- **Routing:** Single page application with smooth scroll
- **State Management:** React hooks
- **UI Components:** shadcn/ui library

### Backend (Planned)
- **Framework:** FastAPI (Python)
- **Database:** MongoDB with Motor (async driver)
- **API Structure:** RESTful APIs with /api prefix

### Data Structure (mock.js)
- Restaurant information (name, address, hours, contact)
- Menu categories with items (name, description, price, image, spicy level)
- Testimonials
- Gallery images
- Special offers

## User Personas

1. **Hospital Staff & Visitors:** Quick ordering, convenient location near AIIMS
2. **Local Residents:** Family dining, authentic taste, regular customers
3. **Food Enthusiasts:** Explore traditional Bihari and North Indian cuisine
4. **Tourists:** Discover local flavors, cultural experience

## What's Been Implemented (December 20, 2024)

### ✅ Frontend (Phase 1 - COMPLETED)

#### Components Created:
1. **Header.jsx** - Sticky navigation with smooth scroll, mobile menu
2. **Hero.jsx** - Hero section with background image, CTA buttons, location badge
3. **Menu.jsx** - Tabbed menu display with categories, food images, spicy indicators
4. **About.jsx** - Restaurant story with feature cards
5. **Testimonials.jsx** - Customer reviews with star ratings
6. **Gallery.jsx** - Filterable image gallery
7. **BookingForm.jsx** - Table reservation form with validation
8. **Contact.jsx** - Contact cards with Google Maps embed
9. **Footer.jsx** - Footer with quick links, contact info, floating WhatsApp button

#### Features Implemented:
- ✅ Responsive design (mobile-first)
- ✅ Smooth scroll navigation
- ✅ WhatsApp integration (Order & Contact)
- ✅ Dynamic menu with tabs and filtering
- ✅ Image gallery with category filters
- ✅ Table booking form (frontend only with mock submission)
- ✅ Google Maps integration
- ✅ Mobile hamburger menu
- ✅ Toast notifications (Sonner)
- ✅ Floating WhatsApp button
- ✅ Color scheme: Orange/Saffron (#ea580c), Charcoal Grey, Cream

#### Mock Data (mock.js):
- Restaurant info: name, address, phone, email, hours, coordinates
- Menu: 4 categories with 13+ items
- Testimonials: 3 customer reviews
- Gallery: 6 images
- Special offers: 2 active offers

## API Contracts (To be implemented)

### Restaurant Info
- `GET /api/restaurant/info` - Get restaurant details
- `PUT /api/restaurant/info` - Update restaurant info (admin)

### Menu Management
- `GET /api/menu/categories` - Get all menu categories with items
- `GET /api/menu/category/:id` - Get specific category
- `POST /api/menu/item` - Add new menu item (admin)
- `PUT /api/menu/item/:id` - Update menu item (admin)
- `DELETE /api/menu/item/:id` - Delete menu item (admin)

### Bookings
- `POST /api/bookings` - Create table booking
  - Body: { name, email, phone, date, time, guests, specialRequest }
- `GET /api/bookings` - Get all bookings (admin)
- `GET /api/bookings/:id` - Get specific booking
- `PUT /api/bookings/:id/status` - Update booking status (admin)

### Testimonials
- `GET /api/testimonials` - Get all testimonials
- `POST /api/testimonials` - Submit new testimonial
- `PUT /api/testimonials/:id/approve` - Approve testimonial (admin)

### Gallery
- `GET /api/gallery` - Get all gallery images
- `POST /api/gallery` - Upload new image (admin)
- `DELETE /api/gallery/:id` - Delete image (admin)

### Special Offers
- `GET /api/offers` - Get active offers
- `POST /api/offers` - Create offer (admin)
- `PUT /api/offers/:id` - Update offer (admin)

## Frontend-Backend Integration Plan

1. **Replace mock.js imports** with API calls using axios
2. **Add loading states** for all data fetching
3. **Implement error handling** with user-friendly messages
4. **Add authentication** for admin features
5. **Form submissions** to send data to backend
6. **Real-time updates** for bookings and menu changes

## Prioritized Backlog

### P0 - Critical (Next Phase)
- [ ] Backend API development (all endpoints)
- [ ] MongoDB models and schemas
- [ ] Form submission handlers
- [ ] Admin authentication
- [ ] Connect frontend to backend APIs

### P1 - High Priority
- [ ] Admin dashboard for managing menu, bookings, testimonials
- [ ] Email notifications for bookings
- [ ] WhatsApp API integration for automated messages
- [ ] Image upload functionality for gallery and menu
- [ ] Search functionality in menu
- [ ] Order tracking system

### P2 - Medium Priority
- [ ] Online payment integration
- [ ] Customer accounts and order history
- [ ] Rating and review system
- [ ] Multi-language support (Hindi/English)
- [ ] Social media integration
- [ ] Analytics dashboard
- [ ] SEO optimization

### P3 - Nice to Have
- [ ] Mobile app (React Native)
- [ ] Loyalty program
- [ ] Push notifications
- [ ] Live chat support
- [ ] Recipe blog section
- [ ] Delivery tracking

## Next Action Items

1. **Immediate:** Proceed with backend development
   - Set up MongoDB collections
   - Create FastAPI models and routes
   - Implement CRUD operations for all entities
   
2. **Testing:** After backend completion
   - Test all API endpoints
   - Integration testing with frontend
   - End-to-end testing with test agent

3. **Deployment Preparation:**
   - Environment configuration
   - Database seeding with initial data
   - Production optimization

## Technical Notes

- All images are from Unsplash/Pexels (placeholder)
- WhatsApp number: +919876543210 (placeholder)
- Google Maps coordinates: 25.6093, 85.1376 (approximate AIIMS Patna)
- Color scheme follows design guidelines (no dark gradients)
- Using lucide-react for all icons (no emojis)
- Mobile-first responsive design
