import * as express from 'express';
import * as cors from 'cors';
import * as morgan from 'morgan';
import { functions } from './utils/firebase';
import AuthRouter from './routes/authRoute';
import PlaidRouter from './routes/plaidRoute';
import UserRouter from './routes/userRoute';

const app: express.Application = express();

// App Middleware
app.use(morgan('tiny')); //Logger for requests
app.use(cors({ origin: true })); //Enable CORS
//TO-DO Add User Auth Middleware

// Routes
app.use('/auth', AuthRouter);
app.use('/plaid', PlaidRouter);
app.use('/user', UserRouter);

exports.app = functions.https.onRequest(app);
