import 'package:flutter/foundation.dart';
import '../models/cart_item.dart';
import '../models/menu_item.dart';
import '../models/coupon_model.dart';
import '../services/api_service.dart';

class CartProvider extends ChangeNotifier {
  final ApiService _apiService = ApiService();
  final List<CartItem> _items = [];
  CouponModel? _appliedCoupon;
  String? _couponError;
  bool _isValidatingCoupon = false;

  List<CartItem> get items => _items;
  CouponModel? get appliedCoupon => _appliedCoupon;
  String? get couponError => _couponError;
  bool get isValidatingCoupon => _isValidatingCoupon;

  int get itemCount => _items.fold(0, (sum, item) => sum + item.quantity);

  double get subtotal => _items.fold(0.0, (sum, item) => sum + item.totalPrice);

  double get discountAmount {
    if (_appliedCoupon == null) return 0.0;
    return _appliedCoupon!.calculateDiscount(subtotal);
  }

  double get finalAmount {
    final net = subtotal - discountAmount;
    return net > 0 ? net : 0.0;
  }

  void addToCart(
    MenuItem menuItem, {
    int quantity = 1,
    List<MenuItemCustomization> customizations = const [],
    String specialInstructions = '',
  }) {
    // Generate unique composite key based on customizations
    final custKey = customizations.map((c) => c.id).join('_');
    final existingIndex = _items.indexWhere(
      (item) =>
          item.menuItem.itemId == menuItem.itemId &&
          item.selectedCustomizations.map((c) => c.id).join('_') == custKey &&
          item.specialInstructions == specialInstructions,
    );

    if (existingIndex != -1) {
      _items[existingIndex].quantity += quantity;
    } else {
      _items.add(
        CartItem(
          id: 'cart_${DateTime.now().millisecondsSinceEpoch}_${_items.length}',
          menuItem: menuItem,
          quantity: quantity,
          selectedCustomizations: customizations,
          specialInstructions: specialInstructions,
        ),
      );
    }
    notifyListeners();
  }

  void updateQuantity(String cartItemId, int newQty) {
    final index = _items.indexWhere((item) => item.id == cartItemId);
    if (index != -1) {
      if (newQty <= 0) {
        _items.removeAt(index);
      } else {
        _items[index].quantity = newQty;
      }
      _revalidateCoupon();
      notifyListeners();
    }
  }

  void removeItem(String cartItemId) {
    _items.removeWhere((item) => item.id == cartItemId);
    _revalidateCoupon();
    notifyListeners();
  }

  void clearCart() {
    _items.clear();
    _appliedCoupon = null;
    _couponError = null;
    notifyListeners();
  }

  Future<bool> applyCoupon(String code) async {
    _isValidatingCoupon = true;
    _couponError = null;
    notifyListeners();

    try {
      final coupon = await _apiService.validateCoupon(code, subtotal);
      _appliedCoupon = coupon;
      _isValidatingCoupon = false;
      notifyListeners();
      return true;
    } catch (e) {
      _couponError = e.toString().replaceAll('Exception: ', '');
      _appliedCoupon = null;
      _isValidatingCoupon = false;
      notifyListeners();
      return false;
    }
  }

  void removeCoupon() {
    _appliedCoupon = null;
    _couponError = null;
    notifyListeners();
  }

  void _revalidateCoupon() {
    if (_appliedCoupon != null && subtotal < _appliedCoupon!.minOrderAmount) {
      _appliedCoupon = null;
      _couponError = 'Coupon removed: Cart below min order requirement';
    }
  }

  void reorder(List<CartItem> previousItems) {
    _items.clear();
    for (final item in previousItems) {
      _items.add(item.copyWith(
        id: 'cart_${DateTime.now().millisecondsSinceEpoch}_${_items.length}',
      ));
    }
    notifyListeners();
  }
}
