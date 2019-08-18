import express from 'express'
import { ensureAuthenticated } from '../helpers/auth'
const router = express.Router()

// Welcome
router.get('/', (req, res) => {
  res.send('welcome')
})

// Dashboard
router.get('/verifyToken', ensureAuthenticated, (req, res) => {
  res.json({ msg: 'Token Verified.' })
})

export default router
