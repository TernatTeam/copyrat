import { getApp, getApps, initializeApp } from 'firebase/app';
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
  serverTimestamp,
  increment,
} from 'firebase/firestore';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  getAuth,
  signOut,
  sendPasswordResetEmail,
  initializeAuth,
} from 'firebase/auth';

import { getReactNativePersistence } from 'firebase/auth/react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

const configKeys = {
  apiKey: 'AIzaSyDXl7WAJij4smf3ETP4EVv_hApGzvsbE-I',
  authDomain: 'copyrat-7b7d6.firebaseapp.com',
  projectId: 'copyrat-7b7d6',
  storageBucket: 'copyrat-7b7d6.appspot.com',
  messagingSenderId: '332746644139',
  appId: '1:332746644139:web:977492c8cc6feacb5df5ee',
  measurementId: 'G-3B49ECP7L8',
};

let firebaseApp;
let auth;

if (getApps().length < 1) {
  firebaseApp = initializeApp(configKeys);
  auth = initializeAuth(firebaseApp, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} else {
  firebaseApp = getApp();
  auth = getAuth(firebaseApp);
}

const db = getFirestore(firebaseApp);

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
  serverTimestamp,
  increment,
};
