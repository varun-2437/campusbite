import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'campusbite_super_secret_jwt_key_2026';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization token missing or malformed' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    // If guest session
    if (decoded.isGuest) {
      req.user = { isGuest: true, sessionId: decoded.sessionId, role: 'guest' };
      return next();
    }

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token', error: err.message });
  }
};

export const verifyRole = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthenticated user' });
    }

    // Manager has unrestricted access
    if (req.user.role === 'manager' || allowedRoles.includes(req.user.role)) {
      return next();
    }

    return res.status(403).json({
      message: `Access denied. Role '${req.user.role}' lacks permission for this endpoint.`
    });
  };
};
