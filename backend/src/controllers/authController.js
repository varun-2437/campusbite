import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'campusbite_super_secret_jwt_key_2026';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

export const register = async (req, res) => {
  try {
    const { name, email, password, studentId } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    // Validate college email domain if required
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: 'Email address already registered' });
    }

    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: 'student',
      studentId: studentId || `STU-${Date.now().toString().slice(-4)}`,
      loyaltyPoints: 0
    });

    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email, role: newUser.role, studentId: newUser.studentId },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.status(201).json({
      message: 'Student registration successful',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        studentId: newUser.studentId,
        loyaltyPoints: newUser.loyaltyPoints
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    let user = await User.findOne({ email: email.toLowerCase() });

    // Auto-seed demo staff account if testing locally without pre-existing DB
    if (!user && (email.includes('campusbite.com') || role)) {
      user = await User.create({
        name: `${(role || 'staff').toUpperCase()} User`,
        email: email.toLowerCase(),
        password,
        role: role || 'manager',
        active: true
      });
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.active) {
      return res.status(403).json({ message: 'Account has been deactivated. Contact manager.' });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
        name: user.name,
        studentId: user.studentId
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentId: user.studentId,
        loyaltyPoints: user.loyaltyPoints
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

export const guestSession = async (req, res) => {
  try {
    const sessionId = `GUEST-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const token = jwt.sign(
      { isGuest: true, sessionId, role: 'guest' },
      JWT_SECRET,
      { expiresIn: '2h' } // 2-hour temporary guest session
    );

    res.json({
      message: 'Temporary guest session issued',
      token,
      sessionId,
      role: 'guest'
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to issue guest token', error: err.message });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ message: 'Token required' });

    const decoded = jwt.verify(token, JWT_SECRET, { ignoreExpiration: true });
    const newToken = jwt.sign(
      {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
        studentId: decoded.studentId
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({ token: newToken });
  } catch (err) {
    res.status(401).json({ message: 'Failed to refresh token', error: err.message });
  }
};

export const logout = (req, res) => {
  res.json({ message: 'Logged out successfully' });
};
