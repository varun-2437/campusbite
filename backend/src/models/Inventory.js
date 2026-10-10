import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema(
  {
    itemName: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    quantity: {
      type: Number,
      required: true,
      default: 0
    },
    threshold: {
      type: Number,
      required: true,
      default: 10
    },
    unit: {
      type: String,
      default: 'units'
    },
    category: {
      type: String,
      default: 'General'
    }
  },
  { timestamps: true }
);

export const Inventory = mongoose.model('Inventory', inventorySchema);
export default Inventory;
