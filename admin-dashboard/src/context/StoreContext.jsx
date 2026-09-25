import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  initialMenuItems,
  initialOrders,
  initialInventory,
  initialStaffAccounts,
  initialFeedback,
  initialSalesData
} from '../services/mockData';

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

  const [feedbackList] = useState(initialFeedback);
  const [salesData] = useState(initialSalesData);

  // Sync to local storage
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

  // Order actions
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
    return orderRecord;
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.orderId === orderId ? { ...ord, status: newStatus } : ord))
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
    return found;
  };

  // Menu actions
  const toggleItemAvailability = (itemId) => {
    setMenu((prev) =>
      prev.map((item) =>
        item.itemId === itemId ? { ...item, isAvailable: !item.isAvailable } : item
      )
    );
  };

  const addMenuItem = (item) => {
    const newItem = {
      itemId: `m${Date.now().toString().slice(-4)}`,
      ...item
    };
    setMenu((prev) => [...prev, newItem]);
  };

  const updateMenuItem = (itemId, updatedFields) => {
    setMenu((prev) =>
      prev.map((item) => (item.itemId === itemId ? { ...item, ...updatedFields } : item))
    );
  };

  const deleteMenuItem = (itemId) => {
    setMenu((prev) => prev.filter((item) => item.itemId !== itemId));
  };

  // Inventory actions
  const updateInventoryStock = (id, newQuantity, newThreshold) => {
    setInventory((prev) =>
      prev.map((inv) =>
        inv.id === id ? { ...inv, quantity: Number(newQuantity), threshold: Number(newThreshold) } : inv
      )
    );
  };

  // Staff actions
  const toggleStaffStatus = (id) => {
    setStaffList((prev) =>
      prev.map((st) => (st.id === id ? { ...st, active: !st.active } : st))
    );
  };

  const addStaffAccount = (staff) => {
    setStaffList((prev) => [
      ...prev,
      { id: `st-${Date.now().toString().slice(-4)}`, active: true, ...staff }
    ]);
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
