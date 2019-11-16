import express from 'express';
import { addWebhookToUser, fireWebhook } from '../controllers/webhookController';
import { ensureAuthenticated } from '../helpers/auth';

const router = express.Router();
// Setup a webhook for one of the users items - {institutionName:"string"}
router.post('/addWebhook', ensureAuthenticated, addWebhookToUser);

// Fire a webhook for one of the institutions - {institutionName:"string"}
router.post('/fireWebhook', ensureAuthenticated, fireWebhook);

// Webhook Listener
router.post('/', (req, res) => {
  console.log('Got A Wekbook!');
  return res.status(200).json('Got it.');
});

export default router;
