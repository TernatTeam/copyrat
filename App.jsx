import React, { useEffect, useState } from 'react';

import AppReducer from './reducer/app.reducer';
import { StateProvider } from './state';

import { NativeBaseProvider, StatusBar } from 'native-base';

import theme from './config/theme/colors';
import { useFonts } from 'expo-font';

import Navigator from './routes/index';

import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase/firebase-key-config';

import { FullPageLoader } from './src/components/common';

export const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
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
