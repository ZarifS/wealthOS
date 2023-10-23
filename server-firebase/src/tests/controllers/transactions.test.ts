import { Timestamp } from 'firebase-admin/firestore';
import {
  createTransaction,
  deleteTransaction,
  getAllTransactions,
  getTransaction,
  mapTransactionToDB,
  Transaction,
  TransactionFilter,
  updateTransaction,
} from '../../controllers/transactions';
import { db, mockedGet, mockedSet, mockedUpdate, mockedDelete, mockedWhere } from './firestoreMock';

describe('transactionsController', () => {
  const transaction: Omit<Transaction, 'id'> = {
    ownerId: 'user1',
    type: 'expense',
    amount: 100,
    description: 'Test transaction',
    category: ['food'],
    date: '2023-03-27T00:00:00.000Z',
  };
  const transactionFromDB: Transaction = {
    id: 'testTransaction',
    ownerId: 'user1',
    type: 'expense',
    amount: 100,
    description: 'Test transaction',
    category: ['food'],
    date: Timestamp.fromDate(new Date('2023-03-27T00:00:00.000Z')),
  };
  beforeEach(() => {
    // Clear mockData
    jest.clearAllMocks();
  });

  describe('createTransaction', () => {
    it('should create a transaction', async () => {
      await createTransaction('testUser', transaction, db);
      const mappedTransaction = mapTransactionToDB(transaction, 'testUser');
      expect(mockedSet).toHaveBeenCalledWith(mappedTransaction);
    });
    it('should throw an error if the transaction is not created', async () => {
      mockedSet.mockRejectedValueOnce(new Error('Test Fail'));
      await expect(createTransaction('testUser', transaction, db)).rejects.toThrow();
    });
  });

  describe('getAllTransactions', () => {
    it('should get all transactions', async () => {
      const filters: TransactionFilter = {};
      mockedGet.mockReturnValue({ docs: [] });
      await getAllTransactions('testUser', filters, db);
      expect(mockedWhere).toHaveBeenCalledWith('ownerId', '==', 'testUser');
      expect(mockedGet).toHaveBeenCalled();
    });
  });

  describe('getTransaction', () => {
    it('should get a transaction', async () => {
      mockedGet.mockReturnValue({ exists: true, data: () => transactionFromDB });
      const result = await getTransaction(transactionFromDB.ownerId, transactionFromDB.id, db);
      expect(mockedGet).toHaveBeenCalled();
      expect(result).toEqual(transaction);
    });

    it('should throw an error if transaction does not belong to user', async () => {
      mockedGet.mockReturnValue({
        exists: true,
        data: () => ({ ...transactionFromDB, ownerId: 'user2' }),
      });
      await expect(getTransaction('someOtherUser', transactionFromDB.id, db)).rejects.toThrow(
        'Unauthorized access.'
      );
    });
  });

  describe('updateTransaction', () => {
    it('should update a transaction', async () => {
      mockedGet.mockReturnValue({ exists: true, data: () => transactionFromDB });
      await updateTransaction(transactionFromDB.ownerId, transactionFromDB.id, { amount: 200 }, db);
      const mappedTransaction = mapTransactionToDB(
        { ...transaction, amount: 200 },
        transactionFromDB.ownerId
      );
      expect(mockedUpdate).toHaveBeenCalledWith(mappedTransaction);
    });

    it('should throw an error if transaction does not belong to user', async () => {
      mockedGet.mockReturnValue({
        exists: true,
        data: () => ({ ...transactionFromDB, ownerId: 'user2' }),
      });
      await expect(
        updateTransaction('someOtherUser', transactionFromDB.id, transaction, db)
      ).rejects.toThrow('Unauthorized access.');
    });
  });

  describe('deleteTransaction', () => {
    it('should delete a transaction', async () => {
      mockedGet.mockReturnValue({ exists: true, data: () => transactionFromDB });
      await deleteTransaction(transactionFromDB.ownerId, transactionFromDB.id, db);
      expect(mockedDelete).toHaveBeenCalled();
    });

    it('should throw an error if transaction does not belong to user', async () => {
      const transactionId = 'testTransaction';
      mockedGet.mockReturnValue({
        exists: true,
        data: () => ({ ...transactionFromDB, ownerId: 'user2' }),
      });
      await expect(deleteTransaction('testUser', transactionId, db)).rejects.toThrow(
        'Unauthorized access.'
      );
    });
  });
});
