import jwt from 'jsonwebtoken';
import UserModel from '../models/userModel';
import { WEB_TOKEN_SECRET } from './secrets';

// Middleware to lock resource if not authenticated
export const ensureAuthenticated = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedUser = jwt.verify(token, WEB_TOKEN_SECRET);
    const user = await UserModel.findById(decodedUser.id);
    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json([{ message: 'Authentication failed.' }]);
  }
};

// Create a secure JSON WebToken
export const createToken = payload =>
  jwt.sign(payload, WEB_TOKEN_SECRET, {
    expiresIn: '7d'
  });
