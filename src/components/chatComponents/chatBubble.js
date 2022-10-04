import React from 'react';

import { Box, Text } from 'native-base';

import { Bubble } from 'react-native-gifted-chat';

import { auth } from '../../../config/firebase/firebase-key-config';

const chatBubble = (props) => {
  if (props.currentMessage.user._id == auth.currentUser.uid) {
    return (
      <Box
        maxWidth="80%"
        backgroundColor="#DE6F6F"
        borderRadius="xl"
        borderTopRightRadius="0"
        paddingRight="18"
        marginTop="2"
      >
        <Bubble
          {...props}
          textStyle={{
            right: {
              color: 'white',
              textAlign: 'left',
            },
          }}
          wrapperStyle={{
            right: {
              backgroundColor: '#DE6F6F',
              marginRight: -10,
              marginLeft: 0,
            },
          }}
        />
      </Box>
    );
  }

  return (
    <Box
      maxWidth="80%"
      backgroundColor="#DE6F6F"
      borderRadius="xl"
      borderTopLeftRadius="0"
      paddingLeft="18"
      marginTop="2"
    >
      <Text
        mt="1"
        fontWeight="bold"
        fontSize="md"
        color={props.currentMessage.user.userNameColor}
      >
        {props.currentMessage.user.fakeId}
      </Text>

      <Bubble
        {...props}
        textStyle={{
          left: {
            color: 'white',
          },
        }}
        wrapperStyle={{
          left: {
            backgroundColor: '#DE6F6F',
            marginLeft: -10,
            marginRight: 0,
          },
        }}
        time
      />
    </Box>
  );
};

export default chatBubble;
