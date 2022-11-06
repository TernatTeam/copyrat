import React from 'react';

import { Icon, Input } from 'native-base';

import { Ionicons } from '@expo/vector-icons';

export const UnderlinedInput = ({
  isInvalid = false,
  value,
  icon,
  iconColor = "white", 
  placeholder,
  type = 'text',
  iconClickedCallback,
  isIconClickable = false,
  ...props
}) => {
  return (
    <Input
      type={type}
      {...props}
      borderBottomWidth={2}
      borderBottomColor={`${isInvalid ? 'red.500' : 'black'}`}
      _focus={
        isInvalid
          ? {
              borderBottomColor: 'red.500',
              placeholderTextColor: 'red.500',
            }
          : {
              borderBottomColor: 'white',
              placeholderTextColor: 'white',
            }
      }
      InputRightElement={
        <Icon
          as={<Ionicons name={icon} />}
          size={6}
          mr="2"
          color={isInvalid ? `red.500` : iconColor}
          onPress={() => {
            if (isIconClickable) {
              iconClickedCallback();
            }
          }}
        />
      }
      variant="underlined"
      placeholder={placeholder}
      placeholderTextColor={isInvalid ? `red.500` : 'black'}
      color={isInvalid ? 'red.500' : 'white'}
      value={value}
    />
  );
};

export default UnderlinedInput;
