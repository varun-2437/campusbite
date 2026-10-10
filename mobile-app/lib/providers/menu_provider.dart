import 'package:flutter/foundation.dart';
import '../models/models.dart';

class MenuProvider with ChangeNotifier {
  final List<MenuItemModel> _items = [
    MenuItemModel(
      itemId: 'm1',
      name: 'Paneer Butter Masala Roll',
      price: 90.0,
      category: 'Lunch',
      isAvailable: true,
      prepTime: 8,
      isVeg: true,
      imageUrl: '',
    ),
    MenuItemModel(
      itemId: 'm2',
      name: 'Chicken Crispy Burger',
      price: 120.0,
      category: 'Snacks',
      isAvailable: true,
      prepTime: 12,
      isVeg: false,
      imageUrl: '',
    ),
    MenuItemModel(
      itemId: 'm3',
      name: 'Veg Schezwan Fried Rice',
      price: 80.0,
      category: 'Lunch',
      isAvailable: true,
      prepTime: 10,
      isVeg: true,
      imageUrl: '',
    ),
    MenuItemModel(
      itemId: 'm4',
      name: 'Egg Maggi with Cheese',
      price: 65.0,
      category: 'Breakfast',
      isAvailable: true,
      prepTime: 6,
      isVeg: false,
      imageUrl: '',
    ),
    MenuItemModel(
      itemId: 'm5',
      name: 'Peri Peri French Fries',
      price: 60.0,
      category: 'Snacks',
      isAvailable: true,
      prepTime: 5,
      isVeg: true,
      imageUrl: '',
    ),
    MenuItemModel(
      itemId: 'm6',
      name: 'Fresh Mango Juice',
      price: 50.0,
      category: 'Beverages',
      isAvailable: true,
      prepTime: 4,
      isVeg: true,
      imageUrl: '',
    ),
    MenuItemModel(
      itemId: 'm7',
      name: 'Oreo Chocolate Thick Shake',
      price: 75.0,
      category: 'Beverages',
      isAvailable: true,
      prepTime: 5,
      isVeg: true,
      imageUrl: '',
    ),
    MenuItemModel(
      itemId: 'm8',
      name: 'Iced Cold Coffee',
      price: 55.0,
      category: 'Beverages',
      isAvailable: true,
      prepTime: 3,
      isVeg: true,
      imageUrl: '',
    ),
  ];

  String _selectedCategory = 'All';
  bool _vegOnly = false;
  String _searchQuery = '';

  List<MenuItemModel> get items {
    return _items.where((item) {
      final matchesCategory = _selectedCategory == 'All' || item.category == _selectedCategory;
      final matchesVeg = !_vegOnly || item.isVeg;
      final matchesSearch = _searchQuery.isEmpty ||
          item.name.toLowerCase().contains(_searchQuery.toLowerCase());
      return matchesCategory && matchesVeg && matchesSearch;
    }).toList();
  }

  String get selectedCategory => _selectedCategory;
  bool get vegOnly => _vegOnly;

  void setCategory(String cat) {
    _selectedCategory = cat;
    notifyListeners();
  }

  void toggleVegOnly() {
    _vegOnly = !_vegOnly;
    notifyListeners();
  }

  void setSearchQuery(String q) {
    _searchQuery = q;
    notifyListeners();
  }
}
