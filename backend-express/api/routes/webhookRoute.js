import express from 'express';
import { addWebhookToUser, fireWebhook } from '../controllers/webhookController';

const router = express.Router();
// Setup a webhook for one of the users items - {institutionName:"string"}
router.post('/addWebhook', addWebhookToUser);

// Fire a webhook for one of the institutions - {institutionName:"string"}
router.post('/fireWebhook', fireWebhook);

export default router;
