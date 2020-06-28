import express from 'express';
import { createPublicToken, getCategories } from '../controllers/plaidController';
import {
  linkPlaidToUser,
  updateAccounts,
  updateItemTransactions,
  testAPI,
  unlinkAccount,
  syncAllAccounts
} from '../controllers/userController';

const router = express.Router();

// Query all info on User - no body
router.get('/', (req, res) => {
  const { user } = req;
  user.password = undefined;
  user.__v = undefined;
  // Return user object
  return res.status(200).json({
    user
  });
});

// Generate a public token for Sandbox Environment with CIBC - no body
router.get('/getPublicToken', createPublicToken);

// User Links Plaid - {institutionName:"CIBC", publicToken: "string"}
router.post('/link', linkPlaidToUser);

// User Unlinks a Plaid account - {itemID: "string"}
router.post('/unlink', unlinkAccount);

// Initialize or update accounts for a linked Item - {institutionName:"string"}
router.post('/setAccounts', updateAccounts);

// Sync user transactions - {startDate: (default 1month prior), endDate: (default now), itemID: string}
router.post('/syncTransactions', async (req, res) => {
  const { startDate, endDate, itemID } = req.body;
  try {
    await updateItemTransactions(startDate, endDate, itemID);
    return res.status(200).json({ message: 'Transactions synced successfully.' });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
});

// Sync user information
router.get('/sync', async (req, res) => {
  let { user } = req;
  try {
    user = await syncAllAccounts(user);
    return res.status(200).json({ message: 'Synched user successfully.', user });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
});

// Get user transaction
router.get('/testAPI/', testAPI);

// Get plaid categories
router.get('/categories/', getCategories);

export default router;
