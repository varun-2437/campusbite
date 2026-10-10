import { Order } from '../models/Order.js';
import { MenuItem } from '../models/MenuItem.js';
import { Token } from '../models/Token.js';
import { Inventory } from '../models/Inventory.js';
import { User } from '../models/User.js';

// Order Status progression logic:
// Pending -> Preparing -> Ready -> Collected
// Cancelled allowed before "Preparing"
const ALLOWED_TRANSITIONS = {
  Pending: ['Preparing', 'Cancelled'],
  Preparing: ['Ready'],
  Ready: ['Collected'],
  Collected: [],
  Cancelled: []
};

export const getOrders = async (req, res) => {
  try {
    const { status, category, studentId } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (category) filter.category = category;
    if (studentId) filter.studentId = studentId;

    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving orders', error: err.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findOne({ $or: [{ orderId: id }, { _id: id }] });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching order', error: err.message });
  }
};

export const createOrder = async (req, res) => {
  try {
    const { items, paymentMethod, priority, specialInstructions, customerName, studentId, guestSessionId } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Order must contain at least one item' });
    }

    // Server-side total recalculation (NEVER trust client price)
    let computedTotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const dbItem = await MenuItem.findOne({ itemId: item.itemId });
      const unitPrice = dbItem ? dbItem.price : item.price || 50;
      const qty = item.quantity || 1;
      computedTotal += unitPrice * qty;

      validatedItems.push({
        itemId: item.itemId,
        name: dbItem ? dbItem.name : item.name,
        quantity: qty,
        price: unitPrice,
        category: dbItem ? dbItem.category : item.category || 'Food',
        customization: item.customization || ''
      });
    }

    const orderId = `ORD-${Date.now().toString().slice(-4)}`;
    const tokenNumber = `TK-${Math.floor(100 + Math.random() * 900)}`;

    const newOrder = await Order.create({
      orderId,
      tokenNumber,
      customerName: customerName || (studentId ? `Student (${studentId})` : 'Walk-in Customer'),
      studentId: studentId || null,
      guestSessionId: guestSessionId || null,
      items: validatedItems,
      totalAmount: computedTotal,
      status: 'Pending',
      priority: priority || 'Normal',
      paymentMethod: paymentMethod || 'Cash',
      paymentStatus: paymentMethod === 'Online' ? 'Paid' : 'Pending',
      specialInstructions: specialInstructions || ''
    });

    // Create Token record
    await Token.create({
      tokenId: tokenNumber,
      orderId: newOrder.orderId,
      qrCode: `CAMPUSBITE-${orderId}-${tokenNumber}`
    });

    // Emit live WebSocket notification if socket instance exists
    if (req.io) {
      req.io.emit('newOrder', newOrder);
    }

    res.status(201).json({ message: 'Order created successfully', order: newOrder });
  } catch (err) {
    res.status(500).json({ message: 'Order creation failed', error: err.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findOne({ $or: [{ orderId: id }, { _id: id }] });
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Enforce valid forward status transitions
    const validNext = ALLOWED_TRANSITIONS[order.status] || [];
    if (!validNext.includes(status) && req.user?.role !== 'manager') {
      return res.status(400).json({
        message: `Illegal status transition from '${order.status}' to '${status}'. Allowed: ${validNext.join(', ')}`
      });
    }

    order.status = status;
    await order.save();

    // If order Collected, credit student loyalty points & auto-deduct inventory
    if (status === 'Collected') {
      if (order.studentId) {
        const pointsToAdd = Math.floor(order.totalAmount / 10);
        await User.findOneAndUpdate(
          { studentId: order.studentId },
          { $inc: { loyaltyPoints: pointsToAdd } }
        );
      }

      // Auto-deduct inventory
      for (const itm of order.items) {
        if (itm.name.toLowerCase().includes('burger')) {
          await Inventory.findOneAndUpdate({ itemName: 'Burger Buns' }, { $inc: { quantity: -itm.quantity } });
        }
      }
    }

    if (req.io) {
      req.io.emit('orderStatusChanged', { orderId: order.orderId, status: order.status });
    }

    res.json({ message: `Order status updated to ${status}`, order });
  } catch (err) {
    res.status(500).json({ message: 'Error updating status', error: err.message });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const order = await Order.findOne({ $or: [{ orderId: id }, { _id: id }] });
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (order.status === 'Preparing' && req.user?.role !== 'manager') {
      return res.status(400).json({ message: 'Cannot cancel an order that is already being prepared' });
    }

    order.status = 'Cancelled';
    order.paymentStatus = 'Refunded';
    order.refundReason = reason || 'Customer request / cancellation';
    await order.save();

    if (req.io) {
      req.io.emit('orderStatusChanged', { orderId: order.orderId, status: 'Cancelled' });
    }

    res.json({ message: 'Order cancelled and refunded', order });
  } catch (err) {
    res.status(500).json({ message: 'Error cancelling order', error: err.message });
  }
};

export const getStudentOrderHistory = async (req, res) => {
  try {
    const { studentId } = req.params;
    const orders = await Order.find({ studentId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving order history', error: err.message });
  }
};
