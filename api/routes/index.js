import express from 'express'
import { ensureAuthenticated } from '../helpers/auth'
const router = express.Router()

// Welcome
router.get('/', (req, res) => {
  res.render('welcome')
})

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) => {
  res.render('dashboard', {
    user: req.user
  })
})

export default router
