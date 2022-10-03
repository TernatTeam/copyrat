import React, { useState } from 'react';

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
import { ModalKeyCode } from '../components/common';

export const HomePage = ({ navigation }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

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

      // set data for admin
      await setDoc(doc(db, `games/${result}/players`, currentUser.uid), {
        muie: 'dragos',
      });

      navigation.navigate('Lobby', {
        roomKey: result,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const joinGame = async (keyCode) => {
    const currentUser = auth.currentUser;

    try {
      await setDoc(doc(db, `games/${keyCode}/players/${currentUser.uid}`), {
        muie: 'dragos',
      });

      setIsModalOpen(false);

      navigation.navigate('Lobby', {
        roomKey: keyCode,
      });
    } catch (err) {
      console.log('Err: ', err);
    }
  };

  return (
    <Box bg="primary1.500" h="100%" w="100%" position="relative">
      <ModalKeyCode
        show={isModalOpen}
        onClose={(keyCode) => {
          setIsModalOpen(false);
          joinGame(keyCode);
        }}
      />

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

          <Button
            onPress={() => {
              setIsModalOpen(true);
            }}
          >
            Join
          </Button>
        </HStack>
      </Center>
    </Box>
  );
};

export default HomePage;
