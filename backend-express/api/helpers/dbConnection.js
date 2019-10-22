import mongoose from 'mongoose';
import {
  DB_NAME, DB_USER, DB_PASSWORD, DB_OPTIONS, DB_URL
} from './secrets';

const dbConnection = (local = true) => {
  if (local) {
    console.log('Connecting to local database..');
    mongoose
      .connect(`mongodb://localhost:27017/${DB_NAME}`, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
      .then(() => {
        console.log('Connected to database successfully!');
      })
      .catch((err) => {
        console.error(err);
      });
  }
  else {
    console.log('Connecting to database..');
    mongoose
      .connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_URL}/${DB_NAME}${DB_OPTIONS}}`, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
      .then(() => {
        console.log('Connected to database successfully!');
      })
      .catch((err) => {
        console.error(err);
      });
  }
};

export default dbConnection;
