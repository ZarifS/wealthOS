import express from 'express'
import { registerUser, logInUser } from '../controllers/authController'
import { validateRegistration } from '../helpers/validate'

const router = express.Router()

// User Register
router.post('/', validateRegistration, registerUser)

// JSON Webtoken Version
router.post('/login', logInUser)

export default router
