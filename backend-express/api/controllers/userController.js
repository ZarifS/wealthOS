import { exchangeToken, getAccounts, getTransactions } from './plaidController';
import ItemModel from '../models/itemLinkModel';

// Set up bank linking to user profile
export const linkPlaidToUser = (req, res) => {
  // Grab public token from body
  const { publicToken, institutionName } = req.body;
  const { user } = req;
  // Exchange Token
  exchangeToken(publicToken)
    // Save into UserModel
    .then((token) => {
      const { access_token, item_id } = token;
      user.links.set(institutionName, {
        accessToken: access_token,
        itemId: item_id
      });
      return user.save();
    })
    // Save itemId with associated user into ItemLinksModel
    .then((user) => linkItemToUser(user, institutionName))
    // Return API Response
    .then((item) => res.status(200).json({
      message: 'Added Link Successfully'
    }))
    .catch((err) => res.status(400).json([{ message: err.message }]));
};

// Create a new item to store in Item db
const linkItemToUser = (user, institutionName) => {
  const { itemId } = user.links.get(institutionName);
  const item = new ItemModel({
    itemId,
    users: [user.id]
  });
  // Save to DB
  return item.save();
};

// Add bank accounts to user profile after link
export const updateAccounts = (req, res) => {
  const { institutionName } = req.body;
  const { accessToken } = req.user.links.get(institutionName);

  // Pull accounts for the Item
  getAccounts(accessToken)
    .then((accounts) => {
      const user = setUserAccounts(req.user, accounts, institutionName);
      return user.save();
    })
    .then((user) => {
      res.status(200).json({
        message: 'Updated User Accounts',
        accounts: user.accounts
      });
    })
    .catch((err) => res.status(400).json([{ message: err.message }]));
};

// Add new institution accounts to the User
const setUserAccounts = (user, accounts, institutionName) => {
  // Setup user accounts for each account associated with the Plaid item
  const newAccounts = [];
  accounts.forEach((account) => {
    const {
      account_id, balances, name, type, mask
    } = account;
    const newAccount = {
      name,
      balance: balances.current,
      type,
      currency: balances.iso_currency_code,
      mask,
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
const calculateUserBalance = (accounts) => {
  let sum = 0;
  accounts.forEach((institution) => {
    institution.forEach((account) => {
      const { balance, type } = account;
      if (type === 'depository') {
        sum += balance;
      }
      else if (type === 'credit') {
        sum -= balance;
      }
    });
  });
  return sum;
};

export const getTransactionsForUser = async (req, res) => {
  const { startDate, endDate } = req.body;
  const { links } = req.user;
  let allTransactions = [];
  for (const [key, value] of links) {
    const { accessToken } = value;
    try {
      const transactions = await getTransactions(accessToken, startDate, endDate);
      allTransactions = allTransactions.concat(transactions);
    }
    catch (err) {
      return res.status(400).json([{ message: err.message }]);
    }
  }
  res.status(200).json(allTransactions);
};
