import 'menu_item.dart';

class CartItem {
  final String id;
  final MenuItem menuItem;
  int quantity;
  final List<MenuItemCustomization> selectedCustomizations;
  final String specialInstructions;

  CartItem({
    required this.id,
    required this.menuItem,
    this.quantity = 1,
    this.selectedCustomizations = const [],
    this.specialInstructions = '',
  });

  double get unitPrice {
    double base = menuItem.price;
    for (final c in selectedCustomizations) {
      base += c.extraPrice;
    }
    return base;
  }

  double get totalPrice => unitPrice * quantity;

  CartItem copyWith({
    String? id,
    MenuItem? menuItem,
    int? quantity,
    List<MenuItemCustomization>? selectedCustomizations,
    String? specialInstructions,
  }) {
    return CartItem(
      id: id ?? this.id,
      menuItem: menuItem ?? this.menuItem,
      quantity: quantity ?? this.quantity,
      selectedCustomizations: selectedCustomizations ?? this.selectedCustomizations,
      specialInstructions: specialInstructions ?? this.specialInstructions,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'itemId': menuItem.itemId,
      'name': menuItem.name,
      'quantity': quantity,
      'price': unitPrice,
      'total': totalPrice,
      'customizations': selectedCustomizations.map((c) => c.name).toList(),
      'specialInstructions': specialInstructions,
    };
  }
}
