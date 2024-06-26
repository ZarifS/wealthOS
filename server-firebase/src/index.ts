import * as express from 'express';
import * as cors from 'cors';
import * as morgan from 'morgan';
import { functions } from './utils/firebase';
import AuthRouter from './routes/authRoute';
import UserRouter from './routes/userRoute';
import TransactionsRouter from './routes/transactionsRoute';
import SpacesRouter from './routes/spacesRoute';

const app: express.Application = express();

// App Middleware
app.use(morgan('tiny')); //Logger for requests
app.use(cors({ origin: true })); //Enable CORS

// Routes
app.use('/auth', AuthRouter);
app.use('/user', UserRouter);
app.use('/spaces', SpacesRouter);
app.use('/transactions', TransactionsRouter);

exports.app = functions.https.onRequest(app);
