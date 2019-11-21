import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import authRoute from './routes/authRoute';
import userRoute from './routes/userRoute';
import webhookRoute from './routes/webhookRoute';
import dbConnection from './helpers/dbConnection';
import { ensureAuthenticated } from './helpers/auth';

// Init Server
const port = process.env.PORT || 5000;
const app = express();

// Express Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Logger Middleware
app.use(morgan('dev'));

// Register, Login
app.use('/auth', authRoute);

// User Linking
app.use('/user', ensureAuthenticated, userRoute);

// Getting updates to/from webhook handler
app.use('/webhook', webhookRoute);

// Connect to Mongo DB
dbConnection(false);

// Start Server
app.listen(port, () => console.info(`Server has started on ${port}`));
