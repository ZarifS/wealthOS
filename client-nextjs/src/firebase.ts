// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, setPersistence, browserLocalPersistence, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

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
  
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Setup emulator for when running in local development
if (process.env.NODE_ENV === 'development') {
    connectAuthEmulator(auth, 'http://127.0.0.1:9099');
}

export { auth, setPersistence, browserLocalPersistence, signInWithEmailAndPassword, createUserWithEmailAndPassword };
