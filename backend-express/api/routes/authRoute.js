import express from 'express'
import { registerUser, logInUser } from '../controllers/authController'
import { validateRegistration } from '../helpers/validate'
import { ensureAuthenticated } from '../helpers/auth'

const router = express.Router()

// User Register
router.post('/', validateRegistration, registerUser)

// JSON Webtoken Version
router.post('/login', logInUser)

// Verify a Token
router.get('/verifyToken', ensureAuthenticated, (req, res) => {
  res.json({ msg: 'Token Verified.' })
})

export default router
