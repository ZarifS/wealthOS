import * as express from 'express';
import * as TransactionsController from '../controllers/transactions';

const router = express.Router();

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
  // Extract query parameters
  const { startDate, endDate, category, descriptionStartsWith, type } = req.query;
  // Create filter object
  const filters: TransactionsController.TransactionFilter = {
    startDate: startDate ? String(startDate) : undefined,
    endDate: endDate ? String(endDate) : undefined,
    category: category ? String(category) : undefined,
    descriptionStartsWith: descriptionStartsWith ? String(descriptionStartsWith) : undefined,
    type: type ? (String(type) as 'expense' | 'income') : undefined,
  };
  try {
    const data = await TransactionsController.getAllTransactions(req.user.uuid, filters);
    return res.status(200).json(data);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

router.get('/:id', async (req: express.Request, res: express.Response) => {
  const transactionId = req.params.id;
  try {
    const data = await TransactionsController.getTransaction(req.user.uuid, transactionId);
    return res.status(200).json(data);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

router.put('/:id', async (req: express.Request, res: express.Response) => {
  const transactionId = req.params.id;
  const data = req.body;
  try {
    await TransactionsController.updateTransaction(req.user.uuid, transactionId, data);
    return res.status(200).json({ message: 'Transaction updated successfully.' });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', async (req: express.Request, res: express.Response) => {
  const transactionId = req.params.id;
  try {
    await TransactionsController.deleteTransaction(req.user.uuid, transactionId);
    return res.status(200).json({ message: 'Transaction deleted successfully.' });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

export default router;
