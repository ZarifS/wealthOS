import express from 'express'
import { createPublicToken } from '../controllers/plaidController'
import {
  linkPlaidToUser,
  initAccounts,
  addWebhookToUser,
  fireWebhook,
  linkItemToUser
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

// Initialize accounts for a newly linked Item - {institutionName:"string"}
router.post('/initAccounts', initAccounts)

// Setup a webhook for one of the users items - {institutionName:"string"}
router.post('/addWebhook', addWebhookToUser)

// Fire a webhook for one of the institutions - {institutionName:"string"}
router.post('/fireWebhook', fireWebhook)

// Find all users who have a certain itemId associated with them - {institutionName:"string"}
router.get('/linkItem', linkItemToUser)

export default router
