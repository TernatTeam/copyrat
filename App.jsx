import React, { useEffect, useState } from 'react';

import AppReducer from './reducer/app.reducer';
import { StateProvider } from './state';

import { LogBox } from 'react-native';

import { NativeBaseProvider, StatusBar } from 'native-base';

import theme from './config/theme/colors';
import { useFonts } from 'expo-font';

import Navigator from './routes/index';

import {
  auth,
  onAuthStateChanged,
} from './config/firebase/firebase-key-config';

import { FullPageLoader } from './src/components/common';

LogBox.ignoreLogs([
  'Warning: Async Storage has been extracted from react-native core',
]);

export const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn('Home');
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
  };

  const [loaded] = useFonts({
    RadioNewsman: require('./assets/fonts/RadioNewsman.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <NativeBaseProvider theme={theme} fontStyle="RadioNewsman">
      <StatusBar backgroundColor="black" />
      <StateProvider initialState={initialState} reducer={AppReducer}>
        {isLoggedIn ? <Navigator page={isLoggedIn} /> : <FullPageLoader />}
      </StateProvider>
    </NativeBaseProvider>
  );
};

export default App;
