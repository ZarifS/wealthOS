import mongoose from 'mongoose'
import { dbName, dbUser, dbPassword, dbOptions, dbURI } from './secrets'

const dbConnection = (local = true) => {
  if (local) {
    console.log(`Trying to connect to mongodb locally.`)
    mongoose
      .connect(`mongodb://localhost:27017/${dbName}`, { useNewUrlParser: true })
      .then(() => {
        console.log('Mongoose: Connected to database successfully!')
      })
      .catch(err => {
        console.error(err)
      })
  } else {
    console.log(
      `Trying to connect to: mongodb+srv://${dbUser}:${dbPassword}@${dbURI}/${dbName}${dbOptions}}`
    )
    mongoose
      .connect(`mongodb+srv://${dbUser}:${dbPassword}@${dbURI}/${dbName}${dbOptions}}`)
      .then(() => {
        console.log('Mongoose: Connected to database successfully!')
      })
      .catch(err => {
        console.error(err)
      })
  }
}

export default dbConnection
