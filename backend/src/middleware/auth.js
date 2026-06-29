import { verifyToken } from '../config/jwt.js';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (decoded.role === 'super_admin') {
      req.user = { id: 'super_admin', role: 'super_admin', email: decoded.email };
      return next();
    }

    const user = await User.findById(decoded.id).populate('organisation');
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found.' });
    }

    req.user = {
      id: user._id,
      role: user.role,
      email: user.email,
      name: user.name,
      organisation: user.organisation,
    };
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: 'Invalid token.' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token expired.' });
    }
    next(error);
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${roles.join(' or ')}.`,
      });
    }
    next();
  };
};