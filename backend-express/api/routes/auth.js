import express from 'express'
import UserModel from '../models/userModel'
import { validateRegistration } from '../helpers/validate'
import { createToken } from '../helpers/auth'

const router = express.Router()

// User Register
router.post('/', async (req, res) => {
  // User Inputs
  const { firstName, lastName, email, password } = req.body

  // Validate Fields
  let errors = await validateRegistration(req.body)

  // Send back error messages
  if (errors.length > 0) {
    res.status(400)
    return res.json({
      error: {
        messages: errors
      }
    })
  }

  // Register the new user
  let newUser = new UserModel({
    firstName,
    lastName,
    email,
    password
  })

  newUser
    .save()
    .then(doc => {
      console.log('Added new user: ' + doc)
      // In API send back 201 with confirmation
      res.status(201).json({
        message: 'User created.'
      })
    })
    .catch(err => {
      res.status(400).send({ error: err.message })
    })
})

// JSON Webtoken Version
router.post('/login', (req, res) => {
  const { email, password } = req.body
  let error
  UserModel.findOne({ email: email })
    .then(user => {
      // No user found
      if (!user) {
        error = 'No Account Found'
        return res.status(404).json(error)
      }

      // Incorrect Password
      if (!user.checkPassword(password)) {
        error = 'Password is incorrect'
        return res.status(400).json(error)
      }

      // Verified User
      const payload = {
        id: user.id,
        email: user.email,
        links: user.links
      }

      // Create JSON Webtoken
      const token = createToken(payload)

      // Return Token
      return res.status(200).json({
        message: 'Auth successful',
        token: token
      })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        error: err
      })
    })
})

export default router
