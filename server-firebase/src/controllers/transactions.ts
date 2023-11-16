import { Timestamp } from 'firebase-admin/firestore';
import { db as Database } from '../utils/firebase';

export interface Transaction {
  id: string;
  spaceId: string;
  ownerId: string;
  type: 'expense' | 'income';
  amount: number;
  description: string;
  category: string[];
  // String in JOSN payload, Date in Server, Timestamp in Firestore
  date: string | Date | Timestamp;
  label?: string;
  accountId?: string;
}

export interface TransactionFilter {
  startDate?: string;
  endDate?: string;
  category?: string;
  descriptionStartsWith?: string;
  type?: 'expense' | 'income';
}

/**
 * Firestore database collection of the users, used by default in all functions
 * When running tests a mocked database can be passed in instead
 */
const db = Database.transactions;

export const mapTransactionFromDB = (doc: FirebaseFirestore.DocumentData): Transaction => {
  const data = doc.data() as Transaction;
  return {
    ...data,
    id: doc.id,
    // Revert the timestamp from firestore back to a date object and then to a string
    date: (data.date as Timestamp).toDate().toISOString(),
  };
};

export const mapTransactionToDB = (
  data: Omit<Transaction, 'id'>,
  uuid: string
): Omit<Transaction, 'id'> => {
  return {
    spaceId: data.spaceId,
    ownerId: data.ownerId || uuid,
    type: data.type || 'expense',
    amount: data.amount || 0,
    description: data.description || '',
    category: data.category || [],
    // We send a date object to firestore but it's stored as a timestamp
    date: new Date(data.date as string) as Date,
    label: data.label || undefined,
    accountId: data.accountId || undefined,
  };
};

export async function createTransaction(
  uuid: string,
  data: Omit<Transaction, 'id'>,
  database = db
): Promise<void> {
  try {
    const transaction = mapTransactionToDB(data, uuid);
    await database.doc().set(transaction);
  } catch (error: any) {
    console.error('Error creating transaction:', error.message);
    throw error;
  }
}

export async function getAllTransactions(
  spaceId: string,
  filters: TransactionFilter = {},
  database = db
): Promise<Transaction[]> {
  try {
    let query: FirebaseFirestore.Query<FirebaseFirestore.DocumentData> = database.where(
      'spaceId',
      '==',
      spaceId
    );

    if (filters.startDate) {
      const startTimestamp = new Date(filters.startDate);
      query = query.where('date', '>=', startTimestamp);
    }

    if (filters.endDate) {
      const endTimestamp = new Date(filters.endDate);
      query = query.where('date', '<=', endTimestamp);
    }

    if (filters.category) {
      query = query.where('category', 'array-contains', filters.category);
    }

    if (filters.descriptionStartsWith) {
      query = query
        .where('description', '>=', filters.descriptionStartsWith)
        .where('description', '<=', filters.descriptionStartsWith + '\uf8ff');
    }

    if (filters.type) {
      query = query.where('type', '==', filters.type);
    }

    const snapshot = await query.get();
    return snapshot.docs.map((doc) => mapTransactionFromDB(doc));
  } catch (error: any) {
    console.error('Error fetching transactions:', error.message);
    throw error;
  }
}

export async function getTransaction(
  userId: string,
  transactionId: string,
  database = db
): Promise<Transaction> {
  try {
    const doc = await database.doc(transactionId).get();
    const transaction = mapTransactionFromDB(doc);

    if (transaction.ownerId !== userId) {
      throw new Error('Unauthorized access.');
    }

    return transaction;
  } catch (error: any) {
    console.error('Error fetching transaction:', error.message);
    throw error;
  }
}

export async function updateTransaction(
  userId: string,
  transactionId: string,
  data: Partial<Transaction>,
  database = db
): Promise<void> {
  try {
    const doc = await database.doc(transactionId).get();
    let transaction = mapTransactionFromDB(doc);

    if (transaction.ownerId !== userId) {
      throw new Error('Unauthorized access.');
    }

    // Change the data based on the update
    transaction = { ...transaction, ...data };
    // Ensures only valid fields are updated
    const transactionToUpdate = mapTransactionToDB(transaction, userId);

    await database.doc(transactionId).update(transactionToUpdate);
  } catch (error: any) {
    console.error('Error updating transaction:', error.message);
    throw error;
  }
}

export async function deleteTransaction(
  userId: string,
  transactionId: string,
  database = db
): Promise<void> {
  try {
    const doc = await database.doc(transactionId).get();
    const transaction = mapTransactionFromDB(doc);

    if (transaction.ownerId !== userId) {
      throw new Error('Unauthorized access.');
    }

    await database.doc(transactionId).delete();
  } catch (error: any) {
    console.error('Error deleting transaction:', error.message);
    throw error;
  }
}
