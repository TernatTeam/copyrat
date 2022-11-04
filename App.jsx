import React, { useEffect, useState } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

import AppReducer from './reducer/app.reducer';
import { StateProvider } from './state';

import { NativeBaseProvider, StatusBar } from 'native-base';

import theme from './config/theme/colors';
import { useFonts } from 'expo-font';

import Navigator from './routes/index';

import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './config/firebase/firebase-key-config';

import { FullPageLoader } from './src/components/common';
import { doc, getDoc } from 'firebase/firestore';

export const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState();

  const checkForLocalStorage = async (user) => {
    try {
      const jsonValue = await AsyncStorage.getItem('user');
      if (jsonValue) {
        return;
      } else {
        storeData(user);
      }
    } catch (err) {
      console.log('Err: ', err);
    }
  };

  const storeData = async (user) => {
    const docRef = doc(db, `users/${user.uid}`);
    // in this case user is the storage key we
    // need to has this and put the key in a safe place like db maybe
    try {
      const docSnap = await getDoc(docRef);
      const jsonValue = JSON.stringify({
        ...user,
        name: docSnap.data().name,
        role: docSnap.data()?.role ? docSnap.data().role : null,
      });
      await AsyncStorage.setItem('user', jsonValue);
    } catch (err) {
      console.log('Err: ', err);
    }
  };

  // const removeValue = async () => {
  //   try {
  //     await AsyncStorage.removeItem('user');
  //   } catch (e) {
  //     // remove error
  //   }

  //   console.log('Done.');
  // };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const { email, emailVerified, uid, metadata } = user;
        const { createdAt, lastLoginAt } = metadata;

        checkForLocalStorage({
          email: email,
          emailVerified: emailVerified,
          uid: uid,
          createdAt: createdAt,
          lastLoginAt: lastLoginAt,
        });

        setIsLoggedIn('Tabs');
      } else {
        setIsLoggedIn('Login');
      }
    });
  }, []);

  const initialState = {
    roomData: {
      keyCode: null,
      game_admin_uid: null,
    },
    playerInfo: {
      nameAndColor: [],
    },
  };

  const [loaded] = useFonts({
    RadioNewsman: require('./assets/fonts/RadioNewsman.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <NativeBaseProvider theme={theme} fontStyle="RadioNewsman">
      <StatusBar backgroundColor="#747474" />
      <StateProvider initialState={initialState} reducer={AppReducer}>
        {isLoggedIn ? <Navigator page={isLoggedIn} /> : <FullPageLoader />}
      </StateProvider>
    </NativeBaseProvider>
  );
};

export default App;
