import {
  exchangeToken,
  getAccounts,
  getTransactions
} from '../controllers/plaidController';
import ItemModel from '../models/itemLinkModel';

// Set up bank linking to user profile
export const linkPlaidToUser = (req, res) => {
  // Grab public token from body
  let { publicToken, institutionName } = req.body;
  let user = req.user;
  // Exchange Token
  exchangeToken(publicToken)
    // Save into UserModel
    .then(token => {
      let { access_token, item_id } = token;
      user.links.set(institutionName, {
        accessToken: access_token,
        itemId: item_id
      });
      return user.save();
    })
    // Save itemId with associated user into ItemLinksModel
    .then(user => {
      return linkItemToUser(user, institutionName);
    })
    // Return API Response
    .then(item => {
      return res.status(200).json({
        message: 'Added Link Successfully'
      });
    })
    .catch(err => {
      return res.status(400).json([{ message: err.message }]);
    });
};

// Create a new item to store in Item db
const linkItemToUser = (user, institutionName) => {
  let { itemId } = user.links.get(institutionName);
  let item = new ItemModel({
    itemId: itemId,
    users: [user.id]
  });
  // Save to DB
  return item.save();
};

// To-DO Change this to a helper function that runs after a successful link happens.
// Add bank accounts to user profile
export const updateAccounts = (req, res) => {
  let { institutionName } = req.body;
  let { accessToken } = req.user.links.get(institutionName);

  // Pull accounts for the Item
  getAccounts(accessToken)
    .then(accounts => {
      let user = setUserAccounts(req.user, accounts, institutionName);
      return user.save();
    })
    .then(user => {
      res.status(200).json({
        message: 'Updated User Accounts',
        accounts: user.accounts
      });
    })
    .catch(err => {
      return res.status(400).json([{ message: err.message }]);
    });
};

// Add new institution accounts to the User
const setUserAccounts = (user, accounts, institutionName) => {
  // Setup user accounts for each account associated with the Plaid item
  let newAccounts = [];
  accounts.forEach(account => {
    let { account_id, balances, name, type, mask } = account;
    let newAccount = {
      name: name,
      balance: balances.current,
      type: type,
      currency: balances.iso_currency_code,
      mask: mask,
      accountId: account_id
    };
    newAccounts.push(newAccount);
  });
  user.accounts.set(institutionName, newAccounts);

  // Recalculate the users current balance
  user.balance = calculateUserBalance(user.accounts);

  return user;
};

// Whenever accounts are modified, update.
const calculateUserBalance = accounts => {
  let sum = 0;
  accounts.forEach(institution => {
    institution.forEach(account => {
      let { balance, type } = account;
      if (type === 'depository') {
        sum = sum + balance;
      } else if (type === 'credit') {
        sum = sum - balance;
      }
    });
  });
  return sum;
};

export const getTransactionsForUser = async (req, res) => {
  let { startDate, endDate } = req.body;
  let links = req.user.links;
  let allTransactions = [];
  for (let [key, value] of links) {
    let { accessToken } = value;
    try {
      let transactions = await getTransactions(accessToken, startDate, endDate);
      allTransactions = allTransactions.concat(transactions);
    } catch (err) {
      return res.status(400).json([{ message: err.message }]);
    }
  }
  res.status(200).json(allTransactions);
};
