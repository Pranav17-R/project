import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.id, role: payload.role };
    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

export async function attachUser(req, res, next) {
  if (!req.user?.id) return next();
  const user = await User.findById(req.user.id).select('-passwordHash');
  req.currentUser = user || null;
  next();
}

export function requireRole(requiredRole) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    if (req.user.role !== requiredRole) return res.status(403).json({ message: 'Forbidden' });
    next();
  };
}






