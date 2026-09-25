# CampusBite - Staff & Admin Web Dashboard

Designed & developed by **M Varun** as part of the CampusBite SWE project.

## 🎯 Scope of Work

Based on the [CampusBite Implementation Plan](../CampusBite_Full_Implementation_Plan.md#m-varun---staffadmin-web-dashboard-react):



1. **Authentication & Role-Based Routing**
   - Single unified login screen with automatic redirect based on user role (`Cashier`, `Kitchen`, `Counter`, `Manager`).
   - Protected routes & route guards.
2. **Cashier Dashboard**
   - Walk-in order creator (item picker + quantity without requiring student mobile app).
   - Cash payment verification (scan QR or token ID lookup).
   - Refund processing with reason logging.
   - Daily transactions table with cash/online split.
3. **Kitchen Dashboard (Food KDS)**
   - Real-time incoming food-only orders via Socket.io.
   - Priority badges, item breakdown, and status progression (`Pending` ➔ `Preparing` ➔ `Ready`).
4. **Juice / Beverage Counter Dashboard**
   - Filtered view exclusively for beverages, juices, shakes, and ice creams.
5. **Food / Serving Counter Dashboard**
   - Token scanner/verifier for customer order handover.
   - Public-facing "Now Serving" board display.
6. **Manager Dashboard**
   - Menu Management (CRUD + real-time availability toggle).
   - Inventory Management (stock levels, threshold alerts, low-stock notifications).
   - Sales & Analytics (Recharts for revenue trends, peak hours, top sellers, payment breakdown).
   - Staff Accounts Management (create/deactivate staff accounts).
   - Customer Feedback & Ratings review.

---

## 📁 Directory Structure

```text
admin-dashboard/
├── public/                 # Static assets
├── src/
│   ├── assets/             # Icons, logos, and images
│   ├── components/
│   │   ├── common/         # Buttons, Modal, Input, Badge, Table, QR Scanner
│   │   └── layout/         # Sidebar, Header, ProtectedRoute, "Now Serving" layout
│   ├── context/            # AuthContext, SocketContext, NotificationContext
│   ├── hooks/              # Custom hooks (useSocket, useAuth, useOrders)
│   ├── pages/
│   │   ├── auth/           # Login.jsx
│   │   ├── cashier/        # WalkInOrder.jsx, VerifyCash.jsx, Transactions.jsx, Refunds.jsx
│   │   ├── kitchen/        # KitchenDisplay.jsx
│   │   ├── beverage/       # BeverageDisplay.jsx
│   │   ├── counter/        # ServingCounter.jsx, NowServingBoard.jsx
│   │   └── manager/        # MenuManagement.jsx, InventoryManagement.jsx, SalesReports.jsx, StaffAccounts.jsx, FeedbackOverview.jsx
│   ├── services/           # api.js (Axios/fetch client), socket.js, authService.js
│   ├── styles/             # index.css (tokens, variables, global theme)
│   ├── utils/              # formatters.js (currency, dates), constants.js
│   ├── App.jsx             # Route definitions & layout wrappers
│   └── main.jsx            # Application entry point
├── .gitignore
├── index.html
├── package.json
└── vite.config.js
```
