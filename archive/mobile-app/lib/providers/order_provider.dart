import 'package:flutter/foundation.dart';
import '../models/models.dart';

class OrderProvider with ChangeNotifier {
  final List<OrderModel> _orders = [
    OrderModel(
      orderId: 'ORD-101',
      tokenNumber: 'TK-101',
      customerName: 'Krithik (Student)',
      items: [
        {'name': 'Chicken Crispy Burger', 'quantity': 1, 'price': 120.0},
        {'name': 'Egg Maggi with Cheese', 'quantity': 1, 'price': 65.0}
      ],
      totalAmount: 185.0,
      status: 'Preparing',
      paymentMethod: 'Online',
      paymentStatus: 'Paid',
      createdAt: DateTime.now().subtract(const Duration(minutes: 12)),
      specialInstructions: 'Less spicy',
    ),
    OrderModel(
      orderId: 'ORD-092',
      tokenNumber: 'TK-092',
      customerName: 'Krithik (Student)',
      items: [
        {'name': 'Paneer Butter Masala Roll', 'quantity': 1, 'price': 90.0}
      ],
      totalAmount: 90.0,
      status: 'Collected',
      paymentMethod: 'Online',
      paymentStatus: 'Paid',
      createdAt: DateTime.now().subtract(const Duration(days: 1)),
    ),
  ];

  List<OrderModel> get orders => [..._orders];

  OrderModel? get activeOrder {
    try {
      return _orders.firstWhere(
        (o) => o.status == 'Pending' || o.status == 'Preparing' || o.status == 'Ready',
      );
    } catch (_) {
      return null;
    }
  }

  OrderModel createOrder({
    required List<CartItemModel> cartItems,
    required double totalAmount,
    required String paymentMethod,
    required String customerName,
    String specialInstructions = '',
  }) {
    final nextNum = 100 + _orders.length + 1;
    final newOrder = OrderModel(
      orderId: 'ORD-${DateTime.now().millisecondsSinceEpoch.toString().substring(8)}',
      tokenNumber: 'TK-$nextNum',
      customerName: customerName,
      items: cartItems.map((c) => c.toJson()).toList(),
      totalAmount: totalAmount,
      status: 'Pending',
      paymentMethod: paymentMethod,
      paymentStatus: paymentMethod == 'Online' ? 'Paid' : 'Pending',
      createdAt: DateTime.now(),
      specialInstructions: specialInstructions,
    );

    _orders.insert(0, newOrder);
    notifyListeners();
    return newOrder;
  }

  void updateOrderStatus(String orderId, String newStatus) {
    final index = _orders.indexWhere((o) => o.orderId == orderId);
    if (index != -1) {
      final old = _orders[index];
      _orders[index] = OrderModel(
        orderId: old.orderId,
        tokenNumber: old.tokenNumber,
        customerName: old.customerName,
        items: old.items,
        totalAmount: old.totalAmount,
        status: newStatus,
        paymentMethod: old.paymentMethod,
        paymentStatus: old.paymentStatus,
        createdAt: old.createdAt,
        specialInstructions: old.specialInstructions,
      );
      notifyListeners();
    }
  }
}
