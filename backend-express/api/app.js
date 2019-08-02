import express from 'express'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import dbConnection from './dbConnection'
import authRoute from './routes/auth'
import indexRoute from './routes/index'
import userRoute from './routes/user'

// Init Server
const port = process.env.PORT || 5000
const app = express()

// Express Body Parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//Logger Middleware
app.use(morgan('dev'))

// Server Routing
app.use('/', indexRoute)

// Register, Login
app.use('/auth', authRoute)

// User Linking
app.use('/user', userRoute)

// Connect to Mongo DB
dbConnection(false)

// Start Server
app.listen(port, () => console.info(`Server has started on ${port}`))
