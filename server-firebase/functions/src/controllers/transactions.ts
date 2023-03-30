import { db as Database } from '../utils/firebase';

type Transaction = {
  id: string;
  type: 'expense' | 'income';
  amount: number;
  description: string;
  category?: string;
  date: Date;
  label?: string;
  accountId?: string;
};

const TRANSACTIONS_SUBCOLLECTION = 'transactions';

// Get user collection slice from database
const db = Database.users;

export async function createTransaction(
  userId: string,
  data: Omit<Transaction, 'id'>
): Promise<void> {
  try {
    await db.doc(userId).collection(TRANSACTIONS_SUBCOLLECTION).add(data);
  } catch (error) {
    console.error('Error creating transaction:', error);
    throw error;
  }
}

// Get all transactions
export async function getAllTransactions(userId: string): Promise<Transaction[]> {
  try {
    const snapshot = await db.doc(userId).collection(TRANSACTIONS_SUBCOLLECTION).get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Transaction[];
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
}

// Get a single transaction
export async function getTransaction(userId: string, transactionId: string): Promise<Transaction> {
  try {
    const doc = await db
      .doc(userId)
      .collection(TRANSACTIONS_SUBCOLLECTION)
      .doc(transactionId)
      .get();
    return { id: doc.id, ...doc.data() } as Transaction;
  } catch (error) {
    console.error('Error fetching transaction:', error);
    throw error;
  }
}

// Get transactions by date range
export async function getTransactionsAfterDateRange(
  userId: string,
  dateRange: string
): Promise<Transaction[]> {
  try {
    const snapshot = await db
      .doc(userId)
      .collection(TRANSACTIONS_SUBCOLLECTION)
      .where('date', '>=', dateRange)
      .get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Transaction[];
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
}

export async function updateTransaction(
  userId: string,
  transactionId: string,
  data: Partial<Transaction>
): Promise<void> {
  try {
    await db.doc(userId).collection(TRANSACTIONS_SUBCOLLECTION).doc(transactionId).update(data);
  } catch (error) {
    console.error('Error updating transaction:', error);
    throw error;
  }
}

export async function deleteTransaction(userId: string, transactionId: string): Promise<void> {
  try {
    await db.doc(userId).collection('transactions').doc(transactionId).delete();
  } catch (error) {
    console.error('Error deleting transaction:', error);
    throw error;
  }
}
