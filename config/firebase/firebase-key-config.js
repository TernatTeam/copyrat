import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  addDoc,
  getDocs,
  getDoc,
  deleteDoc,
  query,
  onSnapshot,
  orderBy,
  updateDoc,
} from 'firebase/firestore';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  getAuth,
  signOut,
  sendPasswordResetEmail,
} from 'firebase/auth';

// don't have time for this but we need to upgrade with this bc yeah you can see that yellow warrning on expo start but later...
// doc:https://react-native-async-storage.github.io/async-storage/docs/usage
// import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseApp = initializeApp({
  apiKey: 'AIzaSyDXl7WAJij4smf3ETP4EVv_hApGzvsbE-I',
  authDomain: 'copyrat-7b7d6.firebaseapp.com',
  projectId: 'copyrat-7b7d6',
  storageBucket: 'copyrat-7b7d6.appspot.com',
  messagingSenderId: '332746644139',
  appId: '1:332746644139:web:977492c8cc6feacb5df5ee',
  measurementId: 'G-3B49ECP7L8',
});

const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

export {
  db,
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  doc,
  setDoc,
  sendPasswordResetEmail,
  collection,
  addDoc,
  getDocs,
  getDoc,
  deleteDoc,
  query,
  onSnapshot,
  orderBy,
  updateDoc,
};
