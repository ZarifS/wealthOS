import express from 'express'
import { createPublicToken } from '../controllers/plaidController'
import { linkPlaidToUser, initAccounts, getAccounts } from '../controllers/userController'

const router = express.Router()

// Query all info on User
router.get('/', (req, res) => {
  let user = req.user
  user.password = undefined
  user.__v = undefined
  // Return user object
  res.status(200).json({
    user: user
  })
})

// Generate a public token for Sandbox Environment with CIBC
router.get('/getPublicToken', createPublicToken)

// User Links Plaid
router.post('/link', linkPlaidToUser)

// Initialize accounts for a newly linked Item
router.post('/initAccounts', initAccounts)

export default router
