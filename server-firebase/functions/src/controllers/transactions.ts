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

export interface TransactionFilter {
  startDate?: string;
  endDate?: string;
  category?: string;
  descriptionStartsWith?: string;
  type?: 'expense' | 'income';
}

const TRANSACTIONS_SUBCOLLECTION = 'transactions';

// Get user collection slice from database
const db = Database.users;

const mapTransactionFromDB = (doc: FirebaseFirestore.DocumentData): Transaction => {
  const data = doc.data() as Transaction;
  return {
    ...data,
    id: doc.id,
    date: (data.date as Timestamp).toDate().toISOString(),
  };
};

const mapTransactionToDB = (data: Omit<Transaction, 'id'>): Omit<Transaction, 'id'> => {
  return {
    ...data,
    category: data.category || [],
    date: new Date(data.date as string),
  };
};

export async function createTransaction(
  uuid: string,
  data: Omit<Transaction, 'id'>
): Promise<void> {
  try {
    const transaction = mapTransactionToDB(data);
    await db.doc(uuid).collection(TRANSACTIONS_SUBCOLLECTION).add(transaction);
  } catch (error) {
    console.error('Error creating transaction:', error);
    throw error;
  }
}

// Get all transactions with filters
export async function getAllTransactions(
  userId: string,
  filters: TransactionFilter = {}
): Promise<Transaction[]> {
  try {
    let query: FirebaseFirestore.Query<FirebaseFirestore.DocumentData> = db
      .doc(userId)
      .collection(TRANSACTIONS_SUBCOLLECTION);

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
    return mapTransactionFromDB(doc);
  } catch (error) {
    console.error('Error fetching transaction:', error);
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
