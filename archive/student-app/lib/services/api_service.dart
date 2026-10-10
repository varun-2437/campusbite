import '../models/user_model.dart';
import '../models/menu_item.dart';
import '../models/order_model.dart';
import '../models/coupon_model.dart';
import 'mock_data.dart';

class ApiService {
  // Singleton pattern
  static final ApiService _instance = ApiService._internal();
  factory ApiService() => _instance;
  ApiService._internal();

  // Simulates network latency
  Future<void> _delay([int ms = 400]) => Future.delayed(Duration(milliseconds: ms));

  // --- Auth Endpoints ---
  Future<UserModel> login(String email, String password) async {
    await _delay();
    if (email.isEmpty || password.isEmpty) {
      throw Exception('Please enter both email and password.');
    }
    // Return student user
    return UserModel(
      userId: 'usr_krithik_101',
      name: 'Krithik J Y',
      email: email,
      studentId: 'CB-2026-CS104',
      loyaltyPoints: 120,
      role: 'student',
      isGuest: false,
    );
  }

  Future<UserModel> register({
    required String name,
    required String studentId,
    required String email,
    required String password,
  }) async {
    await _delay();
    if (!email.contains('@')) {
      throw Exception('Invalid college email address.');
    }
    return UserModel(
      userId: 'usr_${DateTime.now().millisecondsSinceEpoch}',
      name: name,
      email: email,
      studentId: studentId,
      loyaltyPoints: 50, // Welcome bonus
      role: 'student',
      isGuest: false,
    );
  }

  Future<UserModel> startGuestSession() async {
    await _delay(200);
    return UserModel.guest();
  }

  // --- Menu Endpoints ---
  Future<List<MenuItem>> fetchMenu({String? category, bool? isVegOnly}) async {
    await _delay(300);
    var list = List<MenuItem>.from(MockData.menuItems);
    if (category != null && category != 'All') {
      list = list.where((item) => item.category.toLowerCase() == category.toLowerCase()).toList();
    }
    if (isVegOnly == true) {
      list = list.where((item) => item.isVeg).toList();
    }
    return list;
  }

  // --- Coupon Endpoints ---
  Future<CouponModel?> validateCoupon(String code, double subtotal) async {
    await _delay(250);
    final match = MockData.coupons.firstWhere(
      (c) => c.code.toUpperCase() == code.trim().toUpperCase(),
      orElse: () => throw Exception('Invalid coupon code: $code'),
    );

    if (subtotal < match.minOrderAmount) {
      throw Exception('Minimum order amount for this coupon is ₹${match.minOrderAmount.toInt()}');
    }

    return match;
  }

  // --- Order Endpoints ---
  Future<OrderModel> placeOrder(OrderModel order) async {
    await _delay(500);
    return order;
  }

  Future<List<OrderModel>> fetchOrderHistory(String studentId) async {
    await _delay(400);
    return MockData.getSamplePastOrders(studentId);
  }

  // --- Feedback ---
  Future<bool> submitFeedback({
    required String orderId,
    required double rating,
    required String comment,
    List<String>? tags,
  }) async {
    await _delay(300);
    return true;
  }
}
