import ngrok from 'ngrok';
import moment from 'moment';
import { addWebhook, fireTransactionWebhook } from './plaidController';
import { updateItemTransactions } from './userController';

const transactionsHandler = async (webhook_code, item_id) => {
  let startDate;
  const endDate = Date.now();
  switch (webhook_code) {
    case 'DEFAULT_UPDATE':
      console.log('Got a default update.');
      console.log('Transaction updates are available for itemID:', item_id);
      startDate = moment()
        .subtract(15, 'days')
        .format('YYYY-MM-DD');
      await updateItemTransactions(startDate, endDate, item_id);
      break;
    case 'HISTORICAL_UPDATE':
      console.log('Got a historical update.');
      startDate = moment()
        .subtract(1, 'year')
        .format('YYYY-MM-DD');
      await updateItemTransactions(startDate, endDate, item_id);
      break;
    case 'INITIAL_UPDATE':
      console.log('Got a initial update.');
      startDate = moment()
        .subtract(1, 'months')
        .format('YYYY-MM-DD');
      await updateItemTransactions(startDate, endDate, item_id);
      break;
    case 'TRANSACTIONS_REMOVED':
      // To-DO
      console.log('Some transactions have been removed.');
      break;
    default:
      console.log('Unhandled webhook type.');
  }
};

export const addWebhookToUser = (req, res) => {
  const { itemID } = req.body;
  const { accessToken } = req.user.links.get(itemID);
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
  const { itemID, type } = req.body;
  const { accessToken } = req.user.links.get(itemID);
  fireTransactionWebhook(accessToken, type);
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
      return transactionsHandler(webhook_code, item_id);
    case 'ITEM':
      // To-DO
      console.log('Got a item update.');
      return null;
    default:
      console.log('Unhandled webhook type.');
      return null;
  }
};
