import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true
    },
    studentName: {
      type: String,
      default: 'Student'
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      unique: true,
      required: true,
      uppercase: true,
      trim: true
    },
    discountValue: {
      type: Number,
      required: true
    },
    discountType: {
      type: String,
      enum: ['percentage', 'flat'],
      default: 'flat'
    },
    minOrderAmount: {
      type: Number,
      default: 0
    },
    expiryDate: {
      type: Date,
      required: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export const Feedback = mongoose.model('Feedback', feedbackSchema);
export const Coupon = mongoose.model('Coupon', couponSchema);
