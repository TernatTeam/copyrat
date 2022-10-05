import React from 'react';

import { VStack, Spinner, Text, Image, Center } from 'native-base';

import CopyratLogo from '../../../assets/logo_trans.png';

export const FullPageLoader = () => {
  return (
    <Center bg="primary1.500" h="100%" w="100%">
      <VStack justifyContent="center" alignItems="center" mb="12">
        <Image
          alt="Copy Rat Logo"
          source={CopyratLogo}
          style={{ width: 150, height: 150 }}
        />

        <Text fontSize="3xl" fontFamily="RadioNewsman" color="black">
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

export default FullPageLoader;
