import express from 'express'
import { ensureAuthenticated } from '../helpers/auth'
const router = express.Router()

// Welcome
router.get('/', (req, res) => {
  res.send('welcome')
})

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) => {
  res.json(req.user)
})

export default router
