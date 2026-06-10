import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { sendJsonResponse } from '../config/Util.js';
import { User } from '../models/User.js';

export const protect = async (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendJsonResponse(req, _res, null, 'Authentication required', 401, false);
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return sendJsonResponse(req, _res, null, 'User no longer exists', 401, false);
    }

    req.user = user;
    return next();
  } catch (_error) {
    return sendJsonResponse(req, _res, null, 'Invalid or expired token', 401, false);
  }
};
