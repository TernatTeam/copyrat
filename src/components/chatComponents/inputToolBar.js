import React from 'react';

import { InputToolbar } from 'react-native-gifted-chat';

const inputToolBar = (props) => {
  return (
    <InputToolbar
      {...props}
      containerStyle={{
        backgroundColor: 'darkgray',
        borderRadius: 30,
        flex: 1,
        margin: 5,
      }}
      textInputStyle={{ color: 'white', width: 100 }}
      placeHolderColor={'white'}
    />
  );
};

export default inputToolBar;
