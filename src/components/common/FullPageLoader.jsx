import React, { useEffect, useRef, useState } from 'react';

import { StyleSheet, Dimensions } from 'react-native';

import { VStack, Spinner, Text, Image, Center, Box } from 'native-base';

import * as Animatable from 'react-native-animatable';

import CopyratLogo from '../../../assets/logo_trans.png';

const circle1 = {
  0: { scale: 0 },
  0.5: { scale: 0.5 },
  1: { scale: 1 },
};

const windowHeight = Dimensions.get('window').height;

export const FullPageLoader = () => {
  const circleRef = useRef(null);

  useEffect(() => {
    circleRef.current.animate(circle1);
  }, []);

  return (
    <Center bg="primary1.400" h="100%" w="100%" position="relative">
      <Box position="absolute" h={windowHeight + 200} w={windowHeight + 200}>
        <Animatable.View ref={circleRef} duration={400} style={styles.circle} />
      </Box>

      <VStack justifyContent="center" alignItems="center" mb="12">
        <Image alt="Copy Rat Logo" source={CopyratLogo} size="xl" />

        <Text fontSize="5xl" fontFamily="RadioNewsman" color="black">
          copyrat
        </Text>
      </VStack>

      <Spinner
        color="black"
        accessibilityLabel="Loading pages"
        style={{ transform: [{ scaleX: 2.5 }, { scaleY: 2.5 }] }}
      />
    </Center>
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
    backgroundColor: '#d8ecf8',
    borderRadius: (windowHeight + 200) / 2,
    height: '100%',
    width: '100%',
  },
});

export default FullPageLoader;
