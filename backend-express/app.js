import express from 'express'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import dbConnection from './api/dbConnection'
import userRoute from './api/routes/users'
import indexRoute from './api/routes/index'

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
app.use('/user', userRoute)

// Connect to Mongo DB
dbConnection(false)

// Start Server
app.listen(port, () => console.info(`Server has started on ${port}`))
