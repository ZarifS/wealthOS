import * as express from 'express';
import * as SpacesController from '../controllers/spaces';
import authMiddleware from '../middleware/authMiddleware';

const router = express.Router();

// Middleware to verify user authentication
router.use(authMiddleware);

// Route to get space information by ID
router.get('/:spaceId', async (req: express.Request, res: express.Response) => {
  try {
    const spaceId = req.params.spaceId;
    const space = await SpacesController.getSpaceById(spaceId);
    return res.status(200).json(space);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

// Route to create a new space
router.post('/', async (req: express.Request, res: express.Response) => {
  try {
    const spaceData = req.body;
    const newSpace = await SpacesController.createSpace(req.user.uuid, spaceData);
    return res.status(201).json(newSpace);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

// Route to add users to an existing space
router.post('/addUsers', async (req: express.Request, res: express.Response) => {
  try {
    const { spaceId, userIds } = req.body;
    const editorId = req.user.uuid;
    await SpacesController.addUsersToSpace(editorId, spaceId, userIds);
    return res.status(200).json({ message: 'Users added successfully.' });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

export default router;
