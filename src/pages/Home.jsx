import React from 'react';

import {
  Text,
  Image,
  VStack,
  Center,
  Icon,
  IconButton,
  Box,
  Button,
  HStack,
} from 'native-base';

import { Ionicons } from '@expo/vector-icons';

import {
  auth,
  db,
  doc,
  setDoc,
  signOut,
} from '../../config/firebase/firebase-key-config';

import CopyratLogo from '../../assets/logo_trans.png';

export const HomePage = ({ navigation }) => {
  const logOut = () => {
    signOut(auth).then(() => {
      navigation.reset({
        routes: [{ name: 'Login' }],
      });
    });
  };

  const generateRoomKey = async (length) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const charactersLength = characters.length;

    const currentUser = auth.currentUser;

    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    try {
      await setDoc(doc(db, 'games', result), {
        game_admin_uid: currentUser.uid,
      });

      navigation.navigate('Lobby', {
        roomKey: result,
      });
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <Box bg="primary1.500" h="100%" w="100%" position="relative">
      <IconButton
        position="absolute"
        top="8"
        left="8"
        icon={<Icon as={<Ionicons name="settings-outline" />} />}
        borderRadius="full"
        _icon={{
          color: 'white',
          size: '8',
        }}
        _pressed={{
          bg: 'primary3.600',
        }}
        onPress={logOut}
      />

      <VStack justifyContent="flex-start" alignItems="center" my="16">
        <Image
          alt="Copy Rat Logo"
          source={CopyratLogo}
          style={{ width: 150, height: 150 }}
        />

        <Text fontSize="5xl" fontFamily="RadioNewsman" color="black">
          Copy Rat
        </Text>
      </VStack>

      <Center w="full">
        <HStack space="sm">
          <Button
            onPress={() => {
              generateRoomKey(4);
            }}
          >
            Create
          </Button>

          <Button>Join</Button>
        </HStack>
      </Center>
    </Box>
  );
};

export default HomePage;
