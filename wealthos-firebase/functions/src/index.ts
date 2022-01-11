import * as express from "express";
import * as cors from "cors";
import * as morgan from "morgan";
import {functions} from "./utils/firebase";
import * as UserController from "./controllers/user";
import * as AuthController from "./controllers/auth";
import * as PlaidController from "./controllers/plaid";
import * as ItemController from "./controllers/itemLinks";


const app: express.Application = express();

// App Middleware
app.use(morgan("tiny"));
app.use(cors({origin: true}));


// Routes
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

app.post("/verifyToken", async (req: express.Request, res: express.Response) => {
  const token = req?.headers?.authorization;
  console.log(token);
  if (token) {
    const uid = await AuthController.verifyToken(token);
    res.json({
      userId: uid,
    });
  } else res.status(401).send();
});

app.get("/publicToken", async (req: express.Request, res: express.Response) => {
  try {
    const {institutionId, products} = req.body;
    const token = await PlaidController.createPublicToken(institutionId, products);
    return res.json({
      publicToken: token,
    });
  } catch (error) {
    return res.status(400).json(error);
  }
});

app.post("/linkUser", async (req: express.Request, res: express.Response) => {
  // Grab public token from body
  const token = req?.headers?.authorization;
  const {publicToken, institutionName} = req.body;
  try {
    // Get user based on auth token
    if (token === undefined) throw new Error("User auth token is missing.");
    const uid = await AuthController.verifyToken(token);
    const user = await UserController.getUserById(uid);
    if (!user) throw new Error("User is missing or deleted.");

    // Exchange public token for item access
    const {itemId, accessToken} = await PlaidController.exchangeToken(publicToken);

    // Add a new item link mapping itemId to the user (for webhook updates)
    await ItemController.createLink(uid, itemId);

    // Add item and access to the user doc to allow syncing
    const links = user.links;
    links[itemId] = {accessToken, institutionName};
    await UserController.updateUser(uid, {links});

    // Respond with success
    return res.sendStatus(200);
  } catch (error) {
    return res.status(400).json(error);
  }
});

app.get("/userAccounts", async (req: express.Request, res: express.Response) => {
  const token = req?.headers?.authorization;
  try {
    // Get user based on auth token
    if (token === undefined) throw new Error("User auth token is missing.");
    const uid = await AuthController.verifyToken(token);
    const user = await UserController.getUserById(uid);
    if (!user) throw new Error("User is missing or deleted.");
    // TODO
    // accounts = await UserController.getAccounts(user);
    // Respond with success
    return res.sendStatus(200);
  } catch (error) {
    return res.status(400).json(error);
  }
});

exports.app = functions.https.onRequest(app);
