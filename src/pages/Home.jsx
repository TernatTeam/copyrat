import React, { useState } from "react";

import {
  Text,
  Image,
  VStack,
  useToast,
  Icon,
  IconButton,
  Box,
  Button,
  HStack,
} from "native-base";

import { Ionicons } from "@expo/vector-icons";

import {
  auth,
  db,
  doc,
  setDoc,
  signOut,
} from "../../config/firebase/firebase-key-config";

import CopyratLogo from "../../assets/logo_trans.png";
import { ModalKeyCode } from "../components/common";
import { useGlobal } from "../../state";
import { TouchableOpacity } from "react-native";

export const HomePage = ({ navigation }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingCreateRoom, setIsLoadingCreateRoom] = useState(false);
  const [isLoadingJoinRoom, setIsLoadingJoinRoom] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [{}, dispatch] = useGlobal();
  const toast = useToast();
  const id = 'voting-toasts';
  const rat_alert = [
    'If they talk about you, they talk about themselves',
    'You’re Italic. I’m in bold.',
    'Go buy yourself a personality.',
    'An original is worth more than a copy. Sometimes.',
    'Don’t study me. You won’t graduate.',
    'Great, a copycat.',
    'A copycat can never influence, but might win.',
    'Parrots mimic their owners.',
    'To copy others is actually why you’re here',
    'I guess you are a fan of monkey’s threat.',
    'No one wants to be you. I promise',
    'Cri-cri...grey autumn...',
    'I’m Yu. He’s Mi.',
  ];

  const logOut = () => {
    signOut(auth).then(() => {
      navigation.reset({
        routes: [{ name: "Login" }],
      });
    });
  };

  const generateRoomKey = async (length) => {
    setIsLoadingCreateRoom(true);
    setIsDisabled(true);

    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const charactersLength = characters.length;

    const currentUser = auth.currentUser;

    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    try {
      await setDoc(doc(db, "games", result), {
        game_admin_uid: currentUser.uid,

        round_number: 1,
      });

      await setDoc(doc(db, "games", result, "admin", "gameState"), {
        is_game_ready: false,
        navToScore: false,
      });

      dispatch({
        type: "ROOM_DATA",
        keyCode: result,
        game_admin_uid: currentUser.uid,
      });

      setIsLoadingCreateRoom(false);
      navigation.reset({
        routes: [{ name: "Lobby" }],
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
      type: "ROOM_DATA",
      keyCode: keyCode,
      game_admin_uid: gameAdminUid,
    });

    setIsLoadingJoinRoom(false);
    navigation.reset({
      routes: [{ name: "Lobby" }],
    });
    setIsDisabled(false);
  };

  const showToast = (message) => {
    if (!toast.isActive(id)) {
      return toast.show({
        id,
        duration: 2500,
        placement: 'top',
        render: () => {
          return (
            <Box
              textAlign="center"
              bg="#71dada"
              px="2"
              py="1"
              rounded="sm"
              mb={5}
              justifyContent="center"
              alignItems="center"
              flex={1}
            >
              <Text fontSize="md" fontWeight="bold">
                {message}
              </Text>
            </Box>
          );
        },
      });
    }
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

      <HStack
        px="4"
        w="full"
        justifyContent="space-between"
        alignItems="flex-start"
      >
        <IconButton
          icon={<Icon as={<Ionicons name="log-out" />} />}
          borderRadius="full"
          _icon={{
            color: "white",
            size: "8",
          }}
          _pressed={{
            bg: "primary3.600",
          }}
          onPress={logOut}
          rotation={180}
        />
        <IconButton
          icon={<Icon as={<Ionicons name="book" />} />}
          borderRadius="full"
          _icon={{
            color: "white",
            size: "8",
          }}
          _pressed={{
            bg: "primary3.600",
          }}
          onPress={() => navigation.navigate("Rules")}
        />
      </HStack>

      <Box px="10">
        <VStack justifyContent="flex-start" alignItems="center" my="16">
          <TouchableOpacity onPress={() => {
                let r = Math.floor(Math.random() * 13);
                showToast(rat_alert[r]);
              }}>
            <Image
              mb="-9"
              alt="Copy Rat Logo"
              source={CopyratLogo}
              style={{ width: 150, height: 150 }}
            />
          </TouchableOpacity>

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
              _pressed={{ bg: "primary3.600" }}
              onPress={() => {
                generateRoomKey(4);
              }}
              disabled={isDisabled}
              isLoading={isLoadingCreateRoom}
              _spinner={{ paddingY: "0.45" }}
            >
              <Text fontFamily="RadioNewsman" color="black">
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
              _pressed={{ bg: "primary3.600" }}
              onPress={() => {
                setIsModalOpen(true);
              }}
              disabled={isDisabled}
              isLoading={isLoadingJoinRoom}
              _spinner={{ paddingY: "0.45" }}
            >
              <Text fontFamily="RadioNewsman" color="black">
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
