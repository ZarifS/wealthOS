import { db as Database } from '../utils/firebase';

export type ItemLinks = {
  userIds: string[]; // uid of the user
};

// Get itemLinks collection slice from database
export const db = Database.itemLinks;

// Create a new item to store in ItemLinks db
export const createLink = async (
  userId: string,
  itemID: string
): Promise<FirebaseFirestore.WriteResult> => {
  try {
    const itemRef = await db.doc(itemID).get();
    // Check if the item already exists
    if (itemRef.exists) {
      console.log('This item already exists, adding new user to the items userIds list.');
      const userIds = (itemRef.data()?.userIds as [string]) || [];
      userIds.push(userId);
      // Save doc
      return await db.doc(itemID).set({ userIds });
    }
    return await db.doc(itemID).set({ userIds: [userId] });
  } catch (error) {
    console.log(error);
    throw new Error();
  }
};
