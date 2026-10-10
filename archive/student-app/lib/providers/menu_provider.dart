import 'package:flutter/foundation.dart';
import '../models/menu_item.dart';
import '../services/mock_data.dart';

class MenuProvider extends ChangeNotifier {
  List<MenuItem> _items = [];
  String _selectedCategory = 'All';
  String _searchQuery = '';
  bool _isVegOnly = false;
  bool _isLoading = false;

  MenuProvider() {
    _loadInitialMenu();
  }

  List<MenuItem> get items => _items;
  String get selectedCategory => _selectedCategory;
  String get searchQuery => _searchQuery;
  bool get isVegOnly => _isVegOnly;
  bool get isLoading => _isLoading;

  void _loadInitialMenu() {
    _items = List.from(MockData.menuItems);
    notifyListeners();
  }

  void setCategory(String category) {
    _selectedCategory = category;
    notifyListeners();
  }

  void setSearchQuery(String query) {
    _searchQuery = query;
    notifyListeners();
  }

  void toggleVegOnly(bool value) {
    _isVegOnly = value;
    notifyListeners();
  }

  List<MenuItem> get filteredItems {
    return _items.where((item) {
      final matchesCategory = _selectedCategory == 'All' ||
          item.category.toLowerCase() == _selectedCategory.toLowerCase();
      final matchesSearch = _searchQuery.isEmpty ||
          item.name.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          item.description.toLowerCase().contains(_searchQuery.toLowerCase());
      final matchesVeg = !_isVegOnly || item.isVeg;
      return matchesCategory && matchesSearch && matchesVeg;
    }).toList();
  }

  List<MenuItem> get specials {
    return _items.where((item) => item.isSpecial).toList();
  }

  MenuItem? getItemById(String id) {
    try {
      return _items.firstWhere((item) => item.itemId == id);
    } catch (_) {
      return null;
    }
  }
}
