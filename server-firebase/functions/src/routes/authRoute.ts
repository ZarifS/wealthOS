import * as express from "express";
import * as AuthController from "../controllers/auth";

const router = express.Router();

// Routes
router.post("/sign-up", async (req: express.Request, res: express.Response) => {
    try {
      const {email, password} = req.body;
      const token = await AuthController.signUpViaEmail(email, password);
      return res.json({
        token: token,
      });
    } catch (error) {
      return res.status(400).json(error);
    }
  });
  
router.post("/sign-in", async (req: express.Request, res: express.Response) => {
try {
    const {email, password} = req.body;
    const token = await AuthController.signInViaEmail(email, password);
    return res.json({
    token: token,
    });
} catch (error) {
    return res.status(400).json(error);
}
});

router.post("/verifyToken", async (req: express.Request, res: express.Response) => {
const token = req?.headers?.authorization;
console.log(token);
if (token) {
    const uid = await AuthController.verifyToken(token);
    res.json({
    userId: uid,
    });
} else res.status(401).send();
});

export default router;
