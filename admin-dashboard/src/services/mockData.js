export const initialMenuItems = [
  // --- TODAY'S SPECIAL ---
  { itemId: 'sp1', name: 'Chef Special Hyderabadi Dum Biryani', category: 'Today Special', price: 160, isAvailable: true, prepTime: 12, isVeg: false },
  { itemId: 'sp2', name: 'Paneer Tikka Stuffed Kulcha', category: 'Today Special', price: 110, isAvailable: true, prepTime: 10, isVeg: true },
  { itemId: 'sp3', name: 'Crispy Dragon Chicken Wings', category: 'Today Special', price: 140, isAvailable: true, prepTime: 12, isVeg: false },

  // --- MAIN COURSE ---
  { itemId: 'mc1', name: 'Veg Schezwan Fried Rice', category: 'Main Course', price: 95, isAvailable: true, prepTime: 10, isVeg: true },
  { itemId: 'mc2', name: 'Egg Hakka Noodles', category: 'Main Course', price: 85, isAvailable: true, prepTime: 8, isVeg: false },
  { itemId: 'mc3', name: 'Chicken Fried Rice with Chilli Garlic', category: 'Main Course', price: 120, isAvailable: true, prepTime: 12, isVeg: false },
  { itemId: 'mc4', name: 'South Indian Mini Meals (Rice + Sambar + Curd)', category: 'Main Course', price: 75, isAvailable: true, prepTime: 5, isVeg: true },
  { itemId: 'mc5', name: 'Butter Naan Basket (2 Pcs)', category: 'Main Course', price: 40, isAvailable: true, prepTime: 6, isVeg: true },

  // --- CURRIES ---
  { itemId: 'cr1', name: 'Paneer Butter Masala', category: 'Curries', price: 110, isAvailable: true, prepTime: 10, isVeg: true },
  { itemId: 'cr2', name: 'Chicken Chettinad Curry', category: 'Curries', price: 135, isAvailable: true, prepTime: 12, isVeg: false },
  { itemId: 'cr3', name: 'Dal Tadka Special', category: 'Curries', price: 70, isAvailable: true, prepTime: 6, isVeg: true },
  { itemId: 'cr4', name: 'Kadai Mushroom Gravy', category: 'Curries', price: 95, isAvailable: true, prepTime: 8, isVeg: true },

  // --- HOT DRINKS ---
  { itemId: 'hd1', name: 'South Indian Filter Coffee', category: 'Hot Drinks', price: 25, isAvailable: true, prepTime: 3, isVeg: true },
  { itemId: 'hd2', name: 'Masala Chai (Ginger & Cardamom)', category: 'Hot Drinks', price: 20, isAvailable: true, prepTime: 3, isVeg: true },
  { itemId: 'hd3', name: 'Hot Belgian Chocolate Drink', category: 'Hot Drinks', price: 55, isAvailable: true, prepTime: 4, isVeg: true },
  { itemId: 'hd4', name: 'Green Tea (Honey Lemon)', category: 'Hot Drinks', price: 25, isAvailable: true, prepTime: 2, isVeg: true },

  // --- CHOCOLATES ---
  { itemId: 'ch1', name: 'Ferrero Rocher Deluxe Cone', category: 'Chocolates', price: 65, isAvailable: true, prepTime: 1, isVeg: true },
  { itemId: 'ch2', name: 'Cadbury Dairy Milk Silk (Roast Almond)', category: 'Chocolates', price: 80, isAvailable: true, prepTime: 1, isVeg: true },
  { itemId: 'ch3', name: 'KitKat 4-Finger Dark Chocolate', category: 'Chocolates', price: 40, isAvailable: true, prepTime: 1, isVeg: true },
  { itemId: 'ch4', name: 'Homemade Dark Chocolate Truffle', category: 'Chocolates', price: 50, isAvailable: true, prepTime: 2, isVeg: true },

  // --- ICE CREAMS ---
  { itemId: 'ic1', name: 'Choco Nut Sundae with Hot Fudge', category: 'Ice Creams', price: 75, isAvailable: true, prepTime: 4, isVeg: true },
  { itemId: 'ic2', name: 'Spanish Delight Double Scoop', category: 'Ice Creams', price: 60, isAvailable: true, prepTime: 3, isVeg: true },
  { itemId: 'ic3', name: 'Classic Vanilla with Chocolate Dip', category: 'Ice Creams', price: 35, isAvailable: true, prepTime: 2, isVeg: true },
  { itemId: 'ic4', name: 'Alphonso Mango Kulfi Stick', category: 'Ice Creams', price: 40, isAvailable: true, prepTime: 2, isVeg: true },

  // --- DESSERTS ---
  { itemId: 'ds1', name: 'Hot Sizzling Brownie with Vanilla Ice Cream', category: 'Desserts', price: 95, isAvailable: true, prepTime: 5, isVeg: true },
  { itemId: 'ds2', name: 'Gulab Jamun with Rabdi (2 Pcs)', category: 'Desserts', price: 50, isAvailable: true, prepTime: 3, isVeg: true },
  { itemId: 'ds3', name: 'Red Velvet Pastry Slice', category: 'Desserts', price: 65, isAvailable: true, prepTime: 2, isVeg: true },
  { itemId: 'ds4', name: 'Lotus Biscoff Cheesecake Jar', category: 'Desserts', price: 110, isAvailable: true, prepTime: 3, isVeg: true }
];

export const initialOrders = [
  {
    orderId: 'ORD-101',
    tokenNumber: 'TK-101',
    customerName: 'Rahul K (Student)',
    status: 'Preparing',
    priority: 'Normal',
    createdAt: new Date(Date.now() - 14 * 60000).toISOString(),
    totalAmount: 195,
    paymentMethod: 'Online',
    paymentStatus: 'Paid',
    category: 'Food',
    specialInstructions: 'Less spicy',
    items: [
      { itemId: 'mc1', name: 'Veg Schezwan Fried Rice', quantity: 1, price: 95, category: 'Main Course' },
      { itemId: 'cr1', name: 'Paneer Butter Masala', quantity: 1, price: 110, category: 'Curries' }
    ]
  },
  {
    orderId: 'ORD-102',
    tokenNumber: 'TK-102',
    customerName: 'Ananya S (Guest)',
    status: 'Pending',
    priority: 'VIP',
    createdAt: new Date(Date.now() - 6 * 60000).toISOString(),
    totalAmount: 160,
    paymentMethod: 'Cash',
    paymentStatus: 'Pending',
    category: 'Food',
    specialInstructions: 'Extra gravy',
    items: [
      { itemId: 'sp1', name: 'Chef Special Hyderabadi Dum Biryani', quantity: 1, price: 160, category: 'Today Special' }
    ]
  },
  {
    orderId: 'ORD-103',
    tokenNumber: 'TK-103',
    customerName: 'Sanjay M (Student)',
    status: 'Preparing',
    priority: 'Quick',
    createdAt: new Date(Date.now() - 11 * 60000).toISOString(),
    totalAmount: 130,
    paymentMethod: 'Online',
    paymentStatus: 'Paid',
    category: 'Beverage',
    specialInstructions: 'Very hot',
    items: [
      { itemId: 'hd3', name: 'Hot Belgian Chocolate Drink', quantity: 1, price: 55, category: 'Hot Drinks' },
      { itemId: 'ic1', name: 'Choco Nut Sundae with Hot Fudge', quantity: 1, price: 75, category: 'Ice Creams' }
    ]
  },
  {
    orderId: 'ORD-104',
    tokenNumber: 'TK-104',
    customerName: 'Pooja R (Faculty)',
    status: 'Ready',
    priority: 'Normal',
    createdAt: new Date(Date.now() - 22 * 60000).toISOString(),
    totalAmount: 95,
    paymentMethod: 'Online',
    paymentStatus: 'Paid',
    category: 'Food',
    specialInstructions: '',
    items: [
      { itemId: 'ds1', name: 'Hot Sizzling Brownie with Vanilla Ice Cream', quantity: 1, price: 95, category: 'Desserts' }
    ]
  },
  {
    orderId: 'ORD-105',
    tokenNumber: 'TK-105',
    customerName: 'Karthik V (Student)',
    status: 'Ready',
    priority: 'Normal',
    createdAt: new Date(Date.now() - 18 * 60000).toISOString(),
    totalAmount: 50,
    paymentMethod: 'Cash',
    paymentStatus: 'Paid',
    category: 'Beverage',
    specialInstructions: '',
    items: [
      { itemId: 'hd1', name: 'South Indian Filter Coffee', quantity: 2, price: 25, category: 'Hot Drinks' }
    ]
  }
];

export const initialInventory = [
  { id: 'inv-1', itemName: 'Biryani Rice', quantity: 45, threshold: 20, unit: 'kg', category: 'Grains' },
  { id: 'inv-2', itemName: 'Paneer (Cottage Cheese)', quantity: 4, threshold: 8, unit: 'kg', category: 'Dairy' },
  { id: 'inv-3', itemName: 'Fresh Chicken Fillets', quantity: 14, threshold: 10, unit: 'kg', category: 'Poultry' },
  { id: 'inv-4', itemName: 'Milk Packets', quantity: 28, threshold: 15, unit: 'liters', category: 'Dairy' },
  { id: 'inv-5', itemName: 'Ice Cream Tubs', quantity: 5, threshold: 8, unit: 'tubs', category: 'Frozen' },
  { id: 'inv-6', itemName: 'Chocolate Syrup & Bars', quantity: 12, threshold: 5, unit: 'bottles', category: 'Pantry' },
  { id: 'inv-7', itemName: 'Filter Coffee Powder', quantity: 18, threshold: 5, unit: 'kg', category: 'Beverage' }
];

export const initialStaffAccounts = [
  { id: 'st-1', name: 'Gokul Staff', email: 'gokul.cashier@campusbite.com', role: 'cashier', active: true, shift: 'Morning' },
  { id: 'st-2', name: 'Chef Anthony', email: 'anthony.kitchen@campusbite.com', role: 'kitchen', active: true, shift: 'All-Day' },
  { id: 'st-3', name: 'Juice Master Ravi', email: 'ravi.juice@campusbite.com', role: 'beverage', active: true, shift: 'Morning' },
  { id: 'st-4', name: 'Counter Staff Divya', email: 'divya.counter@campusbite.com', role: 'counter', active: true, shift: 'Evening' },
  { id: 'st-5', name: 'Manager Varun', email: 'varun.manager@campusbite.com', role: 'manager', active: true, shift: 'Admin' }
];

export const initialFeedback = [
  { id: 'fb-1', studentName: 'Priya N.', orderId: 'ORD-092', rating: 5, comment: 'Dum Biryani was hot and authentic! Loved it.', date: 'Today, 1:15 PM' },
  { id: 'fb-2', studentName: 'Aditya P.', orderId: 'ORD-089', rating: 5, comment: 'Sizzling brownie was heavenly after exam.', date: 'Today, 12:40 PM' },
  { id: 'fb-3', studentName: 'Harish K.', orderId: 'ORD-081', rating: 4, comment: 'Filter coffee was aromatic and strong.', date: 'Yesterday' }
];

export const initialSalesData = [
  { hour: '09 AM', revenue: 1650, orders: 22 },
  { hour: '10 AM', revenue: 2900, orders: 36 },
  { hour: '11 AM', revenue: 4500, orders: 52 },
  { hour: '12 PM', revenue: 11200, orders: 124 },
  { hour: '01 PM', revenue: 14800, orders: 155 },
  { hour: '02 PM', revenue: 9400, orders: 104 },
  { hour: '03 PM', revenue: 4200, orders: 48 },
  { hour: '04 PM', revenue: 6100, orders: 72 },
  { hour: '05 PM', revenue: 3800, orders: 42 }
];
