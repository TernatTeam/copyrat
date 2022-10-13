import React from 'react';

import { Send } from 'react-native-gifted-chat';

export const sendButton = (props) => {
  return <Send {...props} textStyle={{ color: 'white' }} />;
};

export default sendButton;
