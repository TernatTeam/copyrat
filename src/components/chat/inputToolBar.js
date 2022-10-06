import React from 'react';

import { Box } from 'native-base';

import { InputToolbar } from 'react-native-gifted-chat';

const inputToolBar = (props) => {
  return (
    <Box h="50px" w="full" py="4">
      <InputToolbar
        {...props}
        containerStyle={{
          color: 'black',
          backgroundColor: 'darkgray',
          borderRadius: 15,
          paddingHorizontal: 2,
          height: 45,
        }}
        textInputStyle={{
          color: 'white',
        }}
      />
    </Box>
  );
};

export default inputToolBar;
