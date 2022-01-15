import * as express from "express";
import * as AuthController from "../controllers/auth";
import * as UserController from "../controllers/user";

const router = express.Router();

// Routes
router.get("/fetchAccounts", async (req: express.Request, res: express.Response) => {
    const token = req?.headers?.authorization;
    try {
      // Get user based on auth token
      if (token === undefined) throw new Error("User auth token is missing.");
      const uid = await AuthController.verifyToken(token);
      const user = await UserController.getUserById(uid);
      if (!user) throw new Error("User is missing or deleted.");
      // Update user accounts
      await UserController.fetchAndUpdateAccounts(user);
      // Respond with success
      return res.sendStatus(200);
    } catch (error) {
      return res.status(400).json(error);
    }
  });

export default router;