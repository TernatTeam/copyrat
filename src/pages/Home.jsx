import React, { useState } from 'react';

import {
  Text,
  Image,
  VStack,
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
import { useGlobal } from '../../state';

export const HomePage = ({ navigation }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingCreateRoom, setIsLoadingCreateRoom] = useState(false);
  const [isLoadingJoinRoom, setIsLoadingJoinRoom] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [{}, dispatch] = useGlobal();

  const logOut = () => {
    signOut(auth).then(() => {
      navigation.reset({
        routes: [{ name: 'Login' }],
      });
    });
  };

  const generateRoomKey = async (length) => {
    setIsLoadingCreateRoom(true);
    setIsDisabled(true);

    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
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

      dispatch({
        type: 'KEYCODE',
        value: result,
      });

      setIsLoadingCreateRoom(false);
      navigation.navigate('Lobby');
      setIsDisabled(false);
    } catch (err) {
      console.log(err);
    }
  };

  const joinGame = async (keyCode) => {
    setIsLoadingJoinRoom(true);
    setIsDisabled(true);

    const currentUser = auth.currentUser;

    try {
      await setDoc(doc(db, `games/${keyCode}/players/${currentUser.uid}`), {
        muie: 'dragos',
      });

      setIsModalOpen(false);

      dispatch({
        type: 'KEYCODE',
        value: keyCode,
      });

      setIsLoadingJoinRoom(false);
      navigation.navigate('Lobby');
      setIsDisabled(false);
    } catch (err) {
      console.log('Err: ', err);
    }
  };

  return (
    <Box bg="primary1.500" h="100%" w="100%" position="relative" px="12">
      <ModalKeyCode
        show={isModalOpen}
        onClose={(keyCode) => {
          setIsModalOpen(false);

          if (keyCode) {
            joinGame(keyCode);
          }
        }}
      />

      <IconButton
        position="absolute"
        top="4"
        left="6"
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
          copyrat
        </Text>
      </VStack>

      <HStack
        flexDirection="column"
        justifyContent="center"
        alignItems="flex-end"
        w="full"
        h="35%"
      >
        <Box w="full" alignItems="flex-start" mb="16">
          <Button
            w="50%"
            title="Create Room"
            rounded="lg"
            medium
            bg="primary3.500"
            _pressed={{ bg: 'primary3.600' }}
            onPress={() => {
              generateRoomKey(4);
            }}
            disabled={isDisabled}
            isLoading={isLoadingCreateRoom}
            _spinner={{ paddingY: '0.45' }}
          >
            <Text fontWeight="semibold" color="black">
              Create room
            </Text>
          </Button>
        </Box>

        <Box w="full" alignItems="flex-end">
          <Button
            w="50%"
            title="Join Room"
            rounded="lg"
            medium
            bg="primary3.500"
            _pressed={{ bg: 'primary3.600' }}
            onPress={() => {
              setIsModalOpen(true);
            }}
            disabled={isDisabled}
            isLoading={isLoadingJoinRoom}
            _spinner={{ paddingY: '0.45' }}
          >
            <Text fontWeight="semibold" color="black">
              Join room
            </Text>
          </Button>
        </Box>
      </HStack>
    </Box>
  );
};

export default HomePage;
