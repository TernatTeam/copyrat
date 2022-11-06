import React, { useEffect, useRef } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { Box, Icon } from 'native-base';
import { Ionicons } from '@expo/vector-icons';

import * as Animatable from 'react-native-animatable';
import { useKeyboard } from '../../hooks';

const animate1 = {
  0: { scale: 1, translateY: 0 },
  1: { scale: 1.2, translateY: -14 },
};
const animate2 = {
  0: { scale: 1.2, translateY: -14 },
  1: { scale: 1, translateY: 0 },
};

const circle1 = {
  0: { scale: 0 },
  0.5: { scale: 0.5 },
  1: { scale: 1 },
};
const circle2 = { 0: { scale: 1 }, 0.5: { scale: 0.5 }, 1: { scale: 0 } };

// FUTRE UPDATE WE NEED TO USE react-native-reanimated INSTEAD OF react-native-animatable!!!!

export const TabsContainer = ({ item, onPress, accessibilityState }) => {
  const keyboardStatus = useKeyboard();
  const focused = accessibilityState.selected;
  const viewRef = useRef(null);
  const circleRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    if (!keyboardStatus) {
      if (focused === true) {
        viewRef.current.animate(animate1);
        circleRef.current.animate(circle1);
        textRef.current.transitionTo({ scale: 1 });
      } else {
        viewRef.current.animate(animate2);
        circleRef.current.animate(circle2);
      }
    } else {
      viewRef.current.animate(animate2);
      circleRef.current.animate(circle2);
    }
  }, [focused, keyboardStatus]);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={1}
      style={styles.container}
    >
      <Animatable.View ref={viewRef} duration={400} style={styles.container}>
        <Box
          bg="white"
          borderColor="black"
          borderWidth={2}
          borderRadius={25}
          h="12"
          w="12"
          justifyContent="center"
          alignItems="center"
        >
          <Animatable.View ref={circleRef} style={styles.circle} />
          <Icon as={Ionicons} name={item.icon} size="lg" color="black" />
        </Box>
        <Animatable.Text
          ref={textRef}
          style={[styles.text, { display: focused ? 'flex' : 'none' }]}
        >
          {item.label}
        </Animatable.Text>
      </Animatable.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#add7f0',
    borderRadius: 24,
  },
  text: {
    fontFamily: 'RadioNewsman',
    fontSize: 8,
    textAlign: 'center',
    color: 'black',
    marginTop: 4,
  },
});

export default TabsContainer;
