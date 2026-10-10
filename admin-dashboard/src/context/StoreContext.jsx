import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  initialMenuItems,
  initialOrders,
  initialInventory,
  initialStaffAccounts,
  initialFeedback,
  initialSalesData
} from '../services/mockData';
import { socketService } from '../services/socket';
import { api } from '../services/api';

const StoreContext = createContext(null);

export const StoreProvider = ({ children }) => {
  // Orders
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('cb_orders');
    return saved ? JSON.parse(saved) : initialOrders;
  });

  // Menu items
  const [menu, setMenu] = useState(() => {
    const saved = localStorage.getItem('cb_menu');
    return saved ? JSON.parse(saved) : initialMenuItems;
  });

  // Inventory
  const [inventory, setInventory] = useState(() => {
    const saved = localStorage.getItem('cb_inventory');
    return saved ? JSON.parse(saved) : initialInventory;
  });

  // Staff list
  const [staffList, setStaffList] = useState(() => {
    const saved = localStorage.getItem('cb_staff');
    return saved ? JSON.parse(saved) : initialStaffAccounts;
  });

  // Feedback
  const [feedbackList, setFeedbackList] = useState(() => {
    const saved = localStorage.getItem('cb_feedback');
    return saved ? JSON.parse(saved) : initialFeedback;
  });

  // Sales data
  const [salesData, setSalesData] = useState(initialSalesData);

  // Student Cart
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cb_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Applied coupon
  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    const saved = localStorage.getItem('cb_coupon');
    return saved ? JSON.parse(saved) : null;
  });

  // Student profile
  const [studentUser, setStudentUser] = useState(() => {
    const saved = localStorage.getItem('cb_student_user');
    return saved ? JSON.parse(saved) : {
      id: 'std_krithik_24',
      name: 'Krithik (Student)',
      email: 'krithik.student@campusbite.com',
      rollNo: '21CS104',
      isGuest: false,
      loyaltyPoints: 120
    };
  });

  // Active student order for tracking
  const [activeStudentOrderId, setActiveStudentOrderId] = useState(() => {
    return localStorage.getItem('cb_active_order_id') || 'ORD-101';
  });

  // Student notifications
  const [studentNotifications, setStudentNotifications] = useState(() => {
    const saved = localStorage.getItem('cb_student_notifs');
    return saved ? JSON.parse(saved) : [
      {
        id: 'notif-1',
        title: '🎉 Welcome to CampusBite!',
        message: 'Order ahead, skip canteen queues & earn reward points.',
        time: 'Just now',
        read: false
      },
      {
        id: 'notif-2',
        title: '🏷️ Today Special Deal',
        message: 'Dum Biryani & Brownie combo has flat ₹50 OFF with code CAMPUS50.',
        time: '10 mins ago',
        read: false
      }
    ];
  });

  // Persistence effects
  useEffect(() => {
    localStorage.setItem('cb_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('cb_menu', JSON.stringify(menu));
  }, [menu]);

  useEffect(() => {
    localStorage.setItem('cb_inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('cb_staff', JSON.stringify(staffList));
  }, [staffList]);

  useEffect(() => {
    localStorage.setItem('cb_feedback', JSON.stringify(feedbackList));
  }, [feedbackList]);

  useEffect(() => {
    localStorage.setItem('cb_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (appliedCoupon) {
      localStorage.setItem('cb_coupon', JSON.stringify(appliedCoupon));
    } else {
      localStorage.removeItem('cb_coupon');
    }
  }, [appliedCoupon]);

  useEffect(() => {
    localStorage.setItem('cb_student_user', JSON.stringify(studentUser));
  }, [studentUser]);

  useEffect(() => {
    if (activeStudentOrderId) {
      localStorage.setItem('cb_active_order_id', activeStudentOrderId);
    } else {
      localStorage.removeItem('cb_active_order_id');
    }
  }, [activeStudentOrderId]);

  useEffect(() => {
    localStorage.setItem('cb_student_notifs', JSON.stringify(studentNotifications));
  }, [studentNotifications]);

  // Socket setup
  useEffect(() => {
    socketService.connect();

    const handleNewOrder = (incomingOrder) => {
      setOrders((prev) => {
        if (prev.some((o) => o.orderId === incomingOrder.orderId)) return prev;
        return [incomingOrder, ...prev];
      });
    };

    const handleStatusUpdate = ({ orderId, status }) => {
      setOrders((prev) =>
        prev.map((o) => (o.orderId === orderId ? { ...o, status } : o))
      );

      // Add notification for the active student order
      if (orderId === activeStudentOrderId) {
        addStudentNotification({
          title: `Order Update: ${status}`,
          message: status === 'Ready'
            ? '🚀 Your order is READY for pickup at the counter!'
            : status === 'Preparing'
            ? '👨‍🍳 The kitchen is now preparing your food hot & fresh!'
            : status === 'Collected'
            ? '✅ Enjoy your meal! Please rate your food.'
            : `Order status is now ${status}.`
        });
      }
    };

    socketService.on('newOrder', handleNewOrder);
    socketService.on('orderStatusChanged', handleStatusUpdate);

    return () => {
      socketService.off('newOrder', handleNewOrder);
      socketService.off('orderStatusChanged', handleStatusUpdate);
    };
  }, [activeStudentOrderId]);

  // --- Student Notification Helper ---
  const addStudentNotification = ({ title, message }) => {
    const newNotif = {
      id: `notif-${Date.now()}`,
      title,
      message,
      time: 'Just now',
      read: false
    };
    setStudentNotifications((prev) => [newNotif, ...prev]);
  };

  const markNotificationsAsRead = () => {
    setStudentNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // --- Cart Actions ---
  const addToCart = (item, customization = null, quantity = 1) => {
    setCart((prev) => {
      const customKey = customization ? JSON.stringify(customization) : '';
      const existingIndex = prev.findIndex(
        (ci) => ci.itemId === item.itemId && (ci.customKey || '') === customKey
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }

      return [
        ...prev,
        {
          ...item,
          quantity,
          customization,
          customKey,
          cartItemId: `${item.itemId}_${Date.now()}`
        }
      ];
    });
  };

  const updateCartQuantity = (cartItemId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((ci) => (ci.cartItemId === cartItemId ? { ...ci, quantity: newQty } : ci))
    );
  };

  const removeFromCart = (cartItemId) => {
    setCart((prev) => prev.filter((ci) => ci.cartItemId !== cartItemId));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // Cart calculations
  const cartSubtotal = cart.reduce((sum, item) => {
    let itemPrice = item.price;
    if (item.customization?.addOns) {
      itemPrice += item.customization.addOns.reduce((a, b) => a + (b.price || 0), 0);
    }
    return sum + itemPrice * item.quantity;
  }, 0);

  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.type === 'flat') {
      return Math.min(appliedCoupon.discount, cartSubtotal);
    }
    if (appliedCoupon.type === 'percent') {
      const pct = (cartSubtotal * appliedCoupon.discount) / 100;
      return Math.min(pct, appliedCoupon.maxDiscount || 100);
    }
    return 0;
  };

  const cartDiscount = calculateDiscount();
  const cartTotal = Math.max(0, cartSubtotal - cartDiscount);
  const cartItemsCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  // Coupon handling
  const applyCoupon = (code) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'WELCOME50' || clean === 'CAMPUS50') {
      if (cartSubtotal < 100) {
        return { success: false, message: 'Minimum order amount of ₹100 required for this coupon.' };
      }
      const coup = { code: clean, discount: 50, type: 'flat', description: '₹50 Instant Discount' };
      setAppliedCoupon(coup);
      return { success: true, message: 'Coupon applied! ₹50 deducted.' };
    }
    if (clean === 'CAMPUS20' || clean === 'BITE20') {
      const coup = { code: clean, discount: 20, type: 'percent', maxDiscount: 60, description: '20% off up to ₹60' };
      setAppliedCoupon(coup);
      return { success: true, message: '20% discount applied successfully!' };
    }
    if (clean === 'STUDENT10') {
      const coup = { code: clean, discount: 10, type: 'percent', maxDiscount: 40, description: '10% Student Perks' };
      setAppliedCoupon(coup);
      return { success: true, message: '10% student discount applied!' };
    }
    if (clean.startsWith('REWARD-')) {
      const coup = { code: clean, discount: 30, type: 'flat', description: 'Loyalty Reward Voucher' };
      setAppliedCoupon(coup);
      return { success: true, message: 'Loyalty reward applied successfully!' };
    }
    return { success: false, message: 'Invalid or expired coupon code. Try CAMPUS50 or CAMPUS20.' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Student Order Placement
  const placeStudentOrder = ({ paymentMethod, specialInstructions = '', simulatedPaymentId = null }) => {
    if (cart.length === 0) return null;

    const nextTokenNum = 100 + orders.length + 1;
    const orderId = `ORD-${Date.now().toString().slice(-4)}`;
    const tokenNumber = `TK-${nextTokenNum}`;

    const newOrder = {
      orderId,
      tokenNumber,
      customerName: studentUser.isGuest ? 'Guest Diner' : studentUser.name,
      customerEmail: studentUser.email,
      studentId: studentUser.rollNo,
      status: 'Pending',
      priority: 'Normal',
      createdAt: new Date().toISOString(),
      totalAmount: cartTotal,
      subtotal: cartSubtotal,
      discountAmount: cartDiscount,
      couponCode: appliedCoupon?.code || null,
      paymentMethod, // 'Online' or 'Cash'
      paymentStatus: paymentMethod === 'Online' ? 'Paid' : 'Pending',
      paymentTransactionId: simulatedPaymentId || (paymentMethod === 'Online' ? `rzp_live_${Date.now().toString().slice(-6)}` : null),
      category: cart.some((i) => ['Hot Drinks', 'Ice Creams', 'Beverages'].includes(i.category))
        ? (cart.some((i) => ['Main Course', 'Today Special', 'Curries'].includes(i.category)) ? 'Food & Drink' : 'Beverage')
        : 'Food',
      specialInstructions,
      items: cart.map((ci) => ({
        itemId: ci.itemId,
        name: ci.name,
        quantity: ci.quantity,
        price: ci.price,
        category: ci.category,
        customization: ci.customization,
        imageUrl: ci.imageUrl,
        isVeg: ci.isVeg
      }))
    };

    setOrders((prev) => [newOrder, ...prev]);
    setActiveStudentOrderId(orderId);

    // Award loyalty points to registered student (10 points per ₹100 spent)
    if (!studentUser.isGuest) {
      const pointsEarned = Math.max(5, Math.floor(cartTotal / 10));
      setStudentUser((prev) => ({
        ...prev,
        loyaltyPoints: (prev.loyaltyPoints || 0) + pointsEarned
      }));
    }

    // Add push notification
    addStudentNotification({
      title: `Order ${tokenNumber} Placed!`,
      message: paymentMethod === 'Online'
        ? `Paid ₹${cartTotal} via Razorpay. Order sent to kitchen.`
        : `Token generated! Please pay ₹${cartTotal} cash at the counter to start preparation.`
    });

    // Clear cart
    clearCart();

    // Broadcast through socket & background sync
    socketService.emit('newOrder', newOrder);
    api.createOrder(newOrder).catch(() => {});

    return newOrder;
  };

  // Feedback Submission
  const submitFeedback = ({ orderId, rating, comment, tags = [], studentName = '' }) => {
    const newFeedback = {
      id: `fb-${Date.now().toString().slice(-4)}`,
      studentName: studentName || studentUser.name || 'Anonymous Student',
      orderId,
      rating,
      comment,
      tags,
      date: 'Just now'
    };

    setFeedbackList((prev) => [newFeedback, ...prev]);

    // Give bonus 15 loyalty points for reviewing!
    if (!studentUser.isGuest) {
      setStudentUser((prev) => ({
        ...prev,
        loyaltyPoints: (prev.loyaltyPoints || 0) + 15
      }));
    }

    addStudentNotification({
      title: '⭐ Thanks for your feedback!',
      message: 'You received 15 bonus loyalty points for reviewing your meal!'
    });

    api.submitFeedback(newFeedback).catch(() => {});
    return newFeedback;
  };

  // Loyalty Rewards Redemption
  const redeemReward = (reward) => {
    if (studentUser.loyaltyPoints < reward.cost) {
      return { success: false, message: 'Insufficient loyalty points balance!' };
    }

    setStudentUser((prev) => ({
      ...prev,
      loyaltyPoints: prev.loyaltyPoints - reward.cost
    }));

    const rewardCoupon = {
      code: `REWARD-${reward.id.toUpperCase()}`,
      discount: reward.discount,
      type: 'flat',
      description: reward.title
    };

    setAppliedCoupon(rewardCoupon);
    addStudentNotification({
      title: '🎁 Reward Redeemed!',
      message: `${reward.title} coupon applied to your cart!`
    });

    return { success: true, message: 'Reward redeemed and applied to cart!' };
  };

  // Reorder helper
  const reorderPreviousOrder = (order) => {
    if (!order || !order.items) return;
    order.items.forEach((item) => {
      addToCart(item, item.customization, item.quantity);
    });
    addStudentNotification({
      title: '🛒 Items added to Cart',
      message: `${order.items.length} items from previous order loaded into cart.`
    });
  };

  // Student Profile toggle / Guest mode
  const toggleGuestMode = (guestStatus) => {
    setStudentUser((prev) => ({
      ...prev,
      isGuest: guestStatus,
      name: guestStatus ? 'Guest Diner' : 'Krithik (Student)'
    }));
  };

  // --- Staff & Counter Actions (Preserved & Enhanced) ---
  const addWalkInOrder = (newOrder) => {
    const nextTokenNum = 100 + orders.length + 1;
    const orderRecord = {
      orderId: `ORD-${Date.now().toString().slice(-4)}`,
      tokenNumber: `TK-${nextTokenNum}`,
      createdAt: new Date().toISOString(),
      status: 'Pending',
      priority: newOrder.priority || 'Normal',
      paymentStatus: newOrder.paymentMethod === 'Cash' ? 'Pending' : 'Paid',
      ...newOrder
    };

    setOrders((prev) => [orderRecord, ...prev]);
    socketService.emit('newOrder', orderRecord);
    api.createOrder(orderRecord).catch(() => {});
    return orderRecord;
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.orderId === orderId ? { ...ord, status: newStatus } : ord))
    );
    socketService.emit('orderStatusChanged', { orderId, status: newStatus });

    // Automatic inventory deduction on collection
    if (newStatus === 'Collected') {
      const order = orders.find((o) => o.orderId === orderId);
      if (order && order.items) {
        order.items.forEach((itm) => {
          if (itm.name.toLowerCase().includes('biryani')) {
            deductInventoryByName('Biryani Rice', itm.quantity * 0.25);
            deductInventoryByName('Fresh Chicken Fillets', itm.quantity * 0.15);
          }
          if (itm.name.toLowerCase().includes('paneer')) {
            deductInventoryByName('Paneer (Cottage Cheese)', itm.quantity * 0.1);
          }
          if (itm.name.toLowerCase().includes('coffee')) {
            deductInventoryByName('Milk Packets', itm.quantity * 0.15);
            deductInventoryByName('Filter Coffee Powder', itm.quantity * 0.02);
          }
          if (itm.name.toLowerCase().includes('chocolate')) {
            deductInventoryByName('Chocolate Syrup & Bars', itm.quantity * 0.05);
          }
        });
      }
    }

    api.updateOrderStatus(orderId, newStatus).catch(() => {});
  };

  const deductInventoryByName = (itemName, qty) => {
    setInventory((prev) =>
      prev.map((item) => {
        if (item.itemName.toLowerCase() === itemName.toLowerCase()) {
          const newQty = Math.max(0, Math.round((item.quantity - qty) * 10) / 10);
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const verifyCashPayment = (tokenIdOrOrderId) => {
    const trimmed = tokenIdOrOrderId.trim().toUpperCase();
    let found = false;
    setOrders((prev) =>
      prev.map((ord) => {
        if (
          ord.orderId.toUpperCase() === trimmed ||
          ord.tokenNumber.toUpperCase() === trimmed
        ) {
          found = true;
          return { ...ord, paymentStatus: 'Paid' };
        }
        return ord;
      })
    );

    if (found) {
      socketService.emit('paymentConfirmed', { tokenId: trimmed });
      api.verifyCashPayment(trimmed).catch(() => {});
    }
    return found;
  };

  const processRefund = (orderId, reason) => {
    let found = false;
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.orderId === orderId) {
          found = true;
          return {
            ...ord,
            status: 'Cancelled',
            paymentStatus: 'Refunded',
            refundReason: reason
          };
        }
        return ord;
      })
    );

    if (found) {
      socketService.emit('orderStatusChanged', { orderId, status: 'Cancelled' });
      api.cancelOrder(orderId, reason).catch(() => {});
    }
    return found;
  };

  // Menu Actions
  const toggleItemAvailability = (itemId) => {
    setMenu((prev) =>
      prev.map((item) => {
        if (item.itemId === itemId) {
          const updated = { ...item, isAvailable: !item.isAvailable };
          api.updateMenuItem(itemId, updated).catch(() => {});
          return updated;
        }
        return item;
      })
    );
  };

  const addMenuItem = (item) => {
    const newItem = {
      itemId: `m${Date.now().toString().slice(-4)}`,
      ...item
    };
    setMenu((prev) => [...prev, newItem]);
    api.createMenuItem(newItem).catch(() => {});
  };

  const updateMenuItem = (itemId, updatedFields) => {
    setMenu((prev) =>
      prev.map((item) => {
        if (item.itemId === itemId) {
          const updated = { ...item, ...updatedFields };
          api.updateMenuItem(itemId, updated).catch(() => {});
          return updated;
        }
        return item;
      })
    );
  };

  const deleteMenuItem = (itemId) => {
    setMenu((prev) => prev.filter((item) => item.itemId !== itemId));
    api.deleteMenuItem(itemId).catch(() => {});
  };

  // Inventory Actions
  const updateInventoryStock = (id, newQuantity, newThreshold) => {
    setInventory((prev) =>
      prev.map((inv) => {
        if (inv.id === id) {
          const updated = {
            ...inv,
            quantity: Number(newQuantity),
            threshold: Number(newThreshold)
          };
          api.updateInventory(id, updated.quantity, updated.threshold).catch(() => {});
          return updated;
        }
        return inv;
      })
    );
  };

  // Staff Actions
  const toggleStaffStatus = (id) => {
    setStaffList((prev) =>
      prev.map((st) => (st.id === id ? { ...st, active: !st.active } : st))
    );
  };

  const addStaffAccount = (staff) => {
    const newStaff = {
      id: `st-${Date.now().toString().slice(-4)}`,
      active: true,
      ...staff
    };
    setStaffList((prev) => [...prev, newStaff]);
    api.createStaff(newStaff).catch(() => {});
  };

  // Helper getters
  const activeOrdersCount = orders.filter(
    (o) => o.status === 'Pending' || o.status === 'Preparing'
  ).length;

  const currentActiveStudentOrder = orders.find((o) => o.orderId === activeStudentOrderId) ||
    orders.find((o) => (o.customerEmail === studentUser.email || o.studentId === studentUser.rollNo) && o.status !== 'Collected' && o.status !== 'Cancelled') ||
    orders[0];

  const studentOrderHistory = orders.filter(
    (o) => (studentUser.isGuest ? true : (o.customerEmail === studentUser.email || o.studentId === studentUser.rollNo || o.customerName?.includes('Student') || o.customerName?.includes('Rahul') || o.customerName?.includes('Krithik')))
  );

  return (
    <StoreContext.Provider
      value={{
        orders,
        menu,
        inventory,
        staffList,
        feedbackList,
        salesData,
        activeOrdersCount,
        // Cart
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartSubtotal,
        cartDiscount,
        cartTotal,
        cartItemsCount,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        // Student Auth & Profile
        studentUser,
        setStudentUser,
        toggleGuestMode,
        // Orders & Tracking
        activeStudentOrderId,
        setActiveStudentOrderId,
        currentActiveStudentOrder,
        studentOrderHistory,
        placeStudentOrder,
        reorderPreviousOrder,
        // Feedback & Loyalty
        submitFeedback,
        redeemReward,
        // Notifications
        studentNotifications,
        addStudentNotification,
        markNotificationsAsRead,
        // Staff operations
        addWalkInOrder,
        updateOrderStatus,
        verifyCashPayment,
        processRefund,
        toggleItemAvailability,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        updateInventoryStock,
        toggleStaffStatus,
        addStaffAccount
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
