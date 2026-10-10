# CampusBite - Smart Campus Dining & Canteen Operations Platform

CampusBite is a unified smart campus food ordering and canteen management system. It consolidates the student diner experience and all canteen staff operations (Cashier, Kitchen, Juice Bar, Pickup Counter, Manager Portal, and Public TV Display) into a **single, responsive, high-performance React Web Application**.

---

## 🌟 Why a Single Unified React Web Application?

Previously, the project was fragmented across multiple conflicting stacks (including two redundant Flutter mobile apps and a web dashboard) that required separate mobile toolchains and failed to run on standard machines. 

By unifying the entire platform into **React + Vite**:
- **One Universal App**: Runs seamlessly across mobile phones, tablets, desktop browsers, and canteen counter screens without any mobile emulators or Flutter SDK setups.
- **Instant Role & Persona Switching**: Switch between Student Diner, Cashier POS, Kitchen KDS, Juice Bar, Serving Counter, Manager Portal, and Public TV Board with 1 click from the top navigation bar.
- **Real-Time Cross-Role Synchronization**: Placing an order as a student instantly reflects in the Cashier and Kitchen display queues. Status transitions made by chefs or counter staff immediately update the student's live tracking stepper and the Now Serving TV board.

---

## 🚀 Key Modules & Capabilities

### 🎓 1. Student / Canteen Diner Experience
- **Today's Specials Carousel**: High-definition food photos with prices, discounts, and preparation times.
- **Categorized Menu & Instant Search**: Filter by categories (Main Course, Curries, Hot Drinks, Chocolates, Ice Creams, Desserts) and Pure Veg toggle.
- **Food Customization Modal**: Add-ons (extra cheese, spicy tosses, syrups), cooking instructions for chefs, and quantity controls.
- **Cart & Promo Discounts**: Itemized bill, coupon redemption (`CAMPUS50`, `CAMPUS20`, `STUDENT10`), and tax/fee breakdowns.
- **Dual Payment Flows**:
  - **Online via Razorpay (Simulated Gateway)**: UPI (GPay, PhonePe, Paytm), Cards, and NetBanking with authentic sandbox simulator.
  - **Cash at Counter**: Instant Token & SVG QR generation to pay at the cashier counter.
- **Live 4-Step Order Tracking Stepper**: `Pending` ➔ `Preparing (Kitchen)` ➔ `Ready (Counter)` ➔ `Collected`.
- **Digital Pickup Pass**: High-contrast SVG QR code and Token Badge (`#TK-101`) for counter handover.
- **Loyalty & Rewards**: Earn 10 points per ₹100 spent, student membership tiers (Bronze, Silver, Gold), and 1-click reward voucher redemption.
- **1-Click Past Order Reorder**: View receipts and repopulate cart instantly.
- **Interactive Review & Feedback**: 5-star rating, quality tags, and chef reviews with bonus loyalty points (+15 pts).

### 🛠️ 2. Staff & Admin Operations
- **💵 Cashier POS**: Create walk-in orders, verify cash payments by Token/QR scan, view daily revenue splits, and issue refunds.
- **👨‍🍳 Kitchen Display (KDS)**: Real-time food order queue, countdown timers, priority tags, and status progression (`Pending` ➔ `Preparing` ➔ `Ready`).
- **🥤 Beverage Bar**: Specialized beverage, juice, and ice cream queue with quick status toggles.
- **🛎️ Serving Counter**: Scan/enter token, handover orders, and mark them as `Collected`.
- **📺 Now Serving TV Display**: Fullscreen canteen display board showing "Now Preparing" and "Ready for Pickup" tokens.
- **📊 Manager Portal**:
  - **Menu Management**: Add/edit/delete food items, toggle availability, update pricing and images.
  - **Inventory Management**: Real-time stock levels, deduction upon order collection, and low-stock alerts.
  - **Sales Analytics**: Visual charts for revenue trends, peak order hours, top-selling items, and payment method splits.
  - **Staff Accounts**: Manage staff credentials and assign roles.
  - **Feedback Overview**: Live feed of customer ratings, feedback tags, and reviews.

---

## 💻 Quick Start & Running Locally

### 1. Unified Web Application (Frontend)
```bash
# From the root directory:
npm run dev

# Or from the admin-dashboard folder:
cd admin-dashboard
npm install
npm run dev
```
Open **`http://localhost:5173/`** in your browser to experience the full app.

### 2. Backend Server (Optional / Live API Sync)
```bash
cd backend
npm install
npm run dev
```

---

## 📁 Repository Structure
```
campusbite/
├── package.json               # Root convenience runner
├── README.md                  # Project overview & documentation
├── CampusBite_Full_Implementation_Plan.md
├── admin-dashboard/           # Unified React Web Application
│   ├── index.html
│   ├── vite.config.js         # Configured on port 5173
│   ├── package.json
│   └── src/
│       ├── App.jsx            # Unified routes (Student & Staff)
│       ├── components/
│       │   ├── navigation/    # UnifiedNavbar with persona switcher
│       │   ├── student/       # CustomizationModal, RazorpaySimulator, FeedbackModal
│       │   └── layout/        # StudentLayout, Staff Sidebar & Layout
│       ├── context/
│       │   ├── StoreContext.jsx # Shared reactive state (Cart, Orders, Menu, Inventory)
│       │   └── AuthContext.jsx  # Staff & Student role authentication
│       ├── pages/
│       │   ├── student/       # StudentHome, CartCheckout, OrderTracking, OrderHistory, LoyaltyRewards
│       │   ├── cashier/       # Cashier POS
│       │   ├── kitchen/       # Kitchen KDS
│       │   ├── beverage/      # Beverage Bar
│       │   ├── counter/       # Serving Counter & TV Board
│       │   └── manager/       # Menu, Inventory, Reports, Staff, Feedback
│       └── services/
│           └── mockData.js    # Comprehensive campus menu, orders, inventory & sales data
├── backend/                   # Node.js / Express backend
└── archive/                   # Archived legacy Flutter prototypes
    ├── mobile-app/
    └── student-app/
```
