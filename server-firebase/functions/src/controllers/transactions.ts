import { Timestamp } from 'firebase-admin/firestore';
import { db as Database } from '../utils/firebase';

export interface Transaction {
  id: string;
  type: 'expense' | 'income';
  amount: number;
  description: string;
  category: string[];
  // String in JOSN payload, Date in Server, Timestamp in Firestore
  date: string | Date | Timestamp;
  label?: string;
  accountId?: string;
}

const TRANSACTIONS_SUBCOLLECTION = 'transactions';

// Get user collection slice from database
const db = Database.users;

export async function createTransaction(
  uuid: string,
  data: Omit<Transaction, 'id'>
): Promise<void> {
  try {
    const transaction: Omit<Transaction, 'id'> = {
      ...data,
      category: data.category || [],
      date: new Date(data.date as string),
    };
    await db.doc(uuid).collection(TRANSACTIONS_SUBCOLLECTION).add(transaction);
  } catch (error) {
    console.error('Error creating transaction:', error);
    throw error;
  }
}

// Get all transactions
export async function getAllTransactions(userId: string): Promise<Transaction[]> {
  try {
    const snapshot = await db.doc(userId).collection(TRANSACTIONS_SUBCOLLECTION).get();
    return snapshot.docs.map((doc) => {
      const data = doc.data() as Transaction;
      return {
        ...data,
        id: doc.id,
        date: (data.date as Timestamp).toDate().toISOString(),
      };
    }) as Transaction[];
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
export async function getTransactionsAfterDateRange(userId: string, date: string): Promise<any[]> {
  try {
    const dateTimestamp = new Date(date);
    const snapshot = await db
      .doc(userId)
      .collection(TRANSACTIONS_SUBCOLLECTION)
      .where('date', '>', dateTimestamp)
      .get();
    return snapshot.docs.map((doc) => {
      const data = doc.data() as Transaction;
      return {
        ...data,
        id: doc.id,
        date: (data.date as Timestamp).toDate().toISOString(),
      };
    });
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
