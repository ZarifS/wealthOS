import axios from 'axios';
import { auth, setPersistence, browserLocalPersistence, signInWithEmailAndPassword, createUserWithEmailAndPassword } from '../firebase';
import { getAPIServerURL } from '../utils';
const API_URL = getAPIServerURL() + '/auth';
const USER_API_URL = getAPIServerURL() + '/user';

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmedPassword: string;
}

export interface LoginPayload {
  email: string;
  password: string;
  preserveLogin?: boolean;
}

const signUp = async ({
  firstName,
  lastName,
  email,
  password,
  confirmedPassword,
  }: RegisterPayload) => {
  try {
    if (password !== confirmedPassword) {
      throw new Error('Passwords do not match.');
    }
    await setPersistence(auth, browserLocalPersistence);
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log('Signed up using email and password in firebase client side auth.')
    const token = await userCredential.user.getIdToken();
    localStorage.setItem('authToken', token);  // Store token in local storage

    // Create a new user in the database
    await axios.post(USER_API_URL, {
      authUid: userCredential.user.uid,
      email,
      firstName,
      lastName,
    }, 
      {
      headers: {
        Authorization: token,
      },
    });

    return token;
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
}

const signIn = async ({email, password}: LoginPayload) => {
  try {
    await setPersistence(auth, browserLocalPersistence);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const token = await userCredential.user.getIdToken();
    localStorage.setItem('authToken', token);  // Store token in local storage

    return token;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
}

const service = {
  signUp,
  signIn,
};

export default service;
