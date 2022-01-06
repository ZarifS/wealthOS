import {auth, createUserWithEmailAndPassword,
  signInWithEmailAndPassword, adminAuth} from "../utils/firebase";
import * as UserController from "./user";

export async function signUpViaEmail(email:string, password:string): Promise<string> {
  try {
    // Create a new firebase auth user
    const credentials = await createUserWithEmailAndPassword(auth, email, password);
    // Link the auth user to db user collection
    await UserController.createUser(credentials.user.uid, {email});
    return adminAuth.createCustomToken(credentials.user.uid);
  } catch (error) {
    console.error("Error trying to get create user:", error);
    throw error;
  }
}

export async function signInViaEmail(email:string, password:string): Promise<string> {
  try {
    const credentials = await signInWithEmailAndPassword(auth, email, password);
    return adminAuth.createCustomToken(credentials.user.uid);
  } catch (error) {
    console.error("Error trying to sign in:", error);
    throw error;
  }
}

