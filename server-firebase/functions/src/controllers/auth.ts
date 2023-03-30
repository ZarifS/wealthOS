import {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  adminAuth,
} from '../utils/firebase';
import * as UserController from './user';

export async function signUpViaEmail(
  email: string,
  password: string,
  firstName: string,
  lastName: string
): Promise<string> {
  try {
    // Create a new firebase auth user
    const credentials = await createUserWithEmailAndPassword(auth, email, password);
    // Link the auth user to db user collection
    await UserController.createUser(credentials.user.uid, { email, firstName, lastName });
    return await credentials.user.getIdToken();
  } catch (error) {
    console.error('Error trying to get create user:', error);
    throw error;
  }
}

export async function signInViaEmail(email: string, password: string): Promise<string> {
  try {
    const credentials = await signInWithEmailAndPassword(auth, email, password);
    const token = await credentials.user.getIdToken(); // Token is created...
    return token;
  } catch (error) {
    console.error('Error trying to sign in:', error);
    throw error;
  }
}

export async function verifyToken(token: string): Promise<string> {
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    return decodedToken.uid;
  } catch (error) {
    console.error('Error trying to verify token:', error);
    throw error;
  }
}
