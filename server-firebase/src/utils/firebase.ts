/**
 * Helper file to encapsulate firebase connections
 */
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  connectAuthEmulator,
  signInWithCustomToken,
} from 'firebase/auth';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const serviceAccount = require('../../serviceAccountCredentials.json');

// Config for client SDK
const firebaseConfig = {
  apiKey: 'AIzaSyCOwjt_VcFITdvVtgq9vqZO7e8A-WkuHKc',
  authDomain: 'wealthos.firebaseapp.com',
  projectId: 'wealthos',
  storageBucket: 'wealthos.appspot.com',
  messagingSenderId: '392986235727',
  appId: '1:392986235727:web:242175f43fa52bdcdbeb3a',
  measurementId: 'G-SYJ7N0HH26',
};

// Init admin app with secret account keys and configs
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
admin.firestore().settings({
  ignoreUndefinedProperties: true,
});
const adminAuth = admin.auth();

// Initialize Firebase client SDK
const client = initializeApp(firebaseConfig);

// Authentication for Client SDK
const auth = getAuth(client);

// Setup emulator for when running in local development
if (process.env.NODE_ENV === 'development') {
  connectAuthEmulator(auth, 'http://localhost:9099');
}

// Setup DB objects
const db = {
  users: admin.firestore().collection('users'),
  itemLinks: admin.firestore().collection('itemLinks'),
  transactions: admin.firestore().collection('transactions'),
  spaces: admin.firestore().collection('spaces'),
};

export {
  db,
  functions,
  auth,
  adminAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithCustomToken,
};
