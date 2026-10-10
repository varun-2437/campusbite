class MenuItemCustomization {
  final String id;
  final String name;
  final double extraPrice;

  const MenuItemCustomization({
    required this.id,
    required this.name,
    required this.extraPrice,
  });

  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'extraPrice': extraPrice,
  };

  factory MenuItemCustomization.fromJson(Map<String, dynamic> json) => MenuItemCustomization(
    id: json['id'] ?? '',
    name: json['name'] ?? '',
    extraPrice: (json['extraPrice'] ?? 0).toDouble(),
  );
}

class MenuItem {
  final String itemId;
  final String name;
  final double price;
  final String category; // Breakfast, Lunch, Snacks, Beverages
  final bool isAvailable;
  final int prepTime; // in minutes
  final bool isVeg;
  final String imageUrl;
  final String description;
  final double rating;
  final bool isSpecial;
  final List<MenuItemCustomization> customizations;

  const MenuItem({
    required this.itemId,
    required this.name,
    required this.price,
    required this.category,
    this.isAvailable = true,
    required this.prepTime,
    required this.isVeg,
    required this.imageUrl,
    this.description = '',
    this.rating = 4.5,
    this.isSpecial = false,
    this.customizations = const [],
  });

  MenuItem copyWith({
    String? itemId,
    String? name,
    double? price,
    String? category,
    bool? isAvailable,
    int? prepTime,
    bool? isVeg,
    String? imageUrl,
    String? description,
    double? rating,
    bool? isSpecial,
    List<MenuItemCustomization>? customizations,
  }) {
    return MenuItem(
      itemId: itemId ?? this.itemId,
      name: name ?? this.name,
      price: price ?? this.price,
      category: category ?? this.category,
      isAvailable: isAvailable ?? this.isAvailable,
      prepTime: prepTime ?? this.prepTime,
      isVeg: isVeg ?? this.isVeg,
      imageUrl: imageUrl ?? this.imageUrl,
      description: description ?? this.description,
      rating: rating ?? this.rating,
      isSpecial: isSpecial ?? this.isSpecial,
      customizations: customizations ?? this.customizations,
    );
  }

  factory MenuItem.fromJson(Map<String, dynamic> json) {
    return MenuItem(
      itemId: json['itemId'] ?? '',
      name: json['name'] ?? '',
      price: (json['price'] ?? 0).toDouble(),
      category: json['category'] ?? 'Snacks',
      isAvailable: json['isAvailable'] ?? true,
      prepTime: json['prepTime'] ?? 10,
      isVeg: json['isVeg'] ?? true,
      imageUrl: json['imageUrl'] ?? '',
      description: json['description'] ?? '',
      rating: (json['rating'] ?? 4.5).toDouble(),
      isSpecial: json['isSpecial'] ?? false,
      customizations: (json['customizations'] as List? ?? [])
          .map((c) => MenuItemCustomization.fromJson(c))
          .toList(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'itemId': itemId,
      'name': name,
      'price': price,
      'category': category,
      'isAvailable': isAvailable,
      'prepTime': prepTime,
      'isVeg': isVeg,
      'imageUrl': imageUrl,
      'description': description,
      'rating': rating,
      'isSpecial': isSpecial,
      'customizations': customizations.map((c) => c.toJson()).toList(),
    };
  }
}
