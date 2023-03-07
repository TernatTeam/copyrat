import React, { useEffect, useState } from 'react';

import {
  Box,
  Button,
  Flex,
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
  collection,
  serverTimestamp,
  doc,
  query,
  updateDoc,
  onSnapshot,
  deleteDoc,
  setDoc,
} from 'firebase/firestore';
import { auth, db } from '../../config/firebase/firebase-key-config';

import { useGlobal } from '../../state';

let uIds = [];

export const LobbyPage = ({ navigation, route }) => {
  const [players, setPlayers] = useState([]);
  const [hasLeft, setHasLeft] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [{ roomData }, dispatch] = useGlobal();
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

  const setEndRoundTime = async () => {
    try {
      await setDoc(
        doc(db, 'games', roomData.keyCode, 'admin', 'game_settings'),
        {
          round_start_timestamp: serverTimestamp(),
          round_seconds: route.params.roundSeconds,
        },
      );

      return true;
    } catch (err) {
      console.log(err);
      return false;
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
    updateDoc(doc(db, 'games', roomData.keyCode, 'admin', 'game_state'), {
      is_game_ready: true,
    });

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

    return unsubscribe;
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
              <Box flex={1} bg="primary4.300" px="2" py="1" rounded="sm" mb={4}>
                <Text>{hasLeft.name} left the room</Text>
              </Box>
            );
          },
        });
      }
    }
  }, [hasLeft]);

  useEffect(() => {
    const q = doc(db, 'games', `${roomData.keyCode}/admin/game_state`);
    const unsubscribe = onSnapshot(q, (doc) => {
      if (doc.data().is_game_ready === true) {
        navigation.reset({
          routes: [{ name: 'Chat', params: { round: 1 } }],
        });
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (players.length) {
      dispatch({
        type: 'PLAYER_INFO',
        nameAndColor: players,
      });
    }
  }, [players]);

  // only for dev
  // useEffect(() => {
  //   setPlayers([]);
  // }, []);

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
    <Box safeArea bg="primary1.300" h="100%" w="100%" px="4">
      <Box
        ml="-3"
        mt="1"
        w="full"
        justifyContent="center"
        alignItems="flex-start"
      >
        <IconButton
          icon={<Icon as={<Ionicons name="arrow-back-outline" />} />}
          borderRadius="full"
          _icon={{
            color: 'primary3.300',
            size: '8',
          }}
          _pressed={{
            bg: 'primary3.400',
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
                routes: [{ name: 'Tabs' }],
              });
            } catch (err) {
              console.log('Err: ', err);
            }
          }}
        />
      </Box>

      <Box w="full" alignItems="center" justifyContent="center" pt="4" pb="12">
        <Text
          fontSize="2xl"
          textAlign="center"
          fontFamily="RadioNewsman"
          color="black"
        >
          Room key:
        </Text>

        <Flex direction="row" justifyContent="center" alignItems="center">
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
              color: 'primary3.300',
              size: '5',
            }}
            _pressed={{
              bg: 'primary3.400',
            }}
            onPress={copyToClipboard}
          />
        </Flex>
      </Box>

      <Box px="4" bg="primary1.400" rounded="xl" h="60%">
        <ScrollView w="full">
          {isLoading ? (
            <PlayersLoader />
          ) : (
            <VStack my="2" flex="1" justifyContent="center" alignItems="center">
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
                    <Text fontFamily="RadioNewsman">{player.name}</Text>
                    {player.uid == roomData.game_admin_uid && (
                      <Text fontFamily="RadioNewsman">Room Admin</Text>
                    )}
                  </Flex>
                );
              })}
            </VStack>
          )}
        </ScrollView>
      </Box>

      <Box py="6" mt="auto">
        {auth.currentUser.uid == roomData.game_admin_uid && (
          <Button
            onPress={async () => {
              if (auth.currentUser.uid == roomData.game_admin_uid) {
                const response = await setEndRoundTime();

                if (response) {
                  await setRoles();
                }
              }
            }}
            title="Start"
            rounded="lg"
            medium
            bg={players.length <= 3 ? 'primary1.100' : 'primary3.300'}
            _pressed={{ bg: 'primary3.400' }}
            disabled={isLoadingButton || players.length <= 3}
            isLoading={isLoadingButton}
            _spinner={{ paddingY: '0.45' }}
          >
            <Text
              fontFamily="RadioNewsman"
              color={players.length <= 3 ? 'primary1.300' : 'black'}
            >
              {players.length <= 3 ? '4 players minimum' : 'Start'}
            </Text>
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default LobbyPage;
