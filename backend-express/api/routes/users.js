import express from 'express'
import UserModel from '../models/userModel'
import { validateRegistration } from '../helpers/validate'
import { createToken } from '../helpers/auth'

const router = express.Router()

// User Register
router.post('/', async (req, res) => {
  // User Inputs
  const { name, email, password } = req.body

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
    name,
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
  UserModel.findOne({ email: email })
    .then(user => {
      // No user found
      if (!user) {
        errors.email = 'No Account Found'
        return res.status(404).json(errors)
      }

      // Incorrect Password
      if (!user.checkPassword(password)) {
        errors.password = 'Password is incorrect'
        return res.status(400).json(errors)
      }

      // Verified User
      const payload = {
        id: user.id,
        name: user.name,
        email: user.email
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
