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
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('cb_orders');
    return saved ? JSON.parse(saved) : initialOrders;
  });

  const [menu, setMenu] = useState(() => {
    const saved = localStorage.getItem('cb_menu');
    return saved ? JSON.parse(saved) : initialMenuItems;
  });

  const [inventory, setInventory] = useState(() => {
    const saved = localStorage.getItem('cb_inventory');
    return saved ? JSON.parse(saved) : initialInventory;
  });

  const [staffList, setStaffList] = useState(() => {
    const saved = localStorage.getItem('cb_staff');
    return saved ? JSON.parse(saved) : initialStaffAccounts;
  });

  const [feedbackList, setFeedbackList] = useState(initialFeedback);
  const [salesData, setSalesData] = useState(initialSalesData);

  // Sync to local storage for persistence across reloads
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

  // Connect socket on mount & setup real-time event listeners
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
    };

    socketService.on('newOrder', handleNewOrder);
    socketService.on('orderStatusChanged', handleStatusUpdate);

    return () => {
      socketService.off('newOrder', handleNewOrder);
      socketService.off('orderStatusChanged', handleStatusUpdate);
    };
  }, []);

  // --- Order Actions ---
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

    // Try background API sync
    api.createOrder(orderRecord).catch(() => {});
    return orderRecord;
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.orderId === orderId ? { ...ord, status: newStatus } : ord))
    );
    socketService.emit('orderStatusChanged', { orderId, status: newStatus });

    // Deduct stock if order marked Collected
    if (newStatus === 'Collected') {
      const order = orders.find((o) => o.orderId === orderId);
      if (order) {
        order.items?.forEach((itm) => {
          // If bun / chicken / ingredient mapped
          if (itm.name.toLowerCase().includes('burger')) {
            deductInventoryByName('Burger Buns', itm.quantity);
          }
          if (itm.name.toLowerCase().includes('paneer')) {
            deductInventoryByName('Paneer (Cottage Cheese)', itm.quantity * 0.1);
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

  // --- Menu Actions ---
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

  // --- Inventory Actions ---
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

  // --- Staff Actions ---
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

  // Metrics
  const activeOrdersCount = orders.filter(
    (o) => o.status === 'Pending' || o.status === 'Preparing'
  ).length;

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
