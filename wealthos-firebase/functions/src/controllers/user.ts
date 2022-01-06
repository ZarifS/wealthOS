import {db as Database} from "../utils/firebase";


export type User = {
    firstName?: string,
    lastName?: string,
    email: string
}

// Get user collection slice from database
export const db = Database.users;

/**
 * Retrieve a user from the database
 * @param {String} userId:
 * @return {Promise<User | undefined>}
 */
export async function getUserById(userId: string): Promise<User | undefined> {
  try {
    const user = (await db.doc(userId).get()).data();
    if (user) {
      return user;
    } else return undefined;
  } catch (error) {
    console.error("Error trying to get user:", error);
    throw error;
  }
}

/**
 * Get all users from the database
 * @return {Promise<User []>}
 */
export async function getAllUsers(): Promise<User[]> {
  try {
    const docs = (await db.get()).docs;
    return docs.map((doc) => doc.data());
  } catch (error) {
    console.error("Error trying to get all users:", error);
    throw error;
  }
}

export async function createUser(userId: string | undefined, data: User):
Promise<FirebaseFirestore.WriteResult> {
  try {
    if (userId) {
      return await db.doc(userId).set({
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
      });
    } else {
      return await db.doc().set({
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
      });
    }
  } catch (error) {
    console.log("Error trying to create a new user", error);
    throw error;
  }
}
