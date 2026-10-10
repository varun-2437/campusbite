import 'dart:async';
import '../models/order_model.dart';

typedef OrderStatusCallback = void Function(String orderId, OrderStatus newStatus);

class SocketService {
  static final SocketService _instance = SocketService._internal();
  factory SocketService() => _instance;
  SocketService._internal();

  final List<OrderStatusCallback> _listeners = [];
  Timer? _simulationTimer;

  void addListener(OrderStatusCallback callback) {
    _listeners.add(callback);
  }

  void removeListener(OrderStatusCallback callback) {
    _listeners.remove(callback);
  }

  void notifyListeners(String orderId, OrderStatus newStatus) {
    for (final listener in _listeners) {
      listener(orderId, newStatus);
    }
  }

  /// Start automatic live simulation for demonstration of Gokul/Varun's backend & kitchen status flow
  void simulateOrderLifecycle(String orderId, {int stepSeconds = 8}) {
    _simulationTimer?.cancel();
    
    // Step 1: Pending -> Preparing
    _simulationTimer = Timer(Duration(seconds: stepSeconds), () {
      notifyListeners(orderId, OrderStatus.preparing);
      
      // Step 2: Preparing -> Ready
      _simulationTimer = Timer(Duration(seconds: stepSeconds), () {
        notifyListeners(orderId, OrderStatus.ready);
      });
    });
  }

  void cancelSimulation() {
    _simulationTimer?.cancel();
  }
}
