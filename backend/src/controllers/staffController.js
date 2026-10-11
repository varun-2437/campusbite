import { User } from '../models/User.js';

export const getStaffList = async (req, res) => {
  try {
    const staff = await User.find({
      role: { $in: ['cashier', 'kitchen', 'beverage', 'counter', 'manager'] }
    }).select('-password').sort({ createdAt: -1 });
    res.json(staff);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving staff list', error: err.message });
  }
};

export const createStaffAccount = async (req, res) => {
  try {
    const { name, email, password = 'password123', role, shift = 'Morning', approvalStatus = 'approved' } = req.body;

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
      active: approvalStatus === 'approved',
      approvalStatus
    });

    res.status(201).json({
      message: 'Staff account created successfully',
      staff: {
        id: staffMember._id,
        name: staffMember.name,
        email: staffMember.email,
        role: staffMember.role,
        shift: staffMember.shift,
        active: staffMember.active,
        approvalStatus: staffMember.approvalStatus
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create staff account', error: err.message });
  }
};

export const approveStaffAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const staffMember = await User.findById(id);

    if (!staffMember) {
      return res.status(404).json({ message: 'Staff member not found' });
    }

    staffMember.approvalStatus = 'approved';
    staffMember.active = true;
    staffMember.approvedBy = req.user?.name || 'Store Manager';
    await staffMember.save();

    res.json({
      message: `${staffMember.name} has been approved for ${staffMember.role.toUpperCase()} access!`,
      staff: {
        id: staffMember._id,
        name: staffMember.name,
        email: staffMember.email,
        role: staffMember.role,
        active: staffMember.active,
        approvalStatus: staffMember.approvalStatus
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to approve staff account', error: err.message });
  }
};

export const rejectStaffAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const staffMember = await User.findById(id);

    if (!staffMember) {
      return res.status(404).json({ message: 'Staff member not found' });
    }

    staffMember.approvalStatus = 'rejected';
    staffMember.active = false;
    await staffMember.save();

    res.json({
      message: `${staffMember.name}'s account application has been declined.`,
      staff: {
        id: staffMember._id,
        name: staffMember.name,
        approvalStatus: staffMember.approvalStatus
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to reject staff account', error: err.message });
  }
};

export const toggleStaffStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const staffMember = await User.findById(id);

    if (!staffMember) {
      return res.status(404).json({ message: 'Staff member not found' });
    }

    staffMember.active = !staffMember.active;
    await staffMember.save();

    res.json({
      message: `Staff member ${staffMember.name} is now ${staffMember.active ? 'ACTIVE' : 'DEACTIVATED'}`,
      active: staffMember.active
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to toggle status', error: err.message });
  }
};
