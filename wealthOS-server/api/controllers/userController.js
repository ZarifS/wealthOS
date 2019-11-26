import moment from 'moment';
import { exchangeToken, getAccounts, getTransactions } from './plaidController';
import ItemModel from '../models/itemLinkModel';
import UserModel from '../models/userModel';

// Create a new item to store in Item db
const linkItemToUser = (user, itemID) => {
  const item = new ItemModel({
    itemID,
    users: [user.id]
  });
  // Save to DB
  return item.save();
};

// Whenever accounts are modified, update.
const calculateUserBalance = accounts => {
  let sum = 0;
  accounts.forEach(institution => {
    institution.forEach(account => {
      const { balance, type } = account;
      if (type === 'depository') {
        sum += balance;
      } else if (type === 'credit') {
        sum -= balance;
      }
    });
  });
  return sum;
};

// Add new institution accounts to the User
const setUserAccounts = (user, accounts, institutionName) => {
  // Setup user accounts for each account associated with the Plaid item
  const newAccounts = [];
  accounts.forEach(account => {
    const { account_id, balances, name, type, mask } = account;
    const newAccount = {
      name,
      balance: balances.current,
      type,
      currency: balances.iso_currency_code,
      mask,
      accountID: account_id
    };
    newAccounts.push(newAccount);
  });
  user.accounts.set(institutionName, newAccounts);

  // Recalculate the users current balance
  user.balance = calculateUserBalance(user.accounts);

  return user;
};

// Set up bank linking to user profile
export const linkPlaidToUser = (req, res) => {
  // Grab public token from body
  const { publicToken, institutionName } = req.body;
  let itemID;
  const { user } = req;
  // Exchange Token
  exchangeToken(publicToken)
    // Save into UserModel
    .then(token => {
      user.links.set(token.item_id, {
        accessToken: token.access_token,
        institutionName
      });
      itemID = token.item_id;
      return user.save();
    })
    // Save itemId with associated user into ItemLinksModel
    .then(doc => {
      linkItemToUser(doc, itemID);
    })
    // Return API Response
    .then(() => {
      return res.status(200).json({
        message: 'Added Link Successfully'
      });
    })
    .catch(err => {
      console.log(err);
      return res.status(400).json([{ message: err.message }]);
    });
};

// Add bank accounts to user profile after link - TO-DO Change Update Accounts to work for every LinkedItem.
export const updateAccounts = (req, res) => {
  const { itemID } = req.body;
  const { accessToken, institutionName } = req.user.links.get(itemID);

  // Pull accounts for the Item
  getAccounts(accessToken)
    .then(accounts => {
      const user = setUserAccounts(req.user, accounts, institutionName);
      return user.save();
    })
    .then(user => {
      return res.status(200).json({
        message: 'Updated User Accounts.',
        accounts: user.accounts
      });
    })
    .catch(err => {
      return res.status(400).json([{ message: err.message }]);
    });
};

// Pulls historical data for a institution to gather user transactions
export const syncTransactions = async (user, startDate, endDate, accessToken) => {
  try {
    console.log('Getting transactions from:', startDate, 'till:', endDate);
    const transactions = await getTransactions(accessToken, startDate, endDate);
    console.log('Got transactions. Adding into DB...');
    transactions.map(transaction => {
      const transactionObject = {
        name: transaction.name,
        category: transaction.category,
        amount: transaction.amount,
        accountID: transaction.account_id,
        date: transaction.date,
        pending: transaction.pending,
        pendingID: transactions.pending_transaction_id,
        _id: transaction.transaction_id,
        currency: transaction.iso_currency_code
      };
      // Check for duplicated transactions, if already exists, replace it.
      if (user.transactions.id(transaction.transaction_id)) {
        console.log('Transaction already exists, replacing.');
        user.transactions.pull(transaction.transaction_id);
      }
      return user.transactions.push(transactionObject);
    });
    return await user.save();
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};

// Sync transactions for an item and update associated users - sync by default from 1 month ago.
export const updateItemTransactions = async (
  startDate = moment(Date.now())
    .subtract(1, 'month')
    .format('YYYY-MM-DD'),
  endDate = Date.now(),
  itemID
) => {
  try {
    endDate = moment(endDate).format('YYYY-MM-DD');
    const itemLink = await ItemModel.findOne({ itemID });
    // Usually just one id.
    for (const id of itemLink.users) {
      // Update this users transactions.
      console.log('Item is associated with userID:', id);
      const user = await UserModel.findById(id);
      const { accessToken } = user.links.get(itemID);
      await syncTransactions(user, startDate, endDate, accessToken);
    }
    return Promise.resolve();
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};

export const testAPI = async (req, res) => {
  const startDate = moment()
    .subtract(1, 'year')
    .format('YYYY-MM-DD');
  const endDate = Date.now();
  await updateItemTransactions(startDate, endDate, req.body.itemID);
  return res.status(200).json({ message: 'This works.' });
};
