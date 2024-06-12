import * as express from 'express';
import * as AuthController from '../controllers/auth';

const router = express.Router();

router.post('/verifyToken', async (req: express.Request, res: express.Response) => {
  try {
    console.log('In verifyToken route...');
    const token = req?.headers?.authorization;
    console.log('Token:', token);
    if (token) {
      const uid = await AuthController.verifyToken(token);
      return res.json({
        userId: uid,
      });
    } else return res.status(400).json({ error: 'No token provided.' });
  } catch (error) {
    return res.status(400).json(error);
  }
});

export default router;
