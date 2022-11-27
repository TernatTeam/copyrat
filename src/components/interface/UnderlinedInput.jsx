import React, { useState } from 'react';

import { Icon, Input } from 'native-base';

import { Ionicons } from '@expo/vector-icons';

export const UnderlinedInput = ({
  isInvalid = false,
  value,
  icon,
  textInputColor = 'white',
  iconColor = 'white',
  focusIconColor = 'white',
  inputColor = 'white',
  focusInputColor = 'white',
  placeholder,
  type = 'text',
  iconClickedCallback,
  isIconClickable = false,
  ...props
}) => {
  const [focusIcon, setFocusIcon] = useState(false);

  return (
    <Input
      type={type}
      {...props}
      borderBottomWidth={2}
      borderBottomColor={`${isInvalid ? 'primary4.300' : inputColor}`}
      onFocus={() => setFocusIcon(true)}
      onBlur={() => {
        setFocusIcon(false);
      }}
      _focus={
        isInvalid
          ? {
              borderBottomColor: 'primary4.300',
              placeholderTextColor: 'primary4.300',
            }
          : {
              borderBottomColor: focusInputColor,
              placeholderTextColor: focusInputColor,
            }
      }
      InputRightElement={
        <Icon
          as={<Ionicons name={icon} />}
          size={6}
          mr="2"
          color={
            isInvalid ? `primary4.300` : focusIcon ? focusIconColor : iconColor
          }
          onPress={() => {
            if (isIconClickable) {
              iconClickedCallback();
            }
          }}
        />
      }
      variant="underlined"
      placeholder={placeholder}
      placeholderTextColor={isInvalid ? `primary4.300` : inputColor}
      value={value}
      color={textInputColor}
    />
  );
};

export default UnderlinedInput;
