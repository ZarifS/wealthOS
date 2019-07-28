import express from 'express'
import expressLayouts from 'express-ejs-layouts'
import session from 'express-session'
import passport from 'passport'
import dbConnection from './api/dbConnection'
import userRoute from './api/routes/users'
import indexRoute from './api/routes/index'
import passportConfig from './api/helpers/passport'

// Init Server
const port = process.env.PORT || 5000
const app = express()

// EJS
app.use(expressLayouts)
app.set('views', './api/views')
app.set('view engine', 'ejs')

// Express Body Parser
app.use(express.urlencoded({ extended: true }))

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
)

// Passport Config
passportConfig(passport)

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Server Routing
app.use('/', indexRoute)
app.use('/users', userRoute)

// Connect to Mongo DB
dbConnection(false)

// Start Server
app.listen(port, () => console.info(`Server has started on ${port}`))
