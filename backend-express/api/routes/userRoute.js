import express from 'express'
import { createPublicToken } from '../controllers/plaidController'
import {
  linkPlaidToUser,
  updateAccounts,
  linkItemToUser,
  getTransactionsForUser
} from '../controllers/userController'

const router = express.Router()

// Query all info on User - no body
router.get('/', (req, res) => {
  let user = req.user
  user.password = undefined
  user.__v = undefined
  // Return user object
  res.status(200).json({
    user: user
  })
})

// Generate a public token for Sandbox Environment with CIBC - no body
router.get('/getPublicToken', createPublicToken)

// User Links Plaid - {institutionName:"CIBC", publicToken: "string"}
router.post('/link', linkPlaidToUser)

// Create an ItemLink to associate item with user(s) based on institutionName - {institutionName:"string"}
router.get('/linkItem', linkItemToUser)

// Initialize or update accounts for a linked Item - {institutionName:"string"}
router.post('/getAccounts', updateAccounts)

// Get user transactions for a specified period of time - {startDate: "2019-08-01", endDate: "2019-09-01"}
router.get('/transactions', getTransactionsForUser)

export default router
