# CampusBite - Full Implementation Plan (Feature-Level, Per Member)

Every feature of the app broken down individually, grouped under the person who owns it, with exact screens/modules, data fields, APIs/logic, and edge cases to handle.

---

## GOKUL M P - Backend & Database

### 1. User & Auth Module
- **Models:** `User` (base: userId, name, email, password-hash, role), extended by `RegisteredStudent` (studentId, loyaltyPoints), `GuestUser` (sessionId only, no persisted history), `Cashier`/`KitchenStaff`/`CounterStaff`/`Manager` (staffId, assignedCounter/type)
- **APIs:**
  - `POST /auth/register` - student signup (validate college email/ID format)
  - `POST /auth/login` - returns JWT + role
  - `POST /auth/guest-session` - issues temp guest token (no DB user record, just session)
  - `POST /auth/logout`
  - `POST /auth/refresh-token`
- **Logic:** bcrypt password hashing, JWT with role embedded in payload, middleware `verifyRole(['manager'])` for protected routes
- **Edge cases:** duplicate email on register, expired JWT handling, guest session timeout (e.g., 2 hrs)

### 2. Menu Management Module
- **Model:** `MenuItem` (itemId, name, price, category, isAvailable, prepTime, isVeg, imageUrl)
- **APIs:**
  - `GET /menu` (filter by category, veg/non-veg, availability)
  - `POST /menu` (Manager only - add item)
  - `PUT /menu/:id` (edit price/availability)
  - `DELETE /menu/:id`
- **Logic:** auto-mark `isAvailable=false` when linked inventory item hits 0 stock
- **Edge cases:** deleting an item that's part of an active order (soft-delete instead of hard delete)

### 3. Order Management Module
- **Models:** `Order` (orderId, studentId/guestSessionId, status, createdAt, totalAmount), `OrderItem` (orderId, itemId, quantity, customization)
- **APIs:**
  - `POST /order` - create order, calculate total (items + coupon discount)
  - `PUT /order/:id/status` - update status (Pending→Preparing→Ready→Collected/Cancelled)
  - `GET /order/:id`
  - `GET /order/history/:studentId` (registered only)
  - `PUT /order/:id/cancel`
- **Logic:** status can only move forward except explicit cancel before "Preparing"; total recalculated server-side (never trust client price)
- **Edge cases:** order placed but payment never completes (auto-cancel after timeout), concurrent stock deduction race condition

### 4. Payment Backend Module
- **Model:** `Payment` (paymentId, orderId, method, amount, status)
- **APIs:**
  - `POST /payment/verify-cash` - Cashier confirms cash received
  - `POST /payment/webhook` - Razorpay webhook receiver (marks payment Paid)
- **Logic:** order only moves to "Paid" after payment confirmation (webhook or cashier verification), not on order creation
- **Edge cases:** webhook received twice (idempotency key), webhook never arrives (poll/reconcile job)

### 5. Token/QR Backend Module
- **Model:** `Token` (tokenId, orderId, qrCode, generatedAt, isUsed)
- **APIs:**
  - `POST /token/generate` (called after payment confirmed)
  - `POST /token/verify` - staff scans/enters token, marks `isUsed=true`
- **Edge cases:** reused/already-used token attempt, expired unpaid cash token cleanup job

### 6. Inventory Module
- **Model:** `Inventory` (itemName, quantity, threshold)
- **APIs:**
  - `GET /inventory`
  - `PUT /inventory/:id` (Manager updates stock)
  - Internal: auto-deduct stock quantity when linked order is completed
- **Logic:** `checkLowStock()` runs on every deduction, triggers Notification to Manager if below threshold

### 7. Notifications (trigger side)
- Backend emits events (`orderAccepted`, `paymentConfirmed`, `foodReady`, `orderCompleted`) consumed by Padhmacharan's FCM module and Socket.io

### 8. Feedback & Coupons/Loyalty Module
- **Models:** `Feedback` (orderId, rating, comment), `Coupon` (code, discountValue, expiryDate)
- **APIs:** `POST /feedback`, `GET /feedback` (Manager view), `POST /coupon/validate`, `POST /loyalty/redeem`
- **Logic:** loyalty points credited only to RegisteredStudent on order completion (e.g., ₹100 = 10 points)

### 9. Analytics/Reports Module (Manager)
- **APIs:**
  - `GET /reports/revenue?range=daily|weekly|monthly`
  - `GET /reports/top-items` (best/least selling)
  - `GET /reports/peak-hours`
  - `GET /reports/avg-wait-time`
  - `GET /reports/payment-split` (cash vs online %)
- **Logic:** MongoDB aggregation pipelines grouped by date/item/hour

### 10. Staff Account Management
- **API:** `POST /staff` (Manager creates Cashier/Kitchen/Counter account with role + credentials)

---

## KRITHIK J Y - Student Mobile App (Flutter)

### 1. Onboarding & Auth Screens
- Splash screen → Login / Register / **Continue as Guest** buttons
- Register screen: student ID, email, password, confirm password (client-side validation)
- Login screen: email + password, "forgot password" link
- Guest mode: skips auth, straight to menu with a temp session banner ("Guest Mode - Sign up to save your order")

### 2. Home Dashboard Screen
- Today's specials carousel
- "Reorder last order" quick button (registered only)
- Active order status banner (if an order is in progress, pinned to top)

### 3. Menu Browsing Screen
- Category tabs (Breakfast/Lunch/Snacks/Beverages)
- Search bar + veg/non-veg filter toggle
- Item card: image, name, price, prep time, "Add" button
- Item detail modal: customization options (e.g., "extra cheese"), quantity selector

### 4. Cart & Checkout Screen
- Cart list with quantity edit/remove
- Coupon code input field with validate button
- Total breakdown (subtotal, discount, final amount)
- Payment method selector: **Online** (Razorpay checkout SDK) or **Cash** (generates temp token/QR)

### 5. Order Tracking Screen
- Stepper UI: Confirmed → Preparing → Ready → Collected (live via Socket.io listener)
- QR/token display for pickup verification
- Estimated ready time

### 6. Order History Screen (Registered only)
- List of past orders with date, items, amount, status
- "Reorder" button per entry
- Guest note: "Sign up to keep your order history" shown if guest tries to access this tab

### 7. Loyalty & Rewards Screen
- Points balance display
- Available coupons list with redeem button
- Points-earning history log

### 8. Feedback Screen
- Triggered after order marked "Collected"
- Star rating (1-5) + comment box + submit

### 9. Notifications
- In-app notification center (list of past alerts)
- Push notification handling (foreground/background) via Firebase SDK

### 10. Profile Screen
- Edit name/email, saved payment method display, logout button

---

## M VARUN - Staff/Admin Web Dashboard (React)

### 1. Login Screen
- Single login form, redirects based on role returned by backend (Cashier/Kitchen/Counter/Manager)

### 2. Cashier Dashboard
- **Create Walk-in Order:** item picker grid + quantity, generates order without app
- **Verify Cash Payment:** scan QR or manually enter token ID, confirm button
- **Process Refund:** search order by ID, refund reason field, confirm
- **Daily Transactions Table:** list of today's payments (cash/online split), export option

### 3. Kitchen Dashboard
- Real-time incoming **food-only** order queue (Socket.io feed)
- Each order card: order #, items, quantity, special instructions, priority tag (VIP/bulk/quick)
- Status buttons: Pending → Preparing → Ready

### 4. Juice/Beverage Counter Dashboard
- Same structure as Kitchen Dashboard but filtered to drink items only (juice, shakes, ice cream)

### 5. Food/Serving Counter Dashboard
- Scan/enter token input to confirm order handover
- "Now Serving" board view (public display friendly)
- Mark as Completed button

### 6. Manager Dashboard (multiple pages)
- **Menu Management:** table of items, add/edit/delete, toggle availability switch
- **Inventory Management:** stock table, edit quantity/threshold, low-stock alert banner at top
- **Sales Reports:** charts for revenue trend, best/least-selling items, peak hours, payment method split (using Chart.js/Recharts)
- **Staff Accounts:** create/deactivate Cashier/Kitchen/Counter accounts, assign role
- **Feedback Overview:** filterable table of customer ratings/comments

### 7. Shared/Common
- Role-based route guards (redirect unauthorized access)
- Live order-count badge in nav (via Socket.io)
- Responsive layout for tablet use at counters

---

## PADHMACHARAN M - Payments, Notifications, QR/Token, Testing & Deployment

### 1. Online Payment Integration
- Razorpay order creation call from backend before checkout
- Razorpay Checkout SDK integrated into Flutter app
- Webhook listener to confirm payment server-side (never trust client-side "success" alone)
- Handle payment failure → show retry option to student

### 2. Cash Payment Flow
- Generate temporary token/QR immediately on "Cash" selection (before cashier verification)
- Auto-expire/cancel unpaid cash tokens after a configurable time (e.g., 15 mins)

### 3. QR/Token System
- Generate unique QR (`qrcode` package) tied to `tokenId`
- Build scanning module: camera-based scan on web dashboard (`qr-scanner`) and mobile
- Enforce single-use validation (reject already-used token)

### 4. Notification System
- Firebase Cloud Messaging setup (both app + web dashboard for staff alerts)
- Trigger points: Order Accepted, Payment Successful, Food Preparing, Food Ready, Order Completed, Coupon Available
- Notification preferences toggle (optional, in student profile)

### 5. Testing
- Unit tests for backend APIs (Jest) - auth, order calculation, coupon logic
- Integration tests: full order lifecycle (place → pay → prepare → collect)
- Manual QA checklist: guest flow, registered flow, cash flow, online flow, refund flow
- Load testing key endpoints (Postman/Newman) - simulate peak-hour concurrent orders

### 6. Deployment
- Environment variables management (.env for Razorpay keys, JWT secret, DB URI)
- CI/CD: GitHub Actions to auto-deploy backend (Render) and dashboard (Vercel) on merge to main
- Production MongoDB Atlas cluster setup with backups enabled
- Build & sign Flutter APK for final demo
- Prepare demo script + seed/test data for presentation

---

## INTEGRATION CHECKPOINTS (all 4 together)
- After Phase 2: Gokul's auth APIs must work with Krithik's login screen and Varun's staff login
- After Phase 3: Padhmacharan's payment flow must plug into Gokul's Order APIs and Krithik's checkout screen
- After Phase 4: Socket.io events from Gokul must reflect live on both Krithik's tracking screen and Varun's kitchen dashboard
- Final: End-to-end test - place order (app) → pay → appears on kitchen dashboard → status updates live → student notified → collected → feedback submitted → reflects in Manager's sales report
