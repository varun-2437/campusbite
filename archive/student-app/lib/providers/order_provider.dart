import 'dart:math';
import 'package:flutter/foundation.dart';
import '../models/order_model.dart';
import '../models/cart_item.dart';
import '../models/user_model.dart';
import '../services/socket_service.dart';
import '../services/mock_data.dart';

class OrderProvider extends ChangeNotifier {
  OrderModel? _activeOrder;
  final List<OrderModel> _pastOrders = [];
  final SocketService _socketService = SocketService();

  OrderModel? get activeOrder => _activeOrder;
  List<OrderModel> get pastOrders => _pastOrders;

  OrderProvider() {
    _initSocketListener();
  }

  void initOrdersForUser(UserModel? user) {
    if (user != null && !user.isGuest) {
      if (_pastOrders.isEmpty) {
        _pastOrders.addAll(MockData.getSamplePastOrders(user.studentId ?? 'STUDENT'));
        notifyListeners();
      }
    }
  }

  void _initSocketListener() {
    _socketService.addListener((orderId, newStatus) {
      if (_activeOrder != null && _activeOrder!.orderId == orderId) {
        _activeOrder = _activeOrder!.copyWith(status: newStatus);

        if (newStatus == OrderStatus.collected) {
          // Move from active to history
          _pastOrders.insert(0, _activeOrder!);
          // Keep active order for feedback prompt, or nullify after feedback
        }
        notifyListeners();
      }
    });
  }

  Future<OrderModel> createOrder({
    required List<CartItem> items,
    required UserModel? user,
    required String paymentMethod,
    required double subtotal,
    required double discount,
    required double totalAmount,
  }) async {
    final randomNum = 1000 + Random().nextInt(9000);
    final orderId = 'CB-$randomNum';
    final tokenNumber = 100 + Random().nextInt(900);
    final tokenId = 'T-$tokenNumber';
    final qrCode = '$orderId-$tokenId';

    final order = OrderModel(
      orderId: orderId,
      studentId: user?.studentId,
      guestSessionId: user?.guestSessionId,
      items: List.from(items),
      status: OrderStatus.pending,
      createdAt: DateTime.now(),
      subtotal: subtotal,
      discount: discount,
      totalAmount: totalAmount,
      paymentMethod: paymentMethod,
      paymentStatus: paymentMethod == 'Online' ? 'Paid' : 'Pending',
      tokenId: tokenId,
      qrCode: qrCode,
      estimatedReadyMinutes: 12,
    );

    _activeOrder = order;
    notifyListeners();

    // Trigger simulated socket lifecycle progression
    _socketService.simulateOrderLifecycle(orderId, stepSeconds: 7);

    return order;
  }

  void updateOrderStatus(String orderId, OrderStatus newStatus) {
    if (_activeOrder != null && _activeOrder!.orderId == orderId) {
      _activeOrder = _activeOrder!.copyWith(status: newStatus);
      if (newStatus == OrderStatus.collected) {
        _pastOrders.insert(0, _activeOrder!);
      }
      notifyListeners();
    }
  }

  void submitOrderReview({
    required String orderId,
    required double rating,
    required String comment,
  }) {
    if (_activeOrder != null && _activeOrder!.orderId == orderId) {
      _activeOrder = _activeOrder!.copyWith(
        isReviewed: true,
        rating: rating,
        reviewComment: comment,
      );
    }

    final index = _pastOrders.indexWhere((o) => o.orderId == orderId);
    if (index != -1) {
      _pastOrders[index] = _pastOrders[index].copyWith(
        isReviewed: true,
        rating: rating,
        reviewComment: comment,
      );
    }
    notifyListeners();
  }

  void clearActiveOrder() {
    _activeOrder = null;
    notifyListeners();
  }

  @override
  void dispose() {
    _socketService.cancelSimulation();
    super.dispose();
  }
}
