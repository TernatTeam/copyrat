import { useEffect, useState } from 'react';

import { Keyboard } from 'react-native';

export const useKeyboard = () => {
  const [keyboardStatus, setKeyboardStatus] = useState(false);

  const _keyboardDidShow = () => setKeyboardStatus(true);
  const _keyboardDidHide = () => setKeyboardStatus(false);

  useEffect(() => {
    const subscribeShow = Keyboard.addListener(
      'keyboardDidShow',
      _keyboardDidShow,
    );
    const subscribeHide = Keyboard.addListener(
      'keyboardDidHide',
      _keyboardDidHide,
    );

    return () => {
      subscribeShow.remove();
      subscribeHide.remove();
    };
  }, []);

  return keyboardStatus;
};
