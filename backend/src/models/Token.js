import mongoose from 'mongoose';

const tokenSchema = new mongoose.Schema(
  {
    tokenId: {
      type: String,
      unique: true,
      required: true
    },
    orderId: {
      type: String,
      required: true
    },
    qrCode: {
      type: String,
      default: ''
    },
    isUsed: {
      type: Boolean,
      default: false
    },
    generatedAt: {
      type: Date,
      default: Date.now
    },
    usedAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

export const Token = mongoose.model('Token', tokenSchema);
export default Token;
