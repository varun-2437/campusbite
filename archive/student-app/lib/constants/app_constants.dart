class AppConstants {
  static const String appName = 'CampusBite';
  static const String appTagline = 'Smart Food Ordering for Smart Campuses';
  
  // API base url
  static const String apiBaseUrl = 'http://localhost:5000/api';
  static const String socketUrl = 'http://localhost:5000';

  // Categories
  static const List<String> categories = [
    'All',
    'Breakfast',
    'Lunch',
    'Snacks',
    'Beverages',
  ];

  // Loyalty calculation
  static const int loyaltyPointsPerHundred = 10;
  static const double loyaltyPointValue = 1.0; // 1 point = ₹1
}
