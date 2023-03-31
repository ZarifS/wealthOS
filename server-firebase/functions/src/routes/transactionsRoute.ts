import * as express from 'express';
import * as TransactionsController from '../controllers/transactions';

const router = express.Router();

// Transaction routes
router.post('/', async (req: express.Request, res: express.Response) => {
  try {
    const data = req.body;
    await TransactionsController.createTransaction(req.user.uuid, data);
    return res.status(201).send();
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

router.get('/', async (req: express.Request, res: express.Response) => {
  // ... handle getTransactions
  try {
    const data = await TransactionsController.getAllTransactions(req.user.uuid);
    return res.status(201).json(data);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

router.get('/afterDate', async (req: express.Request, res: express.Response) => {
  // ... handle getTransactions
  try {
    const date = req.body.date;
    const data = await TransactionsController.getTransactionsAfterDateRange(req.user.uuid, date);
    return res.status(201).json(data);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

router.put('/:id', async (req: express.Request, res: express.Response) => {
  // ... handle updateTransaction
});

router.delete('/:id', async (req: express.Request, res: express.Response) => {
  // ... handle deleteTransaction
});

export default router;
