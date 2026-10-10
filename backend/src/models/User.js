import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['student', 'guest', 'cashier', 'kitchen', 'beverage', 'counter', 'manager'],
      default: 'student'
    },
    // RegisteredStudent specifics
    studentId: {
      type: String,
      trim: true
    },
    loyaltyPoints: {
      type: Number,
      default: 0
    },
    // Staff specifics
    staffId: {
      type: String,
      trim: true
    },
    assignedCounter: {
      type: String
    },
    shift: {
      type: String,
      default: 'Morning'
    },
    active: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password helper
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model('User', userSchema);
export default User;
