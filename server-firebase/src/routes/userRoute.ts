import * as express from 'express';
import * as UserController from '../controllers/user';
import AuthMiddleware from '../middleware/authMiddleware';
const router = express.Router();

// Create a new user
router.post('/', async (req: express.Request, res: express.Response) => {
  try {
    const { authUid, email, firstName, lastName } = req.body;
    await UserController.createUser(authUid, { email, firstName, lastName });
    return res.json({ message: 'User created successfully.' });
  } catch (error) {
    return res.status(400).json(error);
  }
});

// Get user by id, requires auth token
router.get('/', AuthMiddleware, async (req: express.Request, res: express.Response) => {
  try {
    const user = req.user;
    return res.json(user);
  } catch (error) {
    return res.status(400).json(error);
  }
});

export default router;
