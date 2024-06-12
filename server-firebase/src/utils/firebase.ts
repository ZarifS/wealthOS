/**
 * Helper file to encapsulate firebase connections
 */
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const serviceAccount = require('../../serviceAccountCredentials.json');

// Init admin app with secret account keys and configs
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
admin.firestore().settings({
  ignoreUndefinedProperties: true,
});
const adminAuth = admin.auth();

// Setup DB objects
const db = {
  users: admin.firestore().collection('users'),
  itemLinks: admin.firestore().collection('itemLinks'),
  transactions: admin.firestore().collection('transactions'),
  spaces: admin.firestore().collection('spaces'),
};

export { db, functions, adminAuth };
