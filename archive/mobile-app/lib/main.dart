import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'config/constants.dart';
import 'providers/auth_provider.dart';
import 'providers/menu_provider.dart';
import 'providers/cart_provider.dart';
import 'providers/order_provider.dart';

// Screens
import 'views/auth/onboarding_screen.dart';
import 'views/auth/login_screen.dart';
import 'views/auth/register_screen.dart';
import 'views/main_navigation_wrapper.dart';
import 'views/tracking/order_tracking_screen.dart';
import 'views/history/order_history_screen.dart';
import 'views/loyalty/loyalty_screen.dart';
import 'views/feedback/feedback_screen.dart';
import 'views/notifications/notifications_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const CampusBiteApp());
}

class CampusBiteApp extends StatelessWidget {
  const CampusBiteApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => MenuProvider()),
        ChangeNotifierProvider(create: (_) => CartProvider()),
        ChangeNotifierProvider(create: (_) => OrderProvider()),
      ],
      child: MaterialApp(
        title: 'CampusBite Student',
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
          brightness: Brightness.dark,
          primaryColor: AppColors.primary,
          scaffoldBackgroundColor: AppColors.background,
          fontFamily: 'Roboto',
        ),
        initialRoute: '/',
        routes: {
          '/': (context) => const OnboardingScreen(),
          '/login': (context) => const LoginScreen(),
          '/register': (context) => const RegisterScreen(),
          '/main': (context) => const MainNavigationWrapper(),
          '/tracking': (context) => const OrderTrackingScreen(),
          '/history': (context) => const OrderHistoryScreen(),
          '/loyalty': (context) => const LoyaltyScreen(),
          '/feedback': (context) => const FeedbackScreen(),
          '/notifications': (context) => const NotificationsScreen(),
        },
      ),
    );
  }
}
