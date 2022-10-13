import React from 'react';

import { Box } from 'native-base';

import { InputToolbar } from 'react-native-gifted-chat';

export const inputToolBar = (props) => {
  return (
    <Box h="50px" w="full">
      <InputToolbar
        {...props}
        placeholderTextColor="white"
        containerStyle={{
          color: 'black',
          backgroundColor: 'darkgray',
          borderRadius: 15,
          paddingHorizontal: 4,
        }}
        textInputStyle={{
          color: 'white',
        }}
      />
    </Box>
  );
};

export default inputToolBar;
