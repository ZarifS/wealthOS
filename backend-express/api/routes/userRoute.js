import express from 'express';
import { createPublicToken } from '../controllers/plaidController';
import {
  linkPlaidToUser,
  updateAccounts,
  setTransactionsForUser,
  testAPI
} from '../controllers/userController';
import { getCategories } from '../controllers/plaidController'

const router = express.Router();

// Query all info on User - no body
router.get('/', (req, res) => {
  const { user } = req;
  user.password = undefined;
  user.__v = undefined;
  // Return user object
  res.status(200).json({
    user
  });
});

// Generate a public token for Sandbox Environment with CIBC - no body
router.get('/getPublicToken', createPublicToken);

// User Links Plaid - {institutionName:"CIBC", publicToken: "string"}
router.post('/link', linkPlaidToUser);

// Initialize or update accounts for a linked Item - {institutionName:"string"}
router.post('/setAccounts', updateAccounts);

// Set user transactions for a the last year - {startDate: "2019-08-01", endDate: "2019-09-01"}
router.post('/setTransactions', setTransactionsForUser);

// Get user transaction
router.get('/testAPI/:id', testAPI);

// Get user transaction
router.get('/categories/', getCategories);

export default router;
