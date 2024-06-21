import { db as Database } from '../utils/firebase';
import * as UserController from './user';

export interface Space {
  id: string;
  name: string;
  ownerId: string;
  description: string;
  users: { [userId: string]: 'viewer' | 'editor' };
  type: 'private' | 'public' | 'protected';
  password?: string;
}

const db = Database.spaces;

const mapSpaceFromDB = (doc: FirebaseFirestore.DocumentData): Space => {
  const data = doc.data() as Space;
  return {
    ...data,
    id: doc.id,
  };
};

// Returns true if the user is an owner or has editor access to the space
const hasEditAccess = (space: Space, userId: string): boolean =>
  space.ownerId === userId || (space.users[userId] && space.users[userId] === 'editor');

export async function getSpaceById(spaceId: string, database = db): Promise<Space | undefined> {
  try {
    const doc = await database.doc(spaceId).get();
    return mapSpaceFromDB(doc);
  } catch (error) {
    console.error('Error fetching space by ID:', error);
    throw error;
  }
}

export async function createSpace(
  ownerId: string,
  data: Omit<Space, 'id'>,
  database = db
): Promise<void> {
  try {
    // Generate a new document reference with an auto-generated ID
    const newDocRef = database.doc();

    const newSpace: Omit<Space, 'id'> = {
      ...data,
      ownerId,
      users: { [ownerId]: 'editor' },
      type: data.type || 'private',
    };

    // Set the new document with the generated ID
    await newDocRef.set(newSpace);

    // Get the generated ID
    const newSpaceId = newDocRef.id;

    // Add space to user's spaces
    const user = await UserController.getUserById(ownerId);
    if (user) {
      await UserController.updateUser(ownerId, { spaces: [...user.spaces, newSpaceId] });
    }
  } catch (error) {
    console.error('Error creating space:', error);
    throw error;
  }
}

export async function addUsersToSpace(
  editorId: string,
  spaceId: string,
  users: { [key: string]: 'viewer' | 'editor' },
  database = db
): Promise<void> {
  try {
    const doc = await database.doc(spaceId).get();
    const space = mapSpaceFromDB(doc);

    if (!hasEditAccess(space, editorId)) {
      throw new Error('Unauthorized access.');
    }

    const updatedUsers = { ...space.users, ...users };
    await database.doc(spaceId).update({ users: updatedUsers });
  } catch (error) {
    console.error('Error adding users to space:', error);
    throw error;
  }
}

export async function updateSpace(
  editorId: string,
  spaceId: string,
  data: Partial<Omit<Space, 'id' | 'ownerId'>>,
  database = db
): Promise<void> {
  try {
    const doc = await database.doc(spaceId).get();
    const space = mapSpaceFromDB(doc);

    if (!hasEditAccess(space, editorId)) {
      throw new Error('Unauthorized access.');
    }

    await database.doc(spaceId).update(data);
  } catch (error) {
    console.error('Error updating space:', error);
    throw error;
  }
}

export async function deleteSpace(editorId: string, spaceId: string, database = db): Promise<void> {
  try {
    const doc = await database.doc(spaceId).get();
    const space = mapSpaceFromDB(doc);

    // Only owners can delete a space
    if (space.ownerId !== editorId) {
      throw new Error('Unauthorized access.');
    }

    await database.doc(spaceId).delete();
  } catch (error) {
    console.error('Error deleting space:', error);
    throw error;
  }
}

export async function removeUserFromSpace(
  editorId: string,
  userId: string,
  spaceId: string,
  database = db
): Promise<void> {
  try {
    const doc = await database.doc(spaceId).get();
    const space = mapSpaceFromDB(doc);

    if (!space.users[userId]) {
      throw new Error('User not found in the space.');
    }

    if (space.ownerId !== editorId && userId !== editorId) {
      throw new Error('Unauthorized access.');
    }

    const updatedUsers = { ...space.users };
    delete updatedUsers[userId];
    await database.doc(spaceId).update({ users: updatedUsers });
  } catch (error) {
    console.error('Error removing user from space:', error);
    throw error;
  }
}
