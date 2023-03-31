import * as express from 'express';
import * as TransactionsController from '../controllers/transactions';

const router = express.Router();

// Creates a new transaction
router.post('/', async (req: express.Request, res: express.Response) => {
  try {
    const data = req.body;
    await TransactionsController.createTransaction(req.user.uuid, data);
    return res.status(201).send();
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

// Gets all transactions
router.get('/', async (req: express.Request, res: express.Response) => {
  // Extract query parameters
  const { startDate, endDate, category, descriptionContains, type } = req.query;

  // Create filter object
  const filters: TransactionsController.TransactionFilter = {
    startDate: startDate ? String(startDate) : undefined,
    endDate: endDate ? String(endDate) : undefined,
    category: category ? String(category) : undefined,
    descriptionContains: descriptionContains ? String(descriptionContains) : undefined,
    type: type ? (String(type) as 'expense' | 'income') : undefined,
  };

  try {
    const data = await TransactionsController.getAllTransactions(req.user.uuid, filters);
    return res.status(200).json(data);
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
