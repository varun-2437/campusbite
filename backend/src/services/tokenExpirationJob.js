/**
 * Cash Token Auto-Expiration Cleaner Job
 * Cancels and cleans up unpaid cash orders after 15 minutes of inactivity.
 */

import { Order } from '../models/Order.js';

export const startTokenExpirationJob = (io, intervalMs = 60000) => {
  console.log('[Scheduler] Cash Token Auto-Expiration background monitor started.');

  setInterval(async () => {
    try {
      const expirationThreshold = new Date(Date.now() - 15 * 60 * 1000); // 15 mins ago

      const expiredUnpaidOrders = await Order.find({
        paymentMethod: 'Cash',
        paymentStatus: 'Pending',
        status: 'Pending',
        createdAt: { $lt: expirationThreshold }
      });

      for (const order of expiredUnpaidOrders) {
        order.status = 'Cancelled';
        order.refundReason = 'Auto-cancelled: Cash payment not verified within 15 minutes.';
        await order.save();

        console.log(`[Token Cleaner] Expired unpaid token ${order.tokenNumber} (${order.orderId})`);

        if (io) {
          io.emit('orderStatusChanged', { orderId: order.orderId, status: 'Cancelled' });
        }
      }
    } catch (e) {
      // In standalone dev without Mongo, keep quiet
    }
  }, intervalMs);
};
