import React from 'react';

import { NativeBaseProvider, StatusBar } from 'native-base';

import Navigator from './routes/index';
import theme from './config/theme/colors';

export const App = () => {
  return (
    <NativeBaseProvider theme={theme}>
      <StatusBar backgroundColor="#1A1A1A" />
      <Navigator />
    </NativeBaseProvider>
  );
};

export default App;
