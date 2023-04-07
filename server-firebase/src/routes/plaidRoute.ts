import * as express from 'express';
// import * as AuthController from '../controllers/auth';
// import * as PlaidController from '../controllers/plaid';
// import * as UserController from '../controllers/user';
// import * as ItemController from '../controllers/itemLinks';

const router = express.Router();

// // Routes
// router.get('/publicToken', async (req: express.Request, res: express.Response) => {
//   try {
//     const { institutionId, products } = req.body;
//     const token = await PlaidController.createPublicToken(institutionId, products);
//     return res.json({
//       publicToken: token,
//     });
//   } catch (error) {
//     return res.status(400).json(error);
//   }
// });

// router.post('/linkUser', async (req: express.Request, res: express.Response) => {
//   // Grab public token from body
//   const token = req?.headers?.authorization;
//   const { publicToken, institutionName, institutionId } = req.body;
//   try {
//     // Get user based on auth token
//     if (token === undefined) throw new Error('User auth token is missing.');
//     const uid = await AuthController.verifyToken(token);
//     const user = await UserController.getUserById(uid);
//     if (!user) throw new Error('User is missing or deleted.');

//     // Exchange public token for item access
//     const { itemId, accessToken } = await PlaidController.exchangeToken(publicToken);

//     // Add a new item link mapping itemId to the user (for webhook updates)
//     await ItemController.createLink(uid, itemId);

//     // Add item and access to the user doc to allow syncing
//     const links = user.links;
//     links[itemId] = { accessToken, institutionName, institutionId };
//     await UserController.updateUser(uid, { links });

//     // Respond with success
//     return res.sendStatus(200);
//   } catch (error) {
//     return res.status(400).json(error);
//   }
// });

export default router;
