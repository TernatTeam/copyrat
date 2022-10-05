import React, { useEffect, useState } from 'react';

import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  IconButton,
  ScrollView,
  Skeleton,
  Text,
  useToast,
  VStack,
} from 'native-base';

import * as Clipboard from 'expo-clipboard';

import { Ionicons } from '@expo/vector-icons';

import {
  auth,
  collection,
  db,
  doc,
  query,
  updateDoc,
  onSnapshot,
  deleteDoc,
} from '../../config/firebase/firebase-key-config';

import { useGlobal } from '../../state';
import { ModalName } from '../components/common';

let uIds = [];

export const LobbyPage = ({ navigation }) => {
  const [players, setPlayers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [hasLeft, setHasLeft] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [{ roomData }] = useGlobal();
  const userNameColors = [
    'lightblue',
    'antiquewhite',
    'aqua',
    'purple',
    'darkmagenta',
    'gainsboro',
  ];
  const toast = useToast();
  const id = 'copy-clipboard-toast';

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(roomData.keyCode);

    if (!toast.isActive(id)) {
      toast.show({
        id,
        duration: 2500,
        placement: 'bottom',
        render: () => {
          return (
            <Box bg="green.500" px="2" py="1" rounded="sm" mb={4}>
              Copied to clipboard
            </Box>
          );
        },
      });
    }
  };

  //Assign roles
  const setRoles = async () => {
    setIsLoadingButton(true);

    let no_of_rats = Math.floor(players.length / 2);

    //arr of 3 rand index
    let arr = [];

    while (arr.length < no_of_rats) {
      let r = Math.floor(Math.random() * players.length);
      if (arr.indexOf(r) === -1) arr.push(r);
    }

    //update roles and fake_id
    for (let i = 0; i < no_of_rats; i++) {
      await updateDoc(
        doc(db, `games/${roomData.keyCode}/players/${uIds[arr[i]]}`),
        {
          fake_id: players[arr[(i + 1) % no_of_rats]].name,
        },
      );
    }

    setIsLoadingButton(false);
  };

  useEffect(() => {
    const q = query(collection(db, `games/${roomData.keyCode}/players`));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          setPlayers((oldValues) => [
            ...oldValues,
            { ...change.doc.data(), uid: change.doc.id },
          ]);
          uIds.push(change.doc.id);

          setIsLoading(false);
        }

        if (change.type === 'modified') {
          const newState = players.map((player) => {
            if (change.doc.id == player.uid) {
              return { ...player, name: player.name };
            }

            return player;
          });

          setPlayers(newState);
        }

        if (change.type === 'removed') {
          setPlayers((oldValues) =>
            oldValues.filter(
              (player) => player.name !== change.doc.data().name,
            ),
          );

          setHasLeft({ id: change.doc.id, name: change.doc.data().name });

          setIsLoading(false);
        }
      });
    });

    return async () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (hasLeft) {
      if (!toast.isActive(hasLeft.id)) {
        toast.show({
          id: hasLeft.id,
          duration: 2500,
          placement: 'top',
          render: () => {
            return (
              <Box flex={1} bg="red.500" px="2" py="1" rounded="sm" mb={4}>
                <Text>{hasLeft.name} left the room</Text>
              </Box>
            );
          },
        });
      }
    }
  }, [hasLeft]);

  const PlayersLoader = () => {
    const loaderArray = [];
    for (let i = 0; i <= 10; i++) {
      loaderArray.push(
        <Box key={i} padding={2}>
          <Skeleton borderRadius={10} />
        </Box>,
      );
    }

    return loaderArray;
  };

  return (
    <Box safeArea bg="primary1.500" h="100%" w="100%">
      <ModalName
        show={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
        userNameColors={userNameColors}
        keyCode={roomData.keyCode}
      />

      <Box px="2" w="full" justifyContent="center" alignItems="flex-start">
        <IconButton
          icon={<Icon as={<Ionicons name="arrow-back-outline" />} />}
          borderRadius="full"
          _icon={{
            color: 'white',
            size: '8',
          }}
          _pressed={{
            bg: 'primary3.600',
          }}
          onPress={async () => {
            try {
              await deleteDoc(
                doc(
                  db,
                  `games/${roomData.keyCode}/players`,
                  auth.currentUser.uid,
                ),
              );

              navigation.reset({
                routes: [{ name: 'Home' }],
              });
            } catch (err) {
              console.log('Err: ', err);
            }
          }}
        />
      </Box>

      <Box w="full" alignItems="center" justifyContent="center">
        <Heading size="2xl" fontWeight="600" color="black">
          Room key:
        </Heading>

        <Flex
          direction="row"
          justifyContent="center"
          alignItems="center"
          mb="12"
        >
          <Text
            textAlign="center"
            fontSize="3xl"
            fontFamily="RadioNewsman"
            color="black"
          >
            {roomData.keyCode}
          </Text>

          <IconButton
            icon={<Icon as={<Ionicons name="copy-outline" />} />}
            borderRadius="full"
            _icon={{
              color: 'white',
              size: '5',
            }}
            _pressed={{
              bg: 'primary3.600',
            }}
            onPress={copyToClipboard}
          />
        </Flex>
      </Box>

      <Box px="6">
        <Heading size="xl" fontWeight="600" color="black">
          Players:
        </Heading>
      </Box>

      <Box px="4" mt="2" mb="12" h="50%">
        <ScrollView w="full">
          {isLoading ? (
            <PlayersLoader />
          ) : (
            <VStack flex="1" justifyContent="center" alignItems="center" px="2">
              {players.map((player, index) => {
                return (
                  <Flex
                    key={index}
                    direction="row"
                    justify="space-between"
                    align="center"
                    bg={player.userNameColor}
                    padding={3}
                    borderRadius={10}
                    my="2"
                    w="full"
                  >
                    <Text fontWeight="bold">{player.name}</Text>
                    {auth.currentUser.uid == roomData.game_admin_uid ? (
                      <Text fontWeight="extrabold">Room Admin</Text>
                    ) : null}
                  </Flex>
                );
              })}
            </VStack>
          )}
        </ScrollView>
      </Box>

      <Box px="6">
        {auth.currentUser.uid == roomData.game_admin_uid && (
          <Button
            onPress={() => {
              if (auth.currentUser.uid == roomData.game_admin_uid) {
                setRoles();
                navigation.navigate('Chat');
              }
            }}
            title="Start"
            rounded="lg"
            medium
            bg="primary3.500"
            _pressed={{ bg: 'primary3.600' }}
            disabled={isLoadingButton}
            isLoading={isLoadingButton}
            _spinner={{ paddingY: '0.45' }}
          >
            <Text fontWeight="semibold" color="black">
              Start
            </Text>
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default LobbyPage;
