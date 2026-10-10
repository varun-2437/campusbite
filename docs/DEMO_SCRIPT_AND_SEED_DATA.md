# CampusBite - Final Live Demo Script & Seed Data
**Prepared by:** Padhmacharan M  
**Time Limit:** 10-12 Minutes Presentation

---

## 👥 Demo Roles
1. **Presenter 1 (Krithik):** Student App on Flutter / Mobile Emulator.
2. **Presenter 2 (Varun):** Cashier POS & Serving Counter Web Screens.
3. **Presenter 3 (Gokul):** Live Kitchen Display System (KDS) & Juice Bar.
4. **Presenter 4 (Padhmacharan):** Manager Analytics, Payments, & Architecture Review.

---

## 🎬 Step-by-Step Demo Flow

### Act 1: Student App Ordering (Krithik)
1. Launch app ➔ Demonstrate **Guest Mode** banner ➔ Switch to **Student Login**.
2. Filter Menu by **Veg Only** and category **Snacks**.
3. Add `Chicken Crispy Burger` and `Fresh Mango Juice` to Cart.
4. Add customization: `"Less spicy, extra tissue"`.
5. Apply Coupon Code: `CAMPUS20` (Demonstrates discount deduction: -₹20).
6. Choose **Online (Razorpay)** payment ➔ Submit order ➔ Display dynamic QR token generated: **TK-101**.

### Act 2: Kitchen Display System (Gokul & Varun)
1. Switch to Web Dashboard at `/kitchen`.
2. Notice **TK-101** automatically populated with priority badge and timer via Socket.io.
3. Juice item routed to `/beverage`.
4. Click **"Start Preparing"** ➔ Mobile app stepper dynamically shifts to **"Preparing"**.
5. Click **"Mark Ready"** ➔ Mobile app receives push alert: *"Your Food is Ready! 🔔"*.

### Act 3: Serving Counter & Handover (Varun)
1. Switch to `/now-serving` (Demonstrate TV Fullscreen Mode for cafeteria monitors).
2. Switch to `/counter` ➔ Click **"Scan QR"** (Simulate camera barcode scanner).
3. Validate token **TK-101** ➔ Order marked **Collected**.
4. Attempt to scan **TK-101** a second time ➔ Security rejection: *"Token already redeemed"*.

### Act 4: Post-Pickup & Management (Padhmacharan & Varun)
1. Student mobile screen automatically prompts for **Feedback** ➔ Submit 5-star review.
2. Open `/manager/reports` ➔ Show updated hourly sales graph, revenue spike, and top-seller velocity.
3. Open `/manager/inventory` ➔ Show auto-deducted inventory quantities with low-stock warnings.

---

## 📊 Pre-Seeded Presentation Accounts
- **Manager:** `varun.manager@campusbite.com` / `password123`
- **Cashier:** `gokul.cashier@campusbite.com` / `password123`
- **Kitchen:** `anthony.kitchen@campusbite.com` / `password123`
- **Beverage:** `ravi.juice@campusbite.com` / `password123`
- **Student:** `krithik@campusbite.com` / `password123`
