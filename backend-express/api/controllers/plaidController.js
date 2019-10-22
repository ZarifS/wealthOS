import plaid from 'plaid';
import moment from 'moment';
import {
  PLAID_CLIENT_ID, PLAID_PUBLIC_KEY, PLAID_SECRET, PLAID_ENV
} from '../helpers/secrets';

// Initialize the Plaid client
const client = new plaid.Client(
  PLAID_CLIENT_ID,
  PLAID_SECRET,
  PLAID_PUBLIC_KEY,
  plaid.environments[PLAID_ENV]
);

// Sandbox create a new public token
export const createPublicToken = (req, res) => {
  // CIBC
  const institutionId = 'ins_37';
  client
    .sandboxPublicTokenCreate(institutionId, ['transactions'])
    .then((token) => {
      console.log(token);
      return res.status(200).json({
        publicToken: token.public_token
      });
    })
    .catch((err) => {
      res.status(400).json([{ message: error.message }]);
    });
};

// Manually add a webhook URL to a existing linked item
export const addWebhook = (accessToken) => client.updateItemWebhook(accessToken, 'https://enhay4am0y9l9.x.pipedream.net');

// Manually fire a webhook update to a linked item
export const fireTransactionWebhook = (accessToken) => client.sandboxItemFireWebhook(accessToken, 'DEFAULT_UPDATE', () => {
  console.log('Fired Webhook!');
});

// Exchange public token
export const exchangeToken = (publicToken) => client.exchangePublicToken(publicToken);

// Makes a call to the Plaids Transactions API for a given Item/Institution
export const getTransactions = async (accessToken, startDate, endDate) => {
  try {
    const { transactions } = await client.getTransactions(accessToken, startDate, endDate);
    return transactions;
  }
  catch (error) {
    throw error;
  }
};

// Makes a call to the Plaids Transactions API for Account information for a given Item/Institution
export const getAccounts = async (accessToken) => {
  // Last 30 Days
  const startDate = moment()
    .subtract(1, 'days')
    .format('YYYY-MM-DD');
  const endDate = moment().format('YYYY-MM-DD');

  // Call Plaid API Transactions
  try {
    const { accounts } = await client.getTransactions(accessToken, startDate, endDate, {
      count: 1,
      offset: 0
    });
    return accounts;
  }
  catch (error) {
    throw error;
  }
};
