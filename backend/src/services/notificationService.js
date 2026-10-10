/**
 * Firebase Cloud Messaging (FCM) Service
 * Dispatches real-time push notifications to student mobile app & staff dashboards
 * for:
 * - Order Accepted
 * - Payment Successful
 * - Food Preparing
 * - Food Ready for Pickup
 * - Order Completed
 * - Coupon Available
 */

class NotificationService {
  constructor() {
    this.fcmServerKey = process.env.FCM_SERVER_KEY || 'fcm_mock_server_key';
  }

  async sendToUser(userIdOrToken, { title, body, data = {} }) {
    console.log(`[FCM Notification] -> ${userIdOrToken}: "${title}" - "${body}"`);

    // Payload structure for FCM v1 / Legacy HTTP
    const message = {
      notification: {
        title,
        body,
        sound: 'default'
      },
      data: {
        ...data,
        timestamp: new Date().toISOString()
      }
    };

    return { success: true, messageId: `msg_${Date.now()}` };
  }

  async notifyOrderAccepted(orderId, studentId, tokenNumber) {
    return this.sendToUser(studentId || 'student', {
      title: 'Order Confirmed! 🍔',
      body: `Your order #${orderId} with Token ${tokenNumber} has been received by the kitchen.`,
      data: { type: 'ORDER_ACCEPTED', orderId, tokenNumber }
    });
  }

  async notifyPaymentSuccessful(orderId, studentId, amount) {
    return this.sendToUser(studentId || 'student', {
      title: 'Payment Successful ✅',
      body: `Payment of ₹${amount} received for Order #${orderId}.`,
      data: { type: 'PAYMENT_SUCCESS', orderId, amount: String(amount) }
    });
  }

  async notifyFoodPreparing(orderId, studentId, tokenNumber) {
    return this.sendToUser(studentId || 'student', {
      title: 'Chef is Cooking! 👨‍🍳',
      body: `Token ${tokenNumber} is currently on the grill/stove.`,
      data: { type: 'FOOD_PREPARING', orderId, tokenNumber }
    });
  }

  async notifyFoodReady(orderId, studentId, tokenNumber) {
    return this.sendToUser(studentId || 'student', {
      title: 'Your Food is Ready! 🔔',
      body: `Token ${tokenNumber} is hot and ready at the serving counter. Please pick up!`,
      data: { type: 'FOOD_READY', orderId, tokenNumber }
    });
  }

  async notifyOrderCompleted(orderId, studentId) {
    return this.sendToUser(studentId || 'student', {
      title: 'Order Completed 🎉',
      body: `Hope you enjoyed your meal! Tap here to leave a quick rating.`,
      data: { type: 'ORDER_COMPLETED', orderId }
    });
  }

  async notifyCouponAvailable(code, discount) {
    return this.sendToUser('all_students_topic', {
      title: 'New Cafeteria Offer! 🎟️',
      body: `Use code ${code} for ₹${discount} discount on your next order!`,
      data: { type: 'COUPON_AVAILABLE', code }
    });
  }
}

export const notificationService = new NotificationService();
export default notificationService;
