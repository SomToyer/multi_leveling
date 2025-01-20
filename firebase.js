import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC4S-swCYKETJ3P6CXZm2RJoMEsLwO8z4k",
  authDomain: "multileveling-a1b45.firebaseapp.com",
  projectId: "multileveling-a1b45",
  storageBucket: "multileveling-a1b45.firebasestorage.app",
  messagingSenderId: "599611697635",
  appId: "1:599611697635:web:cc7282caf7a7750f2198d6",
  measurementId: "G-LDLKJ45NZ6"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);