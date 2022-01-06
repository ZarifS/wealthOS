import * as express from "express";
import * as cors from "cors";
import * as morgan from "morgan";
import {functions} from "./utils/firebase";
import * as UserController from "./controllers/user";
import * as AuthController from "./controllers/auth";


const app: express.Application = express();

// Logger Middleware
app.use(morgan("tiny"));

app.use(cors({origin: true}));

// Routes
app.get("/users", async (req: express.Request, res: express.Response) => {
  const users = await UserController.getAllUsers();
  return res.json(users);
});

app.post("/user", async (req: express.Request, res: express.Response) => {
  try {
    const {email, firstName, lastName, userId} = req.body;
    await UserController.createUser(userId, {email, firstName, lastName});
    return res.status(200).send();
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});


app.post("/sign-up", async (req: express.Request, res: express.Response) => {
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

app.post("/sign-in", async (req: express.Request, res: express.Response) => {
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


exports.app = functions.https.onRequest(app);
