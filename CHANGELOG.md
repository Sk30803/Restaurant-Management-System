# Restaurant Management System - Changelog

**Date:** May 2, 2026  
**Comparing:** SRS Requirements vs Final Implementation

---

## Changes & Deviations from SRS

### User Authentication

**SRS Specified:**
- Session timeout after 15 minutes of inactivity

**Changed To:**
- Implemented: User registration, password hashing (bcrypt), JWT auth (24-hour expiration)
- Deferred: Inactivity-based session timeout

**Added:**
- Token blacklisting for immediate logout before expiration
- User role update endpoint (`PATCH /api/auth/users/:id/role`)
- Get all users endpoint for admin dashboard (`GET /api/auth/users`)

---

### Table Reservations

**SRS Specified:**
- 24-hour advance cancellation policy enforcement
- Pre-order viewing for kitchen preparation planning

**Changed To:**
-  Implemented: Reservations created with pre-order items, conflict detection (2-hour buffer)
-  Deferred: 24-hour cancellation policy (any time cancellation allowed)

**Added:**
- Conflict detection with 2-hour buffer window around reservation time
- Pre-order total calculation included in reservation
- ReservationDish bridge table for tracking pre-ordered items

---

### Online Ordering

**Changed:**
-  Implemented: Order creation, status tracking (PENDING → PREPARING → OUT_FOR_DELIVERY → DELIVERED), cart management, order history
-  Removed: "Ready" status (skipped from PREPARING directly to OUT_FOR_DELIVERY)

**Added:**
- OUT_FOR_DELIVERY intermediate status (not in SRS)
- Order type selection UI (DELIVERY vs TAKEAWAY)
- Payment method selection (CASH vs ONLINE)
- Branch selection for pickup orders
- Delivery fee calculation ($5 for delivery orders)

---

### Event & Catering Booking

**SRS Specified:**
- Event space availability checking
- Event space conflict detection and double-booking prevention
- Space allocation logic
- Customer notifications upon approval/rejection
- Per-person pricing with dietary tiers

**Changed To:**
-  Implemented: Event booking form, menu selection, guest count, catering cost calculation, approval/rejection workflow
-  Simplified: Per-person pricing (linear calculation: sum of dish prices × guest count)

**Added:**
- CHANGES_REQUESTED catering status (not in SRS)
- Catering can only be updated while PENDING
- Automatic reference number generation
- Catering request mock notifications to admin

---

### Menu Management

**SRS Specified:**
- Admin CRUD for menu items and categories
- Item availability updates

**Changed To:**
-  Implemented: Create, read, update, delete menu items
-  Deferred: Menu item availability scheduling, goes against business scenario

---

### User Roles

**SRS Specified:**
- Two roles: Customer, Staff
- Kitchen Staff specific interface
- Event Coordinator specific interface
- Fine-grained permissions per function

**Changed To:**
-  Implemented: Two roles - CUSTOMER and ADMIN
-  Consolidated: All staff functions under ADMIN role

---

### Admin Dashboard

**SRS Specified:**
- Basic operational reporting of reservations and orders

**Changed To:**
-   Enhanced: Dashboard with detailed statistics

**Added:**
- Total revenue calculation (orders + reservations)
- Active orders count
- Total customers vs total users
- Recent orders list (last 5)
- Today's reservations list (last 5)
- Stat cards with visual design

---

### Frontend Pages & Navigation

**SRS Specified:**
- Role-specific dashboards and navigation
- Responsive web interface supporting mobile to desktop

**Changed To:**
-   Implemented: Separate customer and admin layouts with responsive design

**Added:**
- **New Customer Pages:**
  - History page (unified view of orders, reservations, and catering events in tabs)
  - Checkout page (step-by-step order completion)
  
- **New Admin Pages:**
  - Dashboard (stats and recent activity)
  - Manage Reservations (approve/deny shown in UI but endpoint works)
  - Manage Orders (status transitions)
  - Manage Events (approve/reject catering)
  - Manage Users (view and manage users)

---

### Order Status Workflow

**SRS Specified:**
- Received → Preparing → Ready → Completed

**Changed To:**
- PENDING → PREPARING → OUT_FOR_DELIVERY → DELIVERED
- Plus CANCELLED for terminal cancellation

**Changes:**
- Renamed "Received" to "PENDING"
- Removed "Ready" status entirely
- Added "OUT_FOR_DELIVERY" intermediate state
- Added "CANCELLED" terminal state

---

### Reservation Conflict Detection

**SRS Specified:**
- Zero double-booking incidents through proper database constraints

**Implemented As:**
- 2-hour buffer window (1 hour before and 1 hour after reservation time)
- Checks for overlapping reservations on same table
- Throws error if conflict found
- Note: Not a database constraint; logic-based checking

---

### Frontend Architecture

**Not in SRS:** Specific implementation details

**Added:**
- React Context API for auth and cart state management
- Custom hooks:
  - `useAuth()` - Authentication context consumer
  - `useCart()` - Cart context consumer
  - `useScrollOnUpdate()` - Auto-scroll on component updates
- Client-side route protection based on user role
- Glassmorphic design system with CSS variables

---

### API Additions Beyond SRS

**Added Endpoints:**

Authentication:
- `PATCH /api/auth/users/:id/role` - Admin role management
- `GET /api/auth/users` - List all users (admin)
- `POST /api/auth/logout` - Token blacklisting

---

### Database Schema Changes

**Added:**
- `BlacklistedToken` model for logout token tracking
- `CateringDish` bridge table for many-to-many Catering-Dish relationship
- `OrderDish` bridge table for many-to-many Order-Dish relationship
- `ReservationDish` bridge table for many-to-many Reservation-Dish relationship

**Enums Added/Modified:**
- `CateringStatus`: Added `CHANGES_REQUESTED` (not in SRS)
- `OrderStatus`: Added `OUT_FOR_DELIVERY` (not in SRS)
- `OrderType`: Added to clarify DELIVERY vs TAKEAWAY
- `PaymentMethod`: Added to clarify CASH vs ONLINE

---

### Simplified Features

#### Order Status Tracking
- **SRS:** Received → Preparing → Ready → Completed
- **Implemented:** PENDING → PREPARING → OUT_FOR_DELIVERY → DELIVERED (Ready removed)

---

### Features Not Carried Forward

- SMS and email notification system
- Menu item availability scheduling
- 24-hour cancellation policy enforcement
- "Ready" order status

---
