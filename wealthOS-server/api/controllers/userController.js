import moment from 'moment';
import mongoose from 'mongoose';
import * as PLAID from './plaidController';
import ItemModel from '../models/itemLinkModel';
import UserModel from '../models/userModel';
// eslint-disable-next-line import/no-cycle
import { addWebhookToItem } from './webhookController';

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
export const updateItemTransactions = async (startDate, endDate, itemID) => {
  const session = await mongoose.startSession();
  endDate = moment(endDate).format('YYYY-MM-DD');
  try {
    return await session.withTransaction(async () => {
      const itemLink = await ItemModel.findOne({ itemID });
      if (itemLink) {
        for (const id of itemLink.users) {
          // Update this users transactions.
          console.log('Item is associated with userID:', id);
          let user = await UserModel.findById(id).session(session);
          user = await syncAccount(user, startDate, endDate, itemID);
          await user.save();
        }
      } else {
        console.log('Item is no longer stored in database. Please remove webhook.');
      }
      return Promise.resolve();
    });
  } catch (err) {
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
export const syncAllAccounts = async (
  user,
  startDate = moment(Date.now())
    .subtract(1, 'month')
    .format('YYYY-MM-DD'),
  endDate = moment(Date.now()).format('YYYY-MM-DD')
) => {
  // For each institution that the user has linked, update info.
  // eslint-disable-next-line no-unused-vars
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

// Sync user account - default of 1 months - called by postLink and also whenever a users account needs to be fully refreshed
const syncAccount = async (
  user,
  startDate = moment(Date.now())
    .subtract(1, 'month')
    .format('YYYY-MM-DD'),
  endDate = moment(Date.now()).format('YYYY-MM-DD'),
  itemId
) => {
  const { accessToken, institutionName } = user.links.get(itemId);
  // First update all account balances
  const accounts = await PLAID.getAccounts(accessToken);
  user = setUserAccounts(user, accounts, institutionName);
  // Then check for any transaction updates
  user = await syncTransactions(user, startDate, endDate, accessToken);
  return user;
};

// Create a new item to store in Item db
const linkItemToUser = async (user, itemID, session) => {
  if (await ItemModel.exists({ itemID })) {
    console.log('This item already exists, adding new user to the item.');
    const item = await ItemModel.findOne({ itemID }).session(session);
    item.users.push(user.id);
    return item.save();
  }
  return ItemModel.create(
    [
      {
        itemID,
        users: [user.id]
      }
    ],
    { session }
  );
};

// Handle the linking of a institution to plaid
export const linkPlaidToUser = async (req, res) => {
  // Grab public token from body
  const { publicToken, institutionName, webhookURL } = req.body;
  // Start the mongo session
  const session = await mongoose.startSession();
  try {
    const user = await session.withTransaction(async () => {
      // Get the user session
      const sessionedUser = await UserModel.findById(req.user.id).session(session);
      // Link user to plaid with token
      const token = await PLAID.exchangeToken(publicToken);
      sessionedUser.links.set(token.item_id, {
        accessToken: token.access_token,
        institutionName
      });
      // Link the itemId to this user for future webhook updates
      await linkItemToUser(sessionedUser, token.item_id, session);
      // If a custom webhook was passed
      if (webhookURL) {
        await addWebhookToItem(token.access_token, webhookURL);
      }
      // Finally return the updated user object
      return sessionedUser.save();
    });

    user.password = undefined;
    user.__v = undefined;
    // Return the updated user info with new institution info added
    return res.status(200).json({
      message: 'Added Link Successfully and Updated Accounts.',
      user
    });
  } catch (err) {
    // Catching a error so we roll back all changes
    console.log('Aborting due to error:', err);
    return res.status(400).json([{ message: err.message }]);
  } finally {
    // Ending the session
    session.endSession();
  }
};

export const unlinkAccount = async (req, res) => {
  const { itemID } = req.body;
  const session = await mongoose.startSession();
  try {
    const { accessToken, institutionName } = req.user.links.get(itemID);
    await session.withTransaction(async () => {
      // Unlink the access token from PLIAD
      await PLAID.removeItem(accessToken);
      // Remove the link from the users links
      const sessionedUser = await UserModel.findById(req.user.id).session(session);
      sessionedUser.links.delete(itemID);
      // Remove transactions associated with the account
      const linkedAccounts = sessionedUser.accounts.get(institutionName);
      const accountIDs = [];
      linkedAccounts.map(account => accountIDs.push(account.accountID));
      // Filter out transactions that are not associated with any of the accounts
      // being unlinked
      sessionedUser.transactions = sessionedUser.transactions.filter(
        transaction => !accountIDs.includes(transaction.accountID)
      );
      // Remove accounts associated with the itemID
      sessionedUser.accounts.delete(institutionName);
      // Save the updated user
      await sessionedUser.save();
      const sessionedItem = await ItemModel.findOne({ itemID }).session(session);
      // If there is only one user remove the entire itemLink entry
      if (sessionedItem.users.length === 1) {
        await ItemModel.findOneAndDelete({ itemID }).session(session);
      } else {
        // Multiple users are tracking this item, remove this user from the itemLink
        sessionedItem.users = sessionedItem.users.filter(item => item !== req.user.id);
        await sessionedItem.save();
      }
    });
    return res.status(200).json({
      message: 'Removed link successfully.'
    });
  } catch (err) {
    console.log('Aborting due to error:', err);
    return res.status(400).json([{ message: err.message }]);
  } finally {
    // Ending the session
    session.endSession();
  }
};
