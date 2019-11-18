import ngrok from 'ngrok';
import { addWebhook, fireTransactionWebhook } from './plaidController';

export const addWebhookToUser = (req, res) => {
  const { institutionName } = req.body;
  const { accessToken } = req.user.links.get(institutionName);
  // User supplied webhookURL
  if (req.body.webhookURL) {
    console.log('Setting webhook at:', req.body.webhookURL);
    addWebhook(accessToken, req.body.webhookURL)
      .then(() => {
        return res.status(200).json({
          message: 'Updated Webhook Successfully'
        });
      })
      .catch(err => {
        console.log(err);
        return res.status(400).json({ message: err.message });
      });
  } else {
    // Development Server, close all Tunnels, connect ->  Tunnel Connection for Webhook Testing
    ngrok
      .connect(5000)
      .then(url => {
        const webhookURL = `${url}/webhook/`;
        console.log('Connected to Tunnel at:', webhookURL);
        return addWebhook(accessToken, webhookURL);
      })
      .then(() => {
        res.status(200).json({
          message: 'Updated Webhook Successfully'
        });
      })
      .catch(err => {
        console.log(err);
        res.status(400).json({ message: err.message });
      });
  }
};

export const fireWebhook = async (req, res) => {
  const { institutionName } = req.body;
  const { accessToken } = req.user.links.get(institutionName);
  fireTransactionWebhook(accessToken);
  res.status(200).json({
    message: 'Fired Webhook Successfully'
  });
};

export const handleWebhook = (req, res) => {
  const { item_id, webhook_type, webhook_code } = req.body;
  console.log('Got a Webhook with Type', webhook_type);
  // Alert plaid the webhook was received.
  res.status(200).json({ message: 'Recieved.' });
  switch (webhook_type) {
    case 'TRANSACTIONS':
      console.log('Transaction updates are available for itemID:', item_id);
      if (webhook_code === 'TRANSACTIONS_REMOVED')
        console.log('Some transactions have been removed.');
      else {
        console.log('Pull new transactions');
        // Pull transactions
        const newTransactions = req.body.new_transactions;
        // For all users with the item_id, call a transactions update with newTransactions number.
      }
      break;
    default:
      console.log('Unhandled webhook type.');
  }
};
