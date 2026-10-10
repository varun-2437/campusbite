# CampusBite - Student & Guest Mobile Application (Flutter)

Designed & developed by **Krithik J Y** as part of the CampusBite SWE project.

## 📱 Modules & Implemented Screens

1. **Onboarding & Auth Screens** ([`onboarding_screen.dart`](lib/views/auth/onboarding_screen.dart), [`login_screen.dart`](lib/views/auth/login_screen.dart), [`register_screen.dart`](lib/views/auth/register_screen.dart))
   - Splash screen with student sign-in, account creation, and **Guest Mode** ("Continue as guest").
   - Client-side validation and password recovery.
2. **Home Dashboard** ([`home_screen.dart`](lib/views/home/home_screen.dart))
   - Today's cafeteria specials carousel.
   - One-tap "Favorite & Reorder" card.
   - Pinned live order banner showing in-progress status.
3. **Menu Browsing** ([`menu_screen.dart`](lib/views/menu/menu_screen.dart))
   - Category tabs (Breakfast, Lunch, Snacks, Beverages).
   - Real-time search and veg/non-veg toggle switch.
   - Item detail bottom sheet with customization input and quantity selector.
4. **Cart & Checkout** ([`cart_screen.dart`](lib/views/cart/cart_screen.dart))
   - Item quantity controls and removal.
   - Coupon code validator (`CAMPUS20`, `WELCOME50`).
   - Payment method selector: **Online (Razorpay)** or **Cash at Counter**.
5. **Live Order Tracking** ([`order_tracking_screen.dart`](lib/views/tracking/order_tracking_screen.dart))
   - Stepper timeline: `Pending` ➔ `Preparing` ➔ `Ready` ➔ `Collected`.
   - Real-time generated QR code (`qr_flutter`) and token number for pickup.
6. **Order History** ([`order_history_screen.dart`](lib/views/history/order_history_screen.dart))
   - Past order invoices with item breakdown and reorder button.
   - Guest restriction guard prompting account creation.
7. **Loyalty & Rewards** ([`loyalty_screen.dart`](lib/views/loyalty/loyalty_screen.dart))
   - Live points balance card (10 points per ₹100 spent).
   - Unlockable coupons catalog and redemption history.
8. **Feedback Screen** ([`feedback_screen.dart`](lib/views/feedback/feedback_screen.dart))
   - Star rating (1-5) and review comment submission triggered after order pickup.
9. **Notification Center** ([`notifications_screen.dart`](lib/views/notifications/notifications_screen.dart))
   - In-app notification center for order preparation, payment confirmation, and discounts.
10. **Profile Screen** ([`profile_screen.dart`](lib/views/profile/profile_screen.dart))
    - Student ID, saved payment methods display, and sign-out controls.

---

## 🛠️ Project Structure

```text
mobile-app/
├── lib/
│   ├── config/             # Theme tokens, colors, constants
│   ├── models/             # MenuItemModel, CartItemModel, OrderModel
│   ├── providers/          # AuthProvider, MenuProvider, CartProvider, OrderProvider
│   ├── views/              # 10 Screen modules (auth, home, menu, cart, tracking, history, loyalty, feedback, notifications, profile)
│   └── main.dart           # App root, MultiProvider, MaterialTheme
├── pubspec.yaml
└── README.md
```

---

## 🚀 Running the App

```bash
cd mobile-app
flutter pub get
flutter run
```
