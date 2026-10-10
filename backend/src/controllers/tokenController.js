import { Token } from '../models/Token.js';
import { Order } from '../models/Order.js';

export const generateToken = async (req, res) => {
  try {
    const { orderId } = req.body;
    if (!orderId) return res.status(400).json({ message: 'Order ID is required' });

    const order = await Order.findOne({ orderId });
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const tokenId = order.tokenNumber || `TK-${Math.floor(100 + Math.random() * 900)}`;
    const qrData = `CAMPUSBITE-${orderId}-${tokenId}`;

    const token = await Token.create({
      tokenId,
      orderId,
      qrCode: qrData
    });

    res.status(201).json({ message: 'Token generated', token });
  } catch (err) {
    res.status(500).json({ message: 'Token generation failed', error: err.message });
  }
};

export const verifyToken = async (req, res) => {
  try {
    const { tokenId } = req.body;
    if (!tokenId) return res.status(400).json({ message: 'Token ID is required' });

    const token = await Token.findOne({ tokenId: tokenId.toUpperCase() });

    if (!token) {
      return res.status(404).json({ message: 'Invalid or unknown token' });
    }

    if (token.isUsed) {
      return res.status(400).json({
        message: 'Security Alert: This token has already been redeemed / used',
        usedAt: token.usedAt
      });
    }

    token.isUsed = true;
    token.usedAt = new Date();
    await token.save();

    // Mark corresponding order collected
    await Order.findOneAndUpdate({ orderId: token.orderId }, { status: 'Collected' });

    if (req.io) {
      req.io.emit('orderStatusChanged', { orderId: token.orderId, status: 'Collected' });
    }

    res.json({
      message: 'Token verified successfully. Hand over order to student.',
      tokenId: token.tokenId,
      orderId: token.orderId
    });
  } catch (err) {
    res.status(500).json({ message: 'Token verification failed', error: err.message });
  }
};
