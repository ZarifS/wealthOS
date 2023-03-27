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
// import { User } from "../controllers/user";
// import { ItemLinks } from "../controllers/itemLinks";

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
connectAuthEmulator(auth, 'http://localhost:9099');

/**
 * Takes a specific data object and sets its type to whatever is passed.
 * Use this to setup typesafe firestore collections
 * @template T
 * @return {FirebaseFirestore.FirestoreDataConverter<T>}
 */
// const converter = <T>() => ({
//   toFirestore: (data: T) => data,
//   fromFirestore: (snap: FirebaseFirestore.QueryDocumentSnapshot) =>
//     snap.data() as T,
// });

/**
 * Returns a firebase collection using a data converter
 * @template T
 * @param {string} collectionPath
 * @return {FirebaseFirestore.CollectionReference<T>}
 */
// const dataPoint = <T>(collectionPath: string) =>
//   admin.firestore().collection(collectionPath).withConverter(null);

// Setup DB objects
const db = {
  users: admin.firestore().collection('users'),
  itemLinks: admin.firestore().collection('itemLinks'),
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
