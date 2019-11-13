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
    .catch((error) => {
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
    let allTransactions = [];
    const { transactions, total_transactions } = await client.getTransactions(
      accessToken,
      startDate,
      endDate,
      { count: 500 }
    );
    console.log('Total transactions for this range:', total_transactions);
    // Got all transactions
    if (total_transactions <= 500) return transactions;
    // Need to paginate
    allTransactions = allTransactions.concat(transactions);
    // Grab next 500
    let offset = 500;
    while (allTransactions.length < total_transactions) {
      const { transactions } = await client.getTransactions(accessToken, startDate, endDate, {
        count: 500,
        offset
      });
      offset += 500;
      allTransactions = allTransactions.concat(transactions);
      console.log('Pulled more data, total data so far:', allTransactions.length);
    }
    // All transactions received
    console.log('Total transactions pulled:', allTransactions.length);
    return allTransactions;
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

export const getCategories = async (req, res) => {
  try {
    const { categories } = await client.getCategories()
    let mainCategories = {}
    categories.map(category => {
      let top = category.hierarchy[0]
      if (mainCategories[top]) {
        for (let item of category.hierarchy) {
          if (!mainCategories[top].includes(item)) mainCategories[top].push(item)
        }
        // let last = category.hierarchy[category.hierarchy.length - 1]
        // if (!mainCategories[top].includes(last)) mainCategories[top].push(last)
      }
      else mainCategories[top] = []
    })
    return res.status(200).json({ hierarchical: mainCategories, original: categories })
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: error.message })
  }
}