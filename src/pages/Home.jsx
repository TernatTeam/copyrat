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

        round_number: 1,
      });

      await setDoc(doc(db, 'games', result, 'admin', 'gameState'), {
        is_game_ready: false,
        navToScore: false,
      });

      dispatch({
        type: 'ROOM_DATA',
        keyCode: result,
        game_admin_uid: currentUser.uid,
      });

      setIsLoadingCreateRoom(false);
      navigation.reset({
        routes: [{ name: 'Lobby' }],
      });
      setIsDisabled(false);
    } catch (err) {
      console.log(err);
    }
  };

  const joinGame = async (keyCode, gameAdminUid) => {
    setIsModalOpen(false);
    setIsLoadingJoinRoom(true);
    setIsDisabled(true);

    dispatch({
      type: 'ROOM_DATA',
      keyCode: keyCode,
      game_admin_uid: gameAdminUid,
    });

    setIsLoadingJoinRoom(false);
    navigation.reset({
      routes: [{ name: 'Lobby' }],
    });
    setIsDisabled(false);
  };

  return (
    <Box safeArea bg="primary1.500" h="100%" w="100%">
      <ModalKeyCode
        show={isModalOpen}
        onClose={(keyCode, gameAdminUid) => {
          setIsModalOpen(false);

          if (keyCode && gameAdminUid) {
            joinGame(keyCode, gameAdminUid);
          }
        }}
      />

      <Box px="6" w="full" justifyContent="center" alignItems="flex-start">
        <IconButton
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
      </Box>

      <Box px="12">
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
          h="45%"
        >
          <Box w="full" alignItems="flex-start" mb="20">
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
    </Box>
  );
};

export default HomePage;
