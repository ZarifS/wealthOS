import ngrok from 'ngrok';
import moment from 'moment';
import { addWebhook, fireTransactionWebhook } from './plaidController';
// eslint-disable-next-line import/no-cycle
import { updateItemTransactions } from './userController';

const transactionsHandler = async (webhook_code, item_id) => {
  let startDate;
  const endDate = Date.now();
  try {
    switch (webhook_code) {
      case 'DEFAULT_UPDATE':
        startDate = moment()
          .subtract(15, 'days')
          .format('YYYY-MM-DD');
        await updateItemTransactions(startDate, endDate, item_id);
        break;
      case 'HISTORICAL_UPDATE':
        startDate = moment()
          .subtract(1, 'year')
          .format('YYYY-MM-DD');
        await updateItemTransactions(startDate, endDate, item_id);
        break;
      case 'INITIAL_UPDATE':
        startDate = moment()
          .subtract(1, 'months')
          .format('YYYY-MM-DD');
        await updateItemTransactions(startDate, endDate, item_id);
        break;
      case 'TRANSACTIONS_REMOVED':
        // To-DO
        break;
      default:
        console.log('Unhandled webhook type.');
    }
  } catch (err) {
    console.log(err);
  } finally {
    console.log('Webhook handled.');
  }
};

export const addWebhookToItem = (accessToken, webhookURL) => {
  // Development Server, close all Tunnels, connect ->  Tunnel Connection for Webhook Testing
  console.log('Adding webhook..');
  return addWebhook(accessToken, webhookURL);
};

export const addWebhookToUser = (req, res) => {
  const { itemID } = req.body;
  const { accessToken } = req.user.links.get(itemID);
  // User supplied webhookURL
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
};

export const fireWebhook = async (req, res) => {
  const { itemID, type } = req.body;
  const { accessToken } = req.user.links.get(itemID);
  fireTransactionWebhook(accessToken, type);
  return res.status(200).json({
    message: 'Fired Webhook Successfully'
  });
};

export const handleWebhook = async (req, res) => {
  const { item_id, webhook_type, webhook_code } = req.body;
  console.log('Got a Webhook with Type', webhook_type, ' - ', webhook_code, '- ITEMID:', item_id);
  res.status(200).json({ message: 'Recieved and handled.' });
  // Alert plaid the webhook was received.
  // Handle the webhook on the server
  try {
    switch (webhook_type) {
      case 'TRANSACTIONS':
        await transactionsHandler(webhook_code, item_id);
        break;
      case 'ITEM':
        // To-DO
        console.log('Got a item update for itemID:', item_id);
        break;
      default:
        console.log('Unhandled webhook type.');
        return;
    }
  } catch (err) {
    console.log('Webhook was not handed. Error:', err);
  }
};
