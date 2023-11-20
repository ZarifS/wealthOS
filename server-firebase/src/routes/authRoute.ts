import * as express from 'express';
import * as AuthController from '../controllers/auth';

const router = express.Router();

router.post('/signUp', async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    const token = await AuthController.signUpWithEmail(email, password, firstName, lastName);
    return res.json({
      token: token,
    });
  } catch (error) {
    return res.status(400).json(error);
  }
});

router.post('/signIn', async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;
    const token = await AuthController.signInWithEmail(email, password);
    return res.json({
      token: token,
    });
  } catch (error) {
    return res.status(400).json(error);
  }
});

router.post('/verifyToken', async (req: express.Request, res: express.Response) => {
  try {
    const token = req?.headers?.authorization;
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
