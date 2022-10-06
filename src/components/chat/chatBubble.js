import React from 'react';

import { Box, Text } from 'native-base';

import { Bubble } from 'react-native-gifted-chat';

import { auth } from '../../../config/firebase/firebase-key-config';

export const chatBubble = (props) => {
  if (props.currentMessage.user._id == auth.currentUser.uid) {
    return (
      <Box
        maxWidth="80%"
        backgroundColor="#a4a4a4"
        borderRadius="xl"
        borderTopRightRadius="0"
        pr="18"
        mt="2"
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
              backgroundColor: '#a4a4a4',
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
      backgroundColor="#a4a4a4"
      borderRadius="xl"
      borderTopLeftRadius="0"
      pl="18"
      mt="2"
    >
      <Text
        mt="1"
        mr="4"
        fontWeight="bold"
        fontSize="md"
        color={props.currentMessage.user.userNameColor}
        isTruncated={true}
        maxWidth="100%"
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
            backgroundColor: '#a4a4a4',
            marginLeft: -10,
            marginRight: 0,
          },
        }}
      />
    </Box>
  );
};

export default chatBubble;
