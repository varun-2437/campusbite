import 'package:flutter/foundation.dart';
import '../models/models.dart';

class MenuProvider with ChangeNotifier {
  final List<MenuItemModel> _items = [
    // --- TODAY'S SPECIAL ---
    MenuItemModel(
      itemId: 'sp1',
      name: 'Chef Special Hyderabadi Dum Biryani',
      price: 160.0,
      category: 'Today Spcl',
      isAvailable: true,
      prepTime: 12,
      isVeg: false,
      imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=80',
    ),
    MenuItemModel(
      itemId: 'sp2',
      name: 'Paneer Tikka Stuffed Kulcha',
      price: 110.0,
      category: 'Today Spcl',
      isAvailable: true,
      prepTime: 10,
      isVeg: true,
      imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&auto=format&fit=crop&q=80',
    ),
    MenuItemModel(
      itemId: 'sp3',
      name: 'Crispy Dragon Chicken Wings',
      price: 140.0,
      category: 'Today Spcl',
      isAvailable: true,
      prepTime: 12,
      isVeg: false,
      imageUrl: 'https://images.unsplash.com/photo-1527477378392-1c0dc635c0fa?w=500&auto=format&fit=crop&q=80',
    ),

    // --- MAIN COURSE ---
    MenuItemModel(
      itemId: 'mc1',
      name: 'Veg Schezwan Fried Rice',
      price: 95.0,
      category: 'Main Course',
      isAvailable: true,
      prepTime: 10,
      isVeg: true,
      imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500&auto=format&fit=crop&q=80',
    ),
    MenuItemModel(
      itemId: 'mc2',
      name: 'Egg Hakka Noodles',
      price: 85.0,
      category: 'Main Course',
      isAvailable: true,
      prepTime: 8,
      isVeg: false,
      imageUrl: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500&auto=format&fit=crop&q=80',
    ),
    MenuItemModel(
      itemId: 'mc3',
      name: 'Chicken Fried Rice with Chilli Garlic',
      price: 120.0,
      category: 'Main Course',
      isAvailable: true,
      prepTime: 12,
      isVeg: false,
      imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&auto=format&fit=crop&q=80',
    ),
    MenuItemModel(
      itemId: 'mc4',
      name: 'South Indian Mini Meals (Rice + Sambar)',
      price: 75.0,
      category: 'Main Course',
      isAvailable: true,
      prepTime: 5,
      isVeg: true,
      imageUrl: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=500&auto=format&fit=crop&q=80',
    ),

    // --- CURRIES ---
    MenuItemModel(
      itemId: 'cr1',
      name: 'Paneer Butter Masala',
      price: 110.0,
      category: 'Curries',
      isAvailable: true,
      prepTime: 10,
      isVeg: true,
      imageUrl: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&auto=format&fit=crop&q=80',
    ),
    MenuItemModel(
      itemId: 'cr2',
      name: 'Chicken Chettinad Curry',
      price: 135.0,
      category: 'Curries',
      isAvailable: true,
      prepTime: 12,
      isVeg: false,
      imageUrl: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=500&auto=format&fit=crop&q=80',
    ),
    MenuItemModel(
      itemId: 'cr3',
      name: 'Dal Tadka Special',
      price: 70.0,
      category: 'Curries',
      isAvailable: true,
      prepTime: 6,
      isVeg: true,
      imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=80',
    ),

    // --- HOT DRINKS ---
    MenuItemModel(
      itemId: 'hd1',
      name: 'South Indian Filter Coffee',
      price: 25.0,
      category: 'Hot Drinks',
      isAvailable: true,
      prepTime: 3,
      isVeg: true,
      imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop&q=80',
    ),
    MenuItemModel(
      itemId: 'hd2',
      name: 'Masala Chai (Ginger & Cardamom)',
      price: 20.0,
      category: 'Hot Drinks',
      isAvailable: true,
      prepTime: 3,
      isVeg: true,
      imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop&q=80',
    ),
    MenuItemModel(
      itemId: 'hd3',
      name: 'Hot Belgian Chocolate Drink',
      price: 55.0,
      category: 'Hot Drinks',
      isAvailable: true,
      prepTime: 4,
      isVeg: true,
      imageUrl: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=500&auto=format&fit=crop&q=80',
    ),

    // --- CHOCOLATES ---
    MenuItemModel(
      itemId: 'ch1',
      name: 'Ferrero Rocher Deluxe Cone',
      price: 65.0,
      category: 'Chocolates',
      isAvailable: true,
      prepTime: 1,
      isVeg: true,
      imageUrl: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=500&auto=format&fit=crop&q=80',
    ),
    MenuItemModel(
      itemId: 'ch2',
      name: 'Cadbury Dairy Milk Silk (Roast Almond)',
      price: 80.0,
      category: 'Chocolates',
      isAvailable: true,
      prepTime: 1,
      isVeg: true,
      imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&auto=format&fit=crop&q=80',
    ),
    MenuItemModel(
      itemId: 'ch3',
      name: 'KitKat 4-Finger Dark Chocolate',
      price: 40.0,
      category: 'Chocolates',
      isAvailable: true,
      prepTime: 1,
      isVeg: true,
      imageUrl: 'https://images.unsplash.com/photo-1582293041079-7814c2f12063?w=500&auto=format&fit=crop&q=80',
    ),

    // --- ICE CREAMS ---
    MenuItemModel(
      itemId: 'ic1',
      name: 'Choco Nut Sundae with Hot Fudge',
      price: 75.0,
      category: 'Ice Creams',
      isAvailable: true,
      prepTime: 4,
      isVeg: true,
      imageUrl: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&auto=format&fit=crop&q=80',
    ),
    MenuItemModel(
      itemId: 'ic2',
      name: 'Spanish Delight Double Scoop',
      price: 60.0,
      category: 'Ice Creams',
      isAvailable: true,
      prepTime: 3,
      isVeg: true,
      imageUrl: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=500&auto=format&fit=crop&q=80',
    ),
    MenuItemModel(
      itemId: 'ic3',
      name: 'Classic Vanilla with Chocolate Dip',
      price: 35.0,
      category: 'Ice Creams',
      isAvailable: true,
      prepTime: 2,
      isVeg: true,
      imageUrl: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=500&auto=format&fit=crop&q=80',
    ),

    // --- DESSERTS ---
    MenuItemModel(
      itemId: 'ds1',
      name: 'Hot Sizzling Brownie with Ice Cream',
      price: 95.0,
      category: 'Desserts',
      isAvailable: true,
      prepTime: 5,
      isVeg: true,
      imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&auto=format&fit=crop&q=80',
    ),
    MenuItemModel(
      itemId: 'ds2',
      name: 'Gulab Jamun with Rabdi (2 Pcs)',
      price: 50.0,
      category: 'Desserts',
      isAvailable: true,
      prepTime: 3,
      isVeg: true,
      imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop&q=80',
    ),
    MenuItemModel(
      itemId: 'ds3',
      name: 'Lotus Biscoff Cheesecake Jar',
      price: 110.0,
      category: 'Desserts',
      isAvailable: true,
      prepTime: 3,
      isVeg: true,
      imageUrl: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=500&auto=format&fit=crop&q=80',
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
