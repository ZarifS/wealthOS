import mongoose from 'mongoose';
import { DB_NAME, DB_USER, DB_PASSWORD, DB_OPTIONS, DB_URL } from './secrets';

const dbConnection = async (local = true) => {
  if (local) {
    console.log('Connecting to local database..');
    return mongoose
      .connect(`mongodb://localhost:27017/${DB_NAME}`, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
      .then(() => {
        console.log('Connected to database successfully!');
        return Promise.resolve();
      })
      .catch(err => {
        console.error(err);
        return Promise.reject(err);
      });
  }
  console.log('Connecting to database..');
  return mongoose
    .connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_URL}/${DB_NAME}${DB_OPTIONS}}`, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: DB_NAME
    })
    .then(() => {
      console.log('Connected to database successfully!');
      return Promise.resolve();
    })
    .catch(err => {
      console.error(err.reason);
      return Promise.reject(err);
    });
};

export default dbConnection;
