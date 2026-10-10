import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema(
  {
    itemId: {
      type: String,
      unique: true,
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    category: {
      type: String,
      enum: ['Food', 'Beverage', 'Snacks', 'Desserts', 'Breakfast', 'Lunch'],
      default: 'Food'
    },
    isAvailable: {
      type: Boolean,
      default: true
    },
    prepTime: {
      type: Number,
      default: 10
    },
    isVeg: {
      type: Boolean,
      default: true
    },
    imageUrl: {
      type: String,
      default: ''
    },
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export const MenuItem = mongoose.model('MenuItem', menuItemSchema);
export default MenuItem;
