class MenuItemModel {
  final String itemId;
  final String name;
  final double price;
  final String category;
  final bool isAvailable;
  final int prepTime;
  final bool isVeg;
  final String imageUrl;

  MenuItemModel({
    required this.itemId,
    required this.name,
    required this.price,
    required this.category,
    required this.isAvailable,
    required this.prepTime,
    required this.isVeg,
    required this.imageUrl,
  });

  factory MenuItemModel.fromJson(Map<String, dynamic> json) {
    return MenuItemModel(
      itemId: json['itemId'] ?? json['_id'] ?? '',
      name: json['name'] ?? '',
      price: (json['price'] as num?)?.toDouble() ?? 0.0,
      category: json['category'] ?? 'Food',
      isAvailable: json['isAvailable'] ?? true,
      prepTime: json['prepTime'] ?? 10,
      isVeg: json['isVeg'] ?? true,
      imageUrl: json['imageUrl'] ?? '',
    );
  }
}

class CartItemModel {
  final MenuItemModel item;
  int quantity;
  String customization;

  CartItemModel({
    required this.item,
    this.quantity = 1,
    this.customization = '',
  });

  double get totalPrice => item.price * quantity;

  Map<String, dynamic> toJson() {
    return {
      'itemId': item.itemId,
      'name': item.name,
      'price': item.price,
      'quantity': quantity,
      'category': item.category,
      'customization': customization,
    };
  }
}

class OrderModel {
  final String orderId;
  final String tokenNumber;
  final String customerName;
  final List<dynamic> items;
  final double totalAmount;
  final String status;
  final String paymentMethod;
  final String paymentStatus;
  final DateTime createdAt;
  final String specialInstructions;

  OrderModel({
    required this.orderId,
    required this.tokenNumber,
    required this.customerName,
    required this.items,
    required this.totalAmount,
    required this.status,
    required this.paymentMethod,
    required this.paymentStatus,
    required this.createdAt,
    this.specialInstructions = '',
  });

  factory OrderModel.fromJson(Map<String, dynamic> json) {
    return OrderModel(
      orderId: json['orderId'] ?? '',
      tokenNumber: json['tokenNumber'] ?? '',
      customerName: json['customerName'] ?? 'Student',
      items: json['items'] ?? [],
      totalAmount: (json['totalAmount'] as num?)?.toDouble() ?? 0.0,
      status: json['status'] ?? 'Pending',
      paymentMethod: json['paymentMethod'] ?? 'Cash',
      paymentStatus: json['paymentStatus'] ?? 'Pending',
      createdAt: json['createdAt'] != null
          ? DateTime.tryParse(json['createdAt']) ?? DateTime.now()
          : DateTime.now(),
      specialInstructions: json['specialInstructions'] ?? '',
    );
  }
}
