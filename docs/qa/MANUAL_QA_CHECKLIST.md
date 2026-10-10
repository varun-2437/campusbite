# CampusBite - Comprehensive Manual QA & Testing Checklist
**Module Lead:** Padhmacharan M  
**Course:** 23CCE302 - Software Engineering

---

## 1. User & Authentication Testing
- [x] **Guest User Flow:** User launches app ➔ selects "Continue as Guest" ➔ accesses menu without password ➔ attempts to view Order History ➔ receives prompt to create an account.
- [x] **Student Signup:** User registers with college email ➔ duplicate email test returns `409 Conflict` ➔ successful registration grants 50 welcome loyalty points.
- [x] **Role-Based Web Login:** Cashier credentials redirect to `/cashier`; Kitchen credentials redirect to `/kitchen`; Manager credentials access all tabs.

---

## 2. Order & Payment Flow Testing
- [x] **Online Payment Flow (Razorpay):**
  - Item selected ➔ cart subtotal calculated ➔ order created.
  - Razorpay order ID requested ➔ webhook receiver handles `payment.captured` ➔ payment status moves to `Paid`.
  - Payment failure simulation: shows retry prompt without losing cart contents.
- [x] **Cash Payment Flow:**
  - Cash payment option selected at checkout ➔ temporary token generated.
  - Order sits in "Pending Payment" on Kitchen KDS until Cashier confirms payment.
  - 15-minute cleaner job automatically cancels abandoned unpaid cash orders.
- [x] **Refund Flow:**
  - Cashier enters Order ID + refund reason ➔ status moves to `Cancelled` & payment to `Refunded` ➔ inventory released.

---

## 3. QR Code & Token Security Testing
- [x] Unique QR payload format validated: `CAMPUSBITE-<orderId>-<tokenId>`.
- [x] **Single-Use Enforcement:** Handover scans token ➔ order marked `Collected`. Second scan attempt is strictly rejected with `Token already used`.

---

## 4. Kitchen & Beverage Display Systems (KDS)
- [x] **Food vs Beverage Partition:** Food items appear exclusively on Chef KDS; Juices/Beverages appear exclusively on Beverage Display.
- [x] **Elapsed Timers:** Tickets change border color from orange to red if elapsed time exceeds 15 minutes.
- [x] **Status Transitions:** Pending ➔ Preparing ➔ Ready cannot skip or transition backwards.

---

## 5. Load & Concurrency Testing
- [x] Simulated 50 concurrent order placements using Postman / Newman collection runner.
- [x] Server-side total calculation verified to block client price manipulation.
