import express from 'express'
import passport from 'passport'
const router = express.Router()

// Welcome
router.get('/', (req, res) => {
  res.render('welcome')
})

// Dashboard
router.get('/dashboard', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.render('dashboard', {
    user: req.user
  })
})

export default router
