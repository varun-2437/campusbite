import { User } from '../models/User.js';

export const getStaffList = async (req, res) => {
  try {
    const staff = await User.find({
      role: { $in: ['cashier', 'kitchen', 'beverage', 'counter', 'manager'] }
    }).select('-password');
    res.json(staff);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving staff list', error: err.message });
  }
};

export const createStaffAccount = async (req, res) => {
  try {
    const { name, email, password = 'password123', role, shift = 'Morning' } = req.body;

    if (!name || !email || !role) {
      return res.status(400).json({ message: 'Name, email, and role are required' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: 'Staff member with this email already exists' });
    }

    const staffMember = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role,
      shift,
      staffId: `STF-${Date.now().toString().slice(-4)}`,
      active: true
    });

    res.status(201).json({
      message: 'Staff account created successfully',
      staff: {
        id: staffMember._id,
        name: staffMember.name,
        email: staffMember.email,
        role: staffMember.role,
        shift: staffMember.shift,
        active: staffMember.active
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create staff account', error: err.message });
  }
};
