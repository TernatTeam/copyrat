import React, { useEffect, useRef } from 'react';

import { StyleSheet } from 'react-native';

import { VStack, Spinner, Text, Image, Center } from 'native-base';

import * as Animatable from 'react-native-animatable';

import CopyratLogo from '../../../assets/logo_trans.png';

const circle1 = {
  0: { scale: 0 },
  0.5: { scale: 0.5 },
  1: { scale: 1 },
};
const circle2 = { 0: { scale: 1 }, 0.5: { scale: 0.5 }, 1: { scale: 0 } };

export const FullPageLoader = () => {
  const circleRef = useRef(null);

  useEffect(() => {
    circleRef.current.animate(circle1);
  }, []);

  return (
    <Center
      style={{ ...StyleSheet.absoluteFillObject }}
      bg="primary1.500"
      h="100%"
      w="100%"
    >
      <Animatable.View ref={circleRef} style={styles.circle} />

      <VStack justifyContent="center" alignItems="center" mb="12">
        <Image alt="Copy Rat Logo" source={CopyratLogo} size="xl" />

        <Text fontSize="5xl" fontFamily="RadioNewsman" color="black">
          copyrat
        </Text>
      </VStack>

      <Spinner
        color="white"
        accessibilityLabel="Loading pages"
        style={{ transform: [{ scaleX: 2.5 }, { scaleY: 2.5 }] }}
      />
    </Center>
  );
};

const styles = StyleSheet.create({
  circle: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#add7f0',
    borderRadius: 200,
    height: '100%',
    width: '100%',
  },
});

export default FullPageLoader;
