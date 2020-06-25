import moment from 'moment';
import mongoose from 'mongoose';
import * as PLAID from './plaidController';
import ItemModel from '../models/itemLinkModel';
import UserModel from '../models/userModel';

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
      accountID: account_id,
      lastUpdated: moment(Date.now()).format('YYYY-MM-DD, h:mm:ss a')
    };
    newAccounts.push(newAccount);
  });
  user.accounts.set(institutionName, newAccounts);

  // Recalculate the users current balance
  user.balance = calculateUserBalance(user.accounts);

  return user;
};

// Add bank accounts to user profile after link - TO-DO Change Update Accounts to work for every LinkedItem.
export const updateAccounts = (req, res) => {
  const { itemID } = req.body;
  const { accessToken, institutionName } = req.user.links.get(itemID);

  // Pull accounts for the Item
  PLAID.getAccounts(accessToken)
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
const syncTransactions = async (user, startDate, endDate, accessToken) => {
  try {
    console.log('Getting transactions from:', startDate, 'till:', endDate);
    const transactions = await PLAID.getTransactions(accessToken, startDate, endDate);
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
        user.transactions.pull(transaction.transaction_id);
      }
      return user.transactions.push(transactionObject);
    });
    return user;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

// Called by Webhook update - Sync transactions for an item and update associated users - sync by default from 1 month ago.
export const updateItemTransactions = async (
  startDate = moment(Date.now())
    .subtract(1, 'month')
    .format('YYYY-MM-DD'),
  endDate = Date.now(),
  itemID
) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    endDate = moment(endDate).format('YYYY-MM-DD');
    const itemLink = await ItemModel.findOne({ itemID }).session(session);
    // For each user associated with the item (usually just one), update that items transactions
    for (const id of itemLink.users) {
      // Update this users transactions.
      console.log('Item is associated with userID:', id);
      let user = await UserModel.findById(id).session(session);
      const { accessToken } = user.links.get(itemID);
      user = await syncTransactions(user, startDate, endDate, accessToken);
      user.save();
    }
    await session.commitTransaction();
    return Promise.resolve();
  } catch (err) {
    await session.abortTransaction();
    return Promise.reject(err);
  } finally {
    session.endSession();
  }
};

// Used to test different functions
export const testAPI = async (req, res) => {
  const startDate = moment()
    .subtract(1, 'year')
    .format('YYYY-MM-DD');
  const endDate = Date.now();
  await updateItemTransactions(startDate, endDate, req.body.itemID);
  return res.status(200).json({ message: 'This works.' });
};

// Sync user account - default of 1 months - called by postLink and also whenever a users account needs to be fully refreshed
export const syncAccount = async (
  user,
  startDate = moment(Date.now())
    .subtract(1, 'month')
    .format('YYYY-MM-DD'),
  endDate = moment(Date.now()).format('YYYY-MM-DD')
) => {
  // For each institution that the user has linked, update info.
  for (const [key, value] of user.links) {
    const { accessToken, institutionName } = user.links.get(key);
    // First update all account balances
    const accounts = await PLAID.getAccounts(accessToken);
    user = setUserAccounts(user, accounts, institutionName);
    // Then check for any transaction updates
    user = await syncTransactions(user, startDate, endDate, accessToken);
  }
  await user.save();
  return user;
};

// Create a new item to store in Item db
const linkItemToUser = async (user, itemID) => {
  if (await ItemModel.exists({ itemID })) {
    console.log('This item already exists, adding new user to the item.');
    const item = await ItemModel.findOne({ itemID });
    item.users.push(user.id);
    return item.save();
  }
  const item = new ItemModel({
    itemID,
    users: [user.id]
  });
  // Save to DB
  return item.save();
};

// Handle the linking of a institution to plaid
export const linkPlaidToUser = async (req, res) => {
  // Grab public token from body
  const { publicToken, institutionName } = req.body;
  // Start the mongo session
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    // Get the user session
    let user = await UserModel.findById(req.user.id).session(session);
    // Link user to plaid with token
    const token = await PLAID.exchangeToken(publicToken);
    user.links.set(token.item_id, {
      accessToken: token.access_token,
      institutionName
    });
    // Add the new institutions accounts to the user
    const accounts = await PLAID.getAccounts(token.access_token);
    user = setUserAccounts(user, accounts, institutionName);
    // Synch users transactions with new institutions data intitially 1 months prior
    const startDate = moment(Date.now())
      .subtract(1, 'month')
      .format('YYYY-MM-DD');
    const endDate = moment(Date.now()).format('YYYY-MM-DD');
    user = await syncTransactions(user, startDate, endDate, token.access_token);
    // Save changes made to the user in the database
    await user.save();
    // Finally link the itemId to this user for future webhook updates
    await linkItemToUser(user, token.item_id);
    // Commit transaction
    await session.commitTransaction();
    user.password = undefined;
    user.__v = undefined;
    // Return the updated user info with new institution info added
    return res.status(200).json({
      message: 'Added Link Successfully and Updated Accounts.',
      user
    });
  } catch (err) {
    // Catching a error so we roll back all changes
    await session.abortTransaction();
    console.log('Aborting due to error:', err);
    return res.status(400).json([{ message: err.message }]);
  } finally {
    // Ending the session
    session.endSession();
  }
};
