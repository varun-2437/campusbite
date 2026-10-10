import 'package:flutter/foundation.dart';
import '../models/models.dart';

class CartProvider with ChangeNotifier {
  final Map<String, CartItemModel> _items = {};
  String? _couponCode;
  double _discountAmount = 0.0;

  Map<String, CartItemModel> get items => {..._items};
  int get itemCount => _items.values.fold(0, (sum, i) => sum + i.quantity);

  double get subtotal => _items.values.fold(0.0, (sum, i) => sum + i.totalPrice);
  double get discountAmount => _discountAmount;
  double get totalAmount => (subtotal - _discountAmount).clamp(0.0, double.infinity);
  String? get couponCode => _couponCode;

  void addItem(MenuItemModel item, {int quantity = 1, String customization = ''}) {
    if (_items.containsKey(item.itemId)) {
      _items[item.itemId]!.quantity += quantity;
      if (customization.isNotEmpty) {
        _items[item.itemId]!.customization = customization;
      }
    } else {
      _items[item.itemId] = CartItemModel(
        item: item,
        quantity: quantity,
        customization: customization,
      );
    }
    notifyListeners();
  }

  void updateQuantity(String itemId, int delta) {
    if (!_items.containsKey(itemId)) return;

    final newQty = _items[itemId]!.quantity + delta;
    if (newQty > 0) {
      _items[itemId]!.quantity = newQty;
    } else {
      _items.remove(itemId);
    }
    notifyListeners();
  }

  void removeItem(String itemId) {
    _items.remove(itemId);
    notifyListeners();
  }

  bool applyCoupon(String code) {
    final clean = code.trim().toUpperCase();
    if (clean == 'CAMPUS20' && subtotal >= 100) {
      _couponCode = clean;
      _discountAmount = 20.0;
      notifyListeners();
      return true;
    } else if (clean == 'WELCOME50' && subtotal >= 150) {
      _couponCode = clean;
      _discountAmount = 50.0;
      notifyListeners();
      return true;
    }
    return false;
  }

  void removeCoupon() {
    _couponCode = null;
    _discountAmount = 0.0;
    notifyListeners();
  }

  void clearCart() {
    _items.clear();
    _couponCode = null;
    _discountAmount = 0.0;
    notifyListeners();
  }
}
