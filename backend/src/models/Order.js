import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  itemId: { type: String, required: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
  category: { type: String, default: 'Food' },
  customization: { type: String, default: '' }
});

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      unique: true,
      required: true
    },
    tokenNumber: {
      type: String,
      required: true
    },
    studentId: {
      type: String,
      default: null
    },
    guestSessionId: {
      type: String,
      default: null
    },
    customerName: {
      type: String,
      default: 'Walk-in Customer'
    },
    items: [orderItemSchema],
    totalAmount: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['Pending', 'Preparing', 'Ready', 'Collected', 'Cancelled'],
      default: 'Pending'
    },
    priority: {
      type: String,
      enum: ['Normal', 'Quick', 'Bulk', 'VIP'],
      default: 'Normal'
    },
    paymentMethod: {
      type: String,
      enum: ['Cash', 'Online'],
      default: 'Cash'
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Refunded'],
      default: 'Pending'
    },
    specialInstructions: {
      type: String,
      default: ''
    },
    refundReason: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

export const Order = mongoose.model('Order', orderSchema);
export default Order;
