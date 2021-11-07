import express from 'express'
import { addWebhookToUser, fireWebhook, handleWebhook } from '../controllers/webhookController'
import { ensureAuthenticated } from '../helpers/auth'

const router = express.Router()
// Setup a webhook for one of the users items - {institutionName:"string"}
router.post('/addWebhook', ensureAuthenticated, addWebhookToUser)

// Fire a webhook for one of the institutions - {institutionName:"string"}
router.post('/fireWebhook', ensureAuthenticated, fireWebhook)

// Webhook Listener
router.post('/', handleWebhook)

export default router
