export const initialMenuItems = [
  { itemId: 'm1', name: 'Paneer Butter Masala Roll', category: 'Food', price: 90, isAvailable: true, prepTime: 8, isVeg: true },
  { itemId: 'm2', name: 'Chicken Crispy Burger', category: 'Food', price: 120, isAvailable: true, prepTime: 12, isVeg: false },
  { itemId: 'm3', name: 'Veg Schezwan Fried Rice', category: 'Food', price: 80, isAvailable: true, prepTime: 10, isVeg: true },
  { itemId: 'm4', name: 'Egg Maggi with Cheese', category: 'Food', price: 65, isAvailable: true, prepTime: 6, isVeg: false },
  { itemId: 'm5', name: 'Peri Peri French Fries', category: 'Food', price: 60, isAvailable: true, prepTime: 5, isVeg: true },
  { itemId: 'm6', name: 'Fresh Mango Juice', category: 'Beverage', price: 50, isAvailable: true, prepTime: 4, isVeg: true },
  { itemId: 'm7', name: 'Oreo Chocolate Thick Shake', category: 'Beverage', price: 75, isAvailable: true, prepTime: 5, isVeg: true },
  { itemId: 'm8', name: 'Iced Cold Coffee', category: 'Beverage', price: 55, isAvailable: true, prepTime: 3, isVeg: true },
  { itemId: 'm9', name: 'Vanilla Ice Cream Scoop', category: 'Beverage', price: 40, isAvailable: false, prepTime: 2, isVeg: true },
  { itemId: 'm10', name: 'Fresh Mint Lime Soda', category: 'Beverage', price: 35, isAvailable: true, prepTime: 3, isVeg: true }
];

export const initialOrders = [
  {
    orderId: 'ORD-101',
    tokenNumber: 'TK-101',
    customerName: 'Rahul K (Student)',
    status: 'Preparing',
    priority: 'Normal',
    createdAt: new Date(Date.now() - 14 * 60000).toISOString(),
    totalAmount: 185,
    paymentMethod: 'Online',
    paymentStatus: 'Paid',
    category: 'Food',
    specialInstructions: 'Less spicy in burger',
    items: [
      { itemId: 'm2', name: 'Chicken Crispy Burger', quantity: 1, price: 120, category: 'Food' },
      { itemId: 'm4', name: 'Egg Maggi with Cheese', quantity: 1, price: 65, category: 'Food' }
    ]
  },
  {
    orderId: 'ORD-102',
    tokenNumber: 'TK-102',
    customerName: 'Ananya S (Guest)',
    status: 'Pending',
    priority: 'VIP',
    createdAt: new Date(Date.now() - 6 * 60000).toISOString(),
    totalAmount: 90,
    paymentMethod: 'Cash',
    paymentStatus: 'Pending',
    category: 'Food',
    specialInstructions: 'Extra napkins please',
    items: [
      { itemId: 'm1', name: 'Paneer Butter Masala Roll', quantity: 1, price: 90, category: 'Food' }
    ]
  },
  {
    orderId: 'ORD-103',
    tokenNumber: 'TK-103',
    customerName: 'Sanjay M (Student)',
    status: 'Preparing',
    priority: 'Quick',
    createdAt: new Date(Date.now() - 11 * 60000).toISOString(),
    totalAmount: 125,
    paymentMethod: 'Online',
    paymentStatus: 'Paid',
    category: 'Beverage',
    specialInstructions: 'Less sugar, no ice',
    items: [
      { itemId: 'm7', name: 'Oreo Chocolate Thick Shake', quantity: 1, price: 75, category: 'Beverage' },
      { itemId: 'm6', name: 'Fresh Mango Juice', quantity: 1, price: 50, category: 'Beverage' }
    ]
  },
  {
    orderId: 'ORD-104',
    tokenNumber: 'TK-104',
    customerName: 'Pooja R (Faculty)',
    status: 'Ready',
    priority: 'Normal',
    createdAt: new Date(Date.now() - 22 * 60000).toISOString(),
    totalAmount: 140,
    paymentMethod: 'Online',
    paymentStatus: 'Paid',
    category: 'Food',
    specialInstructions: '',
    items: [
      { itemId: 'm3', name: 'Veg Schezwan Fried Rice', quantity: 1, price: 80, category: 'Food' },
      { itemId: 'm5', name: 'Peri Peri French Fries', quantity: 1, price: 60, category: 'Food' }
    ]
  },
  {
    orderId: 'ORD-105',
    tokenNumber: 'TK-105',
    customerName: 'Karthik V (Student)',
    status: 'Ready',
    priority: 'Normal',
    createdAt: new Date(Date.now() - 18 * 60000).toISOString(),
    totalAmount: 55,
    paymentMethod: 'Cash',
    paymentStatus: 'Paid',
    category: 'Beverage',
    specialInstructions: '',
    items: [
      { itemId: 'm8', name: 'Iced Cold Coffee', quantity: 1, price: 55, category: 'Beverage' }
    ]
  }
];

export const initialInventory = [
  { id: 'inv-1', itemName: 'Burger Buns', quantity: 45, threshold: 20, unit: 'pcs', category: 'Bakery' },
  { id: 'inv-2', itemName: 'Paneer (Cottage Cheese)', quantity: 4, threshold: 8, unit: 'kg', category: 'Dairy' },
  { id: 'inv-3', itemName: 'Chicken Fillets', quantity: 14, threshold: 10, unit: 'kg', category: 'Poultry' },
  { id: 'inv-4', itemName: 'Milk Packets', quantity: 28, threshold: 15, unit: 'liters', category: 'Dairy' },
  { id: 'inv-5', itemName: 'Oreo Biscuits Box', quantity: 3, threshold: 10, unit: 'boxes', category: 'Pantry' },
  { id: 'inv-6', itemName: 'Basmati Rice', quantity: 35, threshold: 15, unit: 'kg', category: 'Grains' },
  { id: 'inv-7', itemName: 'Vanilla Ice Cream Tub', quantity: 0, threshold: 3, unit: 'tubs', category: 'Frozen' }
];

export const initialStaffAccounts = [
  { id: 'st-1', name: 'Gokul Staff', email: 'gokul.cashier@campusbite.com', role: 'cashier', active: true, shift: 'Morning' },
  { id: 'st-2', name: 'Chef Anthony', email: 'anthony.kitchen@campusbite.com', role: 'kitchen', active: true, shift: 'All-Day' },
  { id: 'st-3', name: 'Juice Master Ravi', email: 'ravi.juice@campusbite.com', role: 'beverage', active: true, shift: 'Morning' },
  { id: 'st-4', name: 'Counter Staff Divya', email: 'divya.counter@campusbite.com', role: 'counter', active: true, shift: 'Evening' },
  { id: 'st-5', name: 'Manager Varun', email: 'varun.manager@campusbite.com', role: 'manager', active: true, shift: 'Admin' }
];

export const initialFeedback = [
  { id: 'fb-1', studentName: 'Priya N.', orderId: 'ORD-092', rating: 5, comment: 'Quickest pickup ever! The Paneer roll was steaming hot.', date: 'Today, 1:15 PM' },
  { id: 'fb-2', studentName: 'Aditya P.', orderId: 'ORD-089', rating: 4, comment: 'Cold coffee was delicious, but token screen delayed by 2 mins.', date: 'Today, 12:40 PM' },
  { id: 'fb-3', studentName: 'Harish K.', orderId: 'ORD-081', rating: 2, comment: 'Burger bun was slightly dry today. Please check freshness.', date: 'Yesterday' },
  { id: 'fb-4', studentName: 'Meera S.', orderId: 'ORD-076', rating: 5, comment: 'Smooth online payment and friendly counter staff.', date: 'Yesterday' }
];

export const initialSalesData = [
  { hour: '09 AM', revenue: 1450, orders: 18 },
  { hour: '10 AM', revenue: 2600, orders: 32 },
  { hour: '11 AM', revenue: 4100, orders: 48 },
  { hour: '12 PM', revenue: 9800, orders: 110 },
  { hour: '01 PM', revenue: 12400, orders: 135 },
  { hour: '02 PM', revenue: 8600, orders: 92 },
  { hour: '03 PM', revenue: 3800, orders: 42 },
  { hour: '04 PM', revenue: 5200, orders: 60 },
  { hour: '05 PM', revenue: 3100, orders: 35 }
];
