# CampusBite - Backend Server & Database Engine

Designed & developed by **Gokul M P** as part of the CampusBite SWE project.

## 🎯 Architecture & Specifications

This backend handles the core business logic, real-time dispatch, and data persistence for:
1. **User & Auth Module**: Student registration, JWT authentication with role authorization (`manager`, `cashier`, `kitchen`, `beverage`, `counter`, `student`), temporary guest sessions (2 hrs expiry), and token refresh.
2. **Menu Management Module**: Full CRUD for menu items, category and veg/non-veg filtering, and soft-delete protection for active orders.
3. **Order Management Module**: Order generation, server-side price recalculation, strictly enforced status progression (`Pending` ➔ `Preparing` ➔ `Ready` ➔ `Collected`), cancellation handling, and student order history.
4. **Payment Module**: Cashier cash verification endpoint (`/payment/verify-cash`) and Razorpay webhook listener (`/payment/webhook`).
5. **Token/QR Module**: Single-use token generation (`/token/generate`) and handover verification (`/token/verify`).
6. **Inventory Module**: Raw ingredients stock levels, minimum threshold alerts, and auto-marking menu items unavailable when linked stock reaches 0.
7. **Real-time Socket.io Dispatch**: Emits `newOrder`, `orderStatusChanged`, `paymentConfirmed`, and `lowStockAlert` to connected dashboards and mobile apps.
8. **Feedback & Coupons**: Post-collection ratings/comments and promotional coupon code validation.
9. **Manager Analytics**: MongoDB aggregations for hourly revenue trends, top-selling items velocity, peak ordering hours, and payment method ratios.
10. **Staff Account Management**: Staff account provisioning with role assignments.

---

## 📁 Directory Structure

```text
backend/
├── src/
│   ├── config/             # Database connection (Mongoose/MongoDB)
│   ├── controllers/        # Business logic for Auth, Menu, Orders, Payments, Tokens, Inventory, Reports, Staff, Feedback
│   ├── middleware/         # JWT auth and verifyRole RBAC middleware
│   ├── models/             # Mongoose schemas: User, MenuItem, Order, Payment, Token, Inventory, Feedback, Coupon
│   ├── routes/             # Express routes mapped to controllers
│   └── server.js           # Express app & Socket.io server
├── .env.example
├── .gitignore
└── package.json
```

---

## 🚀 Running the Backend

```bash
cd backend
npm install
npm run dev
```

Server runs on `http://localhost:5000` with WebSocket support at `ws://localhost:5000`.
