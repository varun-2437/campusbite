# CampusBite - Student Mobile App (Flutter)

**Module Owner:** Krithik J Y  
**Role:** Student Mobile Application Lead  
**Tech Stack:** Flutter / Dart, Provider State Management, Material Design 3

---

## 📱 Feature Overview & Module Implementation

This Flutter mobile application covers all **10 modules** outlined in the **CampusBite Full Implementation Plan**:

| Module | Feature | Implementation Details | Key Files |
| :--- | :--- | :--- | :--- |
| **1. Onboarding & Auth** | Splash, Login, Register & Guest Mode | College email/ID format validation, password match verification, temporary guest session handling with top warning banner | `screens/splash_screen.dart`<br>`screens/auth/login_screen.dart`<br>`screens/auth/register_screen.dart`<br>`providers/auth_provider.dart` |
| **2. Home Dashboard** | Specials, Reorder & Active Tracking | Dynamic carousel for chef specials, 1-tap reorder for registered students, pinned active order status card | `screens/home/home_screen.dart`<br>`widgets/guest_banner.dart` |
| **3. Menu Browsing** | Categories, Filters & Customization | Breakfast/Lunch/Snacks/Beverages category pills, real-time search, veg/non-veg filter, customization modal (extra cheese, spice level, etc.) | `screens/menu/menu_screen.dart`<br>`widgets/item_card.dart`<br>`widgets/item_detail_sheet.dart`<br>`widgets/veg_badge.dart` |
| **4. Cart & Checkout** | Cart, Coupons & Multi-Payment | Cart quantity modifier, coupon code validation (`CAMPUS50`, `WELCOME10`), Razorpay SDK checkout integration and Cash on Counter workflow | `screens/cart/cart_screen.dart`<br>`screens/cart/order_success_screen.dart`<br>`services/razorpay_service.dart`<br>`providers/cart_provider.dart` |
| **5. Order Tracking** | Live Stepper, QR & Tokens | Visual 4-step stepper (`Confirmed` → `Preparing` → `Ready` → `Collected`), dynamic digital QR token generator, estimated wait countdown | `screens/tracking/order_tracking_screen.dart`<br>`widgets/order_status_stepper.dart`<br>`widgets/qr_code_widget.dart` |
| **6. Order History** | Past Invoices & Quick Reorder | Detailed past orders with item breakdown, reorder button to refill cart in 1-tap, guest lock banner | `screens/history/order_history_screen.dart` |
| **7. Loyalty & Rewards** | CampusBite Club & Points Store | Points card balance, coupon code redemption, point accrual history (10 pts per ₹100 spent) | `screens/loyalty/loyalty_screen.dart` |
| **8. Feedback & Rating** | 5-Star Food Review | Triggered upon order collection; star rating (1-5), complement chips, text feedback input | `screens/feedback/feedback_screen.dart` |
| **9. Notifications** | Alert Center & Push Receiver | Push notification handling (FCM structure), unread badge counters, live order status notifications | `screens/notifications/notification_center_screen.dart`<br>`providers/notification_provider.dart` |
| **10. Profile** | Student Info & Preferences | Edit profile modal, saved payment methods display, notification & sound toggles, logout modal | `screens/profile/profile_screen.dart` |

---

## 🏗️ Architecture & Folder Structure

```
student-app/
├── pubspec.yaml                 # Dependencies and asset declarations
├── analysis_options.yaml        # Lint rules
├── android/                     # Android build configuration & AndroidManifest
├── web/                         # Web launcher & manifest
└── lib/
    ├── main.dart                # Application entrypoint with MultiProvider setup
    ├── constants/
    │   ├── app_colors.dart      # Design tokens (Campus orange, teal, veg/non-veg)
    │   ├── app_constants.dart   # App configurations & categories
    │   └── app_theme.dart       # Material 3 typography & widget themes
    ├── models/
    │   ├── user_model.dart      # Student & Guest user model
    │   ├── menu_item.dart       # Menu item & customization models
    │   ├── cart_item.dart       # Cart item with calculated pricing
    │   ├── order_model.dart     # Order status lifecycle & tokens
    │   ├── coupon_model.dart    # Discount calculation logic
    │   └── notification_model.dart # In-app alerts & push payloads
    ├── providers/
    │   ├── auth_provider.dart   # Auth state & loyalty point balances
    │   ├── menu_provider.dart   # Menu filtering, category & search state
    │   ├── cart_provider.dart   # Cart state, item math & coupon validation
    │   ├── order_provider.dart  # Active order tracking & past history
    │   └── notification_provider.dart # Unread notifications management
    ├── services/
    │   ├── api_service.dart     # REST API connectors for Gokul's backend
    │   ├── socket_service.dart  # Socket.io live status event listener & simulator
    │   ├── razorpay_service.dart# Payment checkout handler for Padhmacharan's gateway
    │   └── mock_data.dart       # Pre-seeded campus menu items & coupons
    ├── widgets/
    │   ├── custom_button.dart   # Styled button with loading indicator
    │   ├── custom_text_field.dart # Form input with password visibility toggle
    │   ├── item_card.dart       # Menu item card with quick-add
    │   ├── item_detail_sheet.dart # Customization bottom sheet
    │   ├── order_status_stepper.dart # Visual status progression
    │   ├── qr_code_widget.dart  # Custom digital QR & token generator
    │   ├── veg_badge.dart       # Veg / Non-Veg indicator
    │   └── guest_banner.dart    # Guest sign-up banner
    └── screens/
        ├── splash_screen.dart
        ├── main_navigation_screen.dart
        ├── auth/
        ├── home/
        ├── menu/
        ├── cart/
        ├── tracking/
        ├── history/
        ├── loyalty/
        ├── feedback/
        ├── notifications/
        └── profile/
```

---

## 🔗 Integration Checkpoints

- **With Gokul M P (Backend & DB):**
  - `lib/services/api_service.dart` maps directly to Gokul's `/auth`, `/menu`, `/order`, `/coupon`, and `/feedback` REST endpoints.
- **With M Varun (Staff & Kitchen Dashboard):**
  - Real-time updates from Varun's kitchen staff changing order status (`Pending` → `Preparing` → `Ready` → `Collected`) reflect directly on Krithik's `OrderTrackingScreen` via `SocketService`.
- **With Padhmacharan M (Payments, QR & FCM):**
  - Online checkout calls Padhmacharan's Razorpay gateway in `lib/services/razorpay_service.dart`.
  - Cash payment generates temporary tokens which expire after 15 minutes unless verified at cashier.
  - In-app notification center receives Firebase Cloud Messaging pushes.

---

## 🚀 Running the Flutter App

When Flutter is installed on the machine:

```bash
cd student-app
flutter pub get
flutter run
```

To build a release APK for Android testing/demo:
```bash
flutter build apk --release
```
