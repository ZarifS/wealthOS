import * as express from 'express';

const router = express.Router();

router.get('/', async (req: express.Request, res: express.Response) => {
  try {
    const user = req.user;
    return res.json(user);
  } catch (error) {
    return res.status(400).json(error);
  }
});

export default router;
