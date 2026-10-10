import '../models/menu_item.dart';
import '../models/coupon_model.dart';
import '../models/notification_model.dart';
import '../models/cart_item.dart';
import '../models/order_model.dart';

class MockData {
  static final List<MenuItem> menuItems = [
    // Breakfast
    MenuItem(
      itemId: 'm_1',
      name: 'Masala Dosa with Sambar',
      price: 60.0,
      category: 'Breakfast',
      isAvailable: true,
      prepTime: 8,
      isVeg: true,
      isSpecial: true,
      rating: 4.8,
      description: 'Crispy golden crepe made from fermented batter, stuffed with spiced potato mash and served with coconut chutney & piping hot sambar.',
      imageUrl: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&auto=format&fit=crop&q=80',
      customizations: const [
        MenuItemCustomization(id: 'c1', name: 'Extra Ghee Roast', extraPrice: 15.0),
        MenuItemCustomization(id: 'c2', name: 'Add Podi / Gunpowder', extraPrice: 10.0),
        MenuItemCustomization(id: 'c3', name: 'Extra Coconut Chutney', extraPrice: 5.0),
      ],
    ),
    MenuItem(
      itemId: 'm_2',
      name: 'Idli Vada Combo',
      price: 50.0,
      category: 'Breakfast',
      isAvailable: true,
      prepTime: 5,
      isVeg: true,
      isSpecial: false,
      rating: 4.6,
      description: 'Two fluffy steamed rice cakes and one crispy medu vada served with freshly grated coconut chutney and home-style sambar.',
      imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80',
      customizations: const [
        MenuItemCustomization(id: 'c4', name: 'Extra Medu Vada (1pc)', extraPrice: 20.0),
        MenuItemCustomization(id: 'c5', name: 'Dunk in Sambar Bowl', extraPrice: 10.0),
      ],
    ),
    MenuItem(
      itemId: 'm_3',
      name: 'Egg Bhurji Pav',
      price: 65.0,
      category: 'Breakfast',
      isAvailable: true,
      prepTime: 7,
      isVeg: false,
      isSpecial: true,
      rating: 4.7,
      description: 'Spicy scrambled eggs tossed with onions, green chillies, coriander and Indian spices, served with two buttered toasted pavs.',
      imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&auto=format&fit=crop&q=80',
      customizations: const [
        MenuItemCustomization(id: 'c6', name: 'Extra Butter Pav (2pcs)', extraPrice: 20.0),
        MenuItemCustomization(id: 'c7', name: 'Add Grated Cheese', extraPrice: 20.0),
        MenuItemCustomization(id: 'c8', name: 'Extra Spicy Chilli', extraPrice: 0.0),
      ],
    ),

    // Lunch
    MenuItem(
      itemId: 'm_4',
      name: 'Paneer Butter Masala Thali',
      price: 130.0,
      category: 'Lunch',
      isAvailable: true,
      prepTime: 12,
      isVeg: true,
      isSpecial: true,
      rating: 4.9,
      description: 'Rich tomato cashew gravy with fresh cottage cheese cubes, served with 2 warm butter rotis, fragrant jeera rice, salad and pickle.',
      imageUrl: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop&q=80',
      customizations: const [
        MenuItemCustomization(id: 'c9', name: 'Extra Butter Roti (1pc)', extraPrice: 15.0),
        MenuItemCustomization(id: 'c10', name: 'Add Sweet Gulab Jamun', extraPrice: 25.0),
        MenuItemCustomization(id: 'c11', name: 'Add Spiced Boondi Raita', extraPrice: 20.0),
      ],
    ),
    MenuItem(
      itemId: 'm_5',
      name: 'Chicken Dum Biryani',
      price: 150.0,
      category: 'Lunch',
      isAvailable: true,
      prepTime: 10,
      isVeg: false,
      isSpecial: true,
      rating: 4.9,
      description: 'Slow-cooked aromatic basmati rice layered with tender marinated chicken pieces, whole spices, mint, and served with cucumber raita.',
      imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80',
      customizations: const [
        MenuItemCustomization(id: 'c12', name: 'Add Boiled Egg', extraPrice: 15.0),
        MenuItemCustomization(id: 'c13', name: 'Extra Mirchi ka Salan', extraPrice: 15.0),
        MenuItemCustomization(id: 'c14', name: 'Extra Raita', extraPrice: 10.0),
      ],
    ),
    MenuItem(
      itemId: 'm_6',
      name: 'South Indian Mini Meals',
      price: 90.0,
      category: 'Lunch',
      isAvailable: true,
      prepTime: 6,
      isVeg: true,
      isSpecial: false,
      rating: 4.5,
      description: 'Nutritious platter featuring Sambar rice, tangy Rasam rice, creamy Curd rice, seasonal poriyal, papad and mango pickle.',
      imageUrl: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=600&auto=format&fit=crop&q=80',
      customizations: const [
        MenuItemCustomization(id: 'c15', name: 'Extra Appalam / Papad', extraPrice: 5.0),
        MenuItemCustomization(id: 'c16', name: 'Add Payasam Dessert', extraPrice: 25.0),
      ],
    ),

    // Snacks
    MenuItem(
      itemId: 'm_7',
      name: 'Cheese Grilled Sandwich',
      price: 75.0,
      category: 'Snacks',
      isAvailable: true,
      prepTime: 8,
      isVeg: true,
      isSpecial: false,
      rating: 4.6,
      description: 'Golden grilled sandwich stuffed with bell peppers, corn, spicy green chutney and double layer melted cheddar mozzarella.',
      imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=80',
      customizations: const [
        MenuItemCustomization(id: 'c17', name: 'Extra Mozzarella Cheese', extraPrice: 20.0),
        MenuItemCustomization(id: 'c18', name: 'Add Spicy Jalapenos', extraPrice: 10.0),
        MenuItemCustomization(id: 'c19', name: 'Peri-Peri Seasoning', extraPrice: 5.0),
      ],
    ),
    MenuItem(
      itemId: 'm_8',
      name: 'Crispy Samosa Chaat',
      price: 55.0,
      category: 'Snacks',
      isAvailable: true,
      prepTime: 6,
      isVeg: true,
      isSpecial: false,
      rating: 4.7,
      description: 'Crushed spiced potato samosas topped with warm ragda/chole, chilled yoghurt, tangy tamarind chutney, and fresh sev.',
      imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80',
      customizations: const [
        MenuItemCustomization(id: 'c20', name: 'Extra Sweet Chutney', extraPrice: 0.0),
        MenuItemCustomization(id: 'c21', name: 'Extra Crunchy Sev', extraPrice: 5.0),
      ],
    ),
    MenuItem(
      itemId: 'm_9',
      name: 'Loaded Peri-Peri Fries',
      price: 85.0,
      category: 'Snacks',
      isAvailable: true,
      prepTime: 7,
      isVeg: true,
      isSpecial: true,
      rating: 4.7,
      description: 'Hot crispy potato fries dusted with fiery African peri-peri spices, drizzled with garlic mayo and warm cheese sauce.',
      imageUrl: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=600&auto=format&fit=crop&q=80',
      customizations: const [
        MenuItemCustomization(id: 'c22', name: 'Extra Cheese Dip', extraPrice: 15.0),
        MenuItemCustomization(id: 'c23', name: 'Tandoori Mayo Drizzle', extraPrice: 10.0),
      ],
    ),

    // Beverages
    MenuItem(
      itemId: 'm_10',
      name: 'Cold Coffee with Ice Cream',
      price: 60.0,
      category: 'Beverages',
      isAvailable: true,
      prepTime: 4,
      isVeg: true,
      isSpecial: true,
      rating: 4.8,
      description: 'Thick creamy blended espresso cold coffee topped with a rich scoop of vanilla ice cream and chocolate drizzle.',
      imageUrl: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=600&auto=format&fit=crop&q=80',
      customizations: const [
        MenuItemCustomization(id: 'c24', name: 'Extra Vanilla Scoop', extraPrice: 20.0),
        MenuItemCustomization(id: 'c25', name: 'Dark Chocolate Syrup', extraPrice: 10.0),
        MenuItemCustomization(id: 'c26', name: 'Less Sugar / No Sugar', extraPrice: 0.0),
      ],
    ),
    MenuItem(
      itemId: 'm_11',
      name: 'Fresh Mango Milkshake',
      price: 65.0,
      category: 'Beverages',
      isAvailable: true,
      prepTime: 5,
      isVeg: true,
      isSpecial: false,
      rating: 4.7,
      description: 'Seasonal sweet Alphonso mango pulp blended with chilled full cream milk and garnished with chopped almonds.',
      imageUrl: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&auto=format&fit=crop&q=80',
      customizations: const [
        MenuItemCustomization(id: 'c27', name: 'Add Chia Seeds', extraPrice: 10.0),
        MenuItemCustomization(id: 'c28', name: 'Extra Dry Fruits', extraPrice: 15.0),
      ],
    ),
    MenuItem(
      itemId: 'm_12',
      name: 'Authentic Filter Coffee',
      price: 25.0,
      category: 'Beverages',
      isAvailable: true,
      prepTime: 3,
      isVeg: true,
      isSpecial: false,
      rating: 4.9,
      description: 'Freshly decocted traditional South Indian chicory blend filter coffee served piping hot with frothy foam in a dabarah tumbler.',
      imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80',
      customizations: const [
        MenuItemCustomization(id: 'c29', name: 'Strong Decoction', extraPrice: 0.0),
        MenuItemCustomization(id: 'c30', name: 'Brown Sugar Option', extraPrice: 5.0),
      ],
    ),
  ];

  static final List<CouponModel> coupons = [
    CouponModel(
      code: 'CAMPUS50',
      title: 'Flat ₹50 OFF',
      description: 'Get ₹50 off on all orders above ₹150. Valid across all canteen counters.',
      discountValue: 50.0,
      isPercentage: false,
      minOrderAmount: 150.0,
      expiryDate: DateTime.now().add(const Duration(days: 14)),
      pointsCost: 50,
    ),
    CouponModel(
      code: 'WELCOME10',
      title: '15% First Order Bonus',
      description: 'Enjoy 15% discount up to ₹40 on your campus cravings.',
      discountValue: 15.0,
      isPercentage: true,
      minOrderAmount: 80.0,
      expiryDate: DateTime.now().add(const Duration(days: 30)),
      pointsCost: 30,
    ),
    CouponModel(
      code: 'BITE20',
      title: '₹20 Quick Snack Discount',
      description: 'Special ₹20 discount on Snacks and Beverages category.',
      discountValue: 20.0,
      isPercentage: false,
      minOrderAmount: 70.0,
      expiryDate: DateTime.now().add(const Duration(days: 7)),
      pointsCost: 20,
    ),
    CouponModel(
      code: 'FREECHAI',
      title: 'Free Filter Coffee / Chai',
      description: 'Get flat ₹25 off when purchasing any combo or meals.',
      discountValue: 25.0,
      isPercentage: false,
      minOrderAmount: 90.0,
      expiryDate: DateTime.now().add(const Duration(days: 20)),
      pointsCost: 25,
    ),
  ];

  static final List<NotificationModel> initialNotifications = [
    NotificationModel(
      id: 'notif_1',
      title: '🎉 Welcome to CampusBite!',
      body: 'Skip the canteen queues! Browse real-time menus and pick up your meals with instant digital tokens.',
      type: 'promotion',
      timestamp: DateTime.now().subtract(const Duration(hours: 3)),
      isRead: false,
    ),
    NotificationModel(
      id: 'notif_2',
      title: '🔥 Today\'s Chef Special',
      body: 'Chicken Dum Biryani and Masala Dosa are freshly prepared. Grab yours before stocks run out!',
      type: 'promotion',
      timestamp: DateTime.now().subtract(const Duration(hours: 1)),
      isRead: false,
    ),
  ];

  static List<OrderModel> getSamplePastOrders(String studentId) {
    return [
      OrderModel(
        orderId: 'CB-8492',
        studentId: studentId,
        items: [
          CartItem(
            id: 'ci_1',
            menuItem: menuItems[0], // Masala Dosa
            quantity: 1,
            selectedCustomizations: [menuItems[0].customizations[0]],
          ),
          CartItem(
            id: 'ci_2',
            menuItem: menuItems[11], // Filter coffee
            quantity: 1,
          ),
        ],
        status: OrderStatus.collected,
        createdAt: DateTime.now().subtract(const Duration(days: 1, hours: 3)),
        subtotal: 100.0,
        discount: 20.0,
        totalAmount: 80.0,
        paymentMethod: 'Online',
        paymentStatus: 'Paid',
        tokenId: 'T-104',
        qrCode: 'CB-8492-T104',
        estimatedReadyMinutes: 10,
        isReviewed: true,
        rating: 5.0,
        reviewComment: 'Super fast pickup! Crispy dosa was still hot.',
      ),
      OrderModel(
        orderId: 'CB-7910',
        studentId: studentId,
        items: [
          CartItem(
            id: 'ci_3',
            menuItem: menuItems[4], // Chicken Dum Biryani
            quantity: 1,
          ),
          CartItem(
            id: 'ci_4',
            menuItem: menuItems[9], // Cold Coffee
            quantity: 1,
          ),
        ],
        status: OrderStatus.collected,
        createdAt: DateTime.now().subtract(const Duration(days: 3, hours: 2)),
        subtotal: 210.0,
        discount: 50.0,
        totalAmount: 160.0,
        paymentMethod: 'Online',
        paymentStatus: 'Paid',
        tokenId: 'T-078',
        qrCode: 'CB-7910-T078',
        estimatedReadyMinutes: 12,
        isReviewed: false,
      ),
    ];
  }

  static final List<Map<String, dynamic>> loyaltyHistory = [
    {
      'title': 'Order #CB-8492 Completed',
      'points': '+10 pts',
      'isCredit': true,
      'date': 'Yesterday, 1:40 PM',
    },
    {
      'title': 'Redeemed ₹20 Snack Coupon',
      'points': '-20 pts',
      'isCredit': false,
      'date': '2 days ago',
    },
    {
      'title': 'Order #CB-7910 Completed',
      'points': '+20 pts',
      'isCredit': true,
      'date': '3 days ago',
    },
    {
      'title': 'Student Sign-up Loyalty Bonus',
      'points': '+50 pts',
      'isCredit': true,
      'date': '10 days ago',
    },
  ];
}
