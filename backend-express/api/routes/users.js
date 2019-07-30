import express from 'express'
import passport from 'passport'
import jwt from 'jsonwebtoken'
import UserModel from '../models/userModel'
import { validateRegistration } from '../helpers/validate'

const router = express.Router()

// Login Page
router.get('/login', (req, res) => {
  res.render('login')
})

// Register Page
router.get('/register', (req, res) => {
  res.render('register')
})

// User Register
router.post('/register', async (req, res) => {
  const { name, email, password, password2 } = req.body

  // Validate Fields
  let errors = await validateRegistration(req.body)

  // Send back error messages to partials/messages.ejs -> In API mode change to 400 error with error response
  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    })
    return
  }

  // Register the new user
  let newUser = new UserModel({
    name,
    email,
    password
  })
  newUser
    .save()
    .then(doc => {
      console.log('Added new user: ' + doc)
      // In API send back 200 with confirmation
      res.redirect('/users/login')
    })
    .catch(err => {
      res.status(400).send({ error: err.message })
    })
})

// Login Handler
router.post('/loginLocal', passport.authenticate('local'), (req, res) => {
  console.log('User has been authenticated')
  res.redirect('/dashboard')
})

// JSON Webtoken Version
router.post('/login', (req, res) => {
  const { email, password } = req.body
  UserModel.findOne({ email: email })
    .then(user => {
      // No user found
      if (!user) {
        return done(null, false, { message: 'That email is not registered' })
      }

      // Incorrect Password
      if (!user.checkPassword(password)) {
        return done(null, false, { message: 'Incorrect password' })
      }

      // Verified User
      const payload = {
        id: user.id,
        name: user.name
      }

      // Send JSON Webtoken to client
      jwt.sign(payload, secret, { expiresIn: 36000 }, (err, token) => {
        if (err) res.status(500).json({ error: 'Error signing token', raw: err })
        res.json({
          success: true,
          token: `Bearer ${token}`
        })
      })
    })
    .catch(err => {
      console.log('Error: ' + err)
      throw err
    })
})

// Logout Handler
router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/users/login')
})

export default router
