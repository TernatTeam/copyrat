import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { auth, db } from './firebase-key-config';

export const registration = async (name, email, password) => {
  try {
    await createUserWithEmailAndPassword(auth, email, password).then(
      (userCredential) => {
        const user = userCredential.user;
        setDoc(doc(db, 'users', user.uid), {
          name: name,
          email: email,
          password: password,
          created_at: serverTimestamp(),
        });
      },
    );
    return 200;
  } catch (_) {
    return 500;
  }
};

export const signIn = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);

    return 200;
  } catch (_) {
    return 500;
  }
};

export const forgotPass = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return 200;
  } catch (err) {
    return 500;
  }
};

export const WriteData = async (nestedCollection, data, timestamp = false) => {
  const currentUser = auth.currentUser;
  if (timestamp) {
    data.timestamp = Date.now();
  }

  try {
    await addDoc(
      collection(db, `users/${currentUser.uid}/${nestedCollection}`),
      data,
    );
  } catch (err) {
    console.log(err);
  }
};

// export async function loggingOut() {
//   try {
//     const userLoginData = { email: null, password: null };
//     await firebase.auth().signOut();
//     await AsyncStorage.setItem('userLoginData', JSON.stringify(userLoginData));
//   } catch (err) {
//     Alert.alert('There is something wrong!', err.message);
//   }
// }
