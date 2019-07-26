import express from 'express'
const router = express.Router()

// Welcome
router.get('/', (req, res) => {
  res.render('welcome')
})

export default router
