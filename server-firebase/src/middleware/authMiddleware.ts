import { Request, Response, NextFunction } from 'express';
import * as AuthController from '../controllers/auth';
import * as UserController from '../controllers/user';

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: 'Invalid token' });
  }
  try {
    // Get user based on auth token
    if (token === undefined) throw new Error('Authentication token is missing.');
    const uid = await AuthController.verifyToken(token);
    const user = await UserController.getUserById(uid);
    if (!user) throw new Error('User not found.');
    // Add the user to the req object to be used in other routes
    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export default authMiddleware;
