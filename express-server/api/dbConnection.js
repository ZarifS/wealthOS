import mongoose from 'mongoose'
import { dbName, dbUser, dbPassword, dbOptions, dbURI } from './secrets'

const dbConnection = (local = true) => {
  if (local) {
    console.log(`Connecting to local database..`)
    mongoose
      .connect(`mongodb://localhost:27017/${dbName}`, {
        useCreateIndex: true,
        useNewUrlParser: true
      })
      .then(() => {
        console.log('Connected to database successfully!')
      })
      .catch(err => {
        console.error(err)
      })
  } else {
    console.log(`Connecting to database..`)
    mongoose
      .connect(`mongodb+srv://${dbUser}:${dbPassword}@${dbURI}/${dbName}${dbOptions}}`, {
        useCreateIndex: true,
        useNewUrlParser: true
      })
      .then(() => {
        console.log('Connected to database successfully!')
      })
      .catch(err => {
        console.error(err)
      })
  }
}

export default dbConnection
