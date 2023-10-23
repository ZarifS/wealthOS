import * as express from 'express';
import * as cors from 'cors';
import * as morgan from 'morgan';
import { functions } from './utils/firebase';
import AuthRouter from './routes/authRoute';
import UserRouter from './routes/userRoute';
import TransactionsRouter from './routes/transactionsRoute';
import AuthMiddleware from './middleware/authMiddleware';

const app: express.Application = express();

// App Middleware
app.use(morgan('tiny')); //Logger for requests
app.use(cors({ origin: true })); //Enable CORS

// Routes
app.use('/auth', AuthRouter);
app.use('/user', AuthMiddleware, UserRouter);
app.use('/transactions', AuthMiddleware, TransactionsRouter);

exports.app = functions.https.onRequest(app);
