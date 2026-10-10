import { Order } from '../models/Order.js';
import { Payment } from '../models/Payment.js';
import { Token } from '../models/Token.js';

export const verifyCashPayment = async (req, res) => {
  try {
    const { tokenId, orderId } = req.body;
    const searchTarget = (tokenId || orderId || '').trim();

    if (!searchTarget) {
      return res.status(400).json({ message: 'Token ID or Order ID is required' });
    }

    const order = await Order.findOne({
      $or: [{ tokenNumber: searchTarget.toUpperCase() }, { orderId: searchTarget.toUpperCase() }]
    });

    if (!order) {
      return res.status(404).json({ message: 'Matching order not found' });
    }

    order.paymentStatus = 'Paid';
    await order.save();

    await Payment.create({
      paymentId: `PAY-${Date.now().toString().slice(-4)}`,
      orderId: order.orderId,
      method: 'Cash',
      amount: order.totalAmount,
      status: 'Paid',
      verifiedByStaffId: req.user?.userId || 'CASHIER'
    });

    if (req.io) {
      req.io.emit('paymentConfirmed', { orderId: order.orderId, tokenId: order.tokenNumber });
    }

    res.json({
      message: `Cash payment confirmed for Token ${order.tokenNumber}`,
      orderId: order.orderId,
      tokenNumber: order.tokenNumber,
      totalAmount: order.totalAmount
    });
  } catch (err) {
    res.status(500).json({ message: 'Cash verification failed', error: err.message });
  }
};

export const razorpayWebhook = async (req, res) => {
  try {
    const { event, payload } = req.body;

    // Idempotency check: process payment.captured
    if (event === 'payment.captured' && payload?.payment?.entity) {
      const pEntity = payload.payment.entity;
      const rOrderId = pEntity.order_id;

      const order = await Order.findOne({ orderId: rOrderId });
      if (order && order.paymentStatus !== 'Paid') {
        order.paymentStatus = 'Paid';
        await order.save();

        await Payment.create({
          paymentId: pEntity.id,
          orderId: order.orderId,
          method: 'Online',
          amount: pEntity.amount / 100,
          status: 'Paid',
          razorpayPaymentId: pEntity.id,
          razorpayOrderId: rOrderId
        });

        if (req.io) {
          req.io.emit('paymentConfirmed', { orderId: order.orderId, tokenId: order.tokenNumber });
        }
      }
    }

    // Always acknowledge webhook with 200 OK
    res.status(200).json({ status: 'ok' });
  } catch (err) {
    res.status(500).json({ message: 'Webhook processing error', error: err.message });
  }
};
