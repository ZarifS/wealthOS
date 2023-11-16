import { db as Database } from '../utils/firebase';

export interface User {
  uuid: string;
  firstName?: string;
  lastName?: string;
  email: string;
}

// Get user collection slice from database
const db = Database.users;

/**
 * Retrieve a user from the database
 * @param {String} userId:
 * @return {Promise<User | undefined>}
 */
export async function getUserById(userId: string): Promise<User | undefined> {
  try {
    const user = (await db.doc(userId).get()).data() as User;
    if (user) {
      return user;
    } else return undefined;
  } catch (error) {
    console.error('Error trying to get user:', error);
    throw error;
  }
}

/**
 * Create a new user with a specific docId matching authentications uuid
 * @export
 * @param {string} uuid firebase auth uuid
 * @param {Partial<User>} data
 * @return {Promise<FirebaseFirestore.WriteResult>}
 */
export async function createUser(
  uuid: string,
  data: Partial<User>
): Promise<FirebaseFirestore.WriteResult> {
  try {
    if (!uuid) throw new Error('Missing or invalid uuid.');
    return await db.doc(uuid).set({
      email: data.email as string,
      firstName: data.firstName,
      lastName: data.lastName,
      uuid,
    });
  } catch (error) {
    console.error('Error trying to create a new user:', error);
    throw error;
  }
}

/**
 * Replaces a users document field(s) with data that is provided
 * @param {string} userId
 * @param {Partial<User>} data
 * @return {Promise<FirebaseFirestore.WriteResult>}
 */
export async function updateUser(
  userId: string,
  data: Partial<User>
): Promise<FirebaseFirestore.WriteResult> {
  try {
    return await db.doc(userId).update(data);
  } catch (error) {
    console.error('Error updating user', error);
    throw error;
  }
}
