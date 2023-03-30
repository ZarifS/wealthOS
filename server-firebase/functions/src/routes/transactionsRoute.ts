import * as express from 'express';
// import * as TransactionsController from '../controllers/transactions';

const router = express.Router();

// Transaction routes
router.post('/transactions', async (req: express.Request, res: express.Response) => {
  // ... handle createTransaction
});

router.get('/transactions', async (req: express.Request, res: express.Response) => {
  // ... handle getTransactions
});

router.put('/transactions/:id', async (req: express.Request, res: express.Response) => {
  // ... handle updateTransaction
});

router.delete('/transactions/:id', async (req: express.Request, res: express.Response) => {
  // ... handle deleteTransaction
});
