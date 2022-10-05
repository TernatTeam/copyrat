import React, { useEffect, useState } from 'react';

import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  IconButton,
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
  getDocs,
  query,
  updateDoc,
  onSnapshot,
  deleteDoc,
} from '../../config/firebase/firebase-key-config';

import { useGlobal } from '../../state';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';
import { ModalName } from '../components/common';

let uIds = [];

export const LobbyPage = ({ navigation }) => {
  const [players, setPlayers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [{ roomData }] = useGlobal();
  const userNameColors = [
    'lightblue',
    'black',
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

  const getPlayers = async () => {
    try {
      const querySnapshot = await getDocs(
        collection(db, `games/${roomData.keyCode}/players`),
      );
      let playersArray = [];
      querySnapshot.forEach((doc) => {
        playersArray.push(doc.data());
        uIds.push(doc.id);
      });
      setPlayersDB(playersArray);
    } catch (err) {
      console.log('Error: ', err);
    }
  };

  //Assign roles
  const setRoles = async() => {
    let no_of_rats = Math.floor(players.length / 2);

    //arr of 3 rand index
    var arr = [];
    
    while (arr.length < no_of_rats) {
      var r = Math.floor(Math.random() * (players.length)) ;
      if (arr.indexOf(r) === -1) arr.push(r);
    }
    
    //update roles and fake_id
    for (let i = 0; i < no_of_rats; i++) {
      try {
        await updateDoc(doc(db, `games/${roomData.keyCode}/players/` + uIds[arr[i]]), {
          fake_id: players[arr[(i + 1) % no_of_rats]].name,
        });
      }
      catch (err){
        console.log(err);
      }
      
    }
  };

  //reset roles and fake_id
  // const reset = async () => {
  //   for (let i = 0; i < playersDB.length; i++) {
  //     await updateDoc(doc(db, `games/${roomData.keyCode}/players/` + uIds[i]), {
  //       role: 'cat',
  //       fake_id: playersDB[i].name,
  //     });
  //   }
  // };

  useEffect(() => {
    // getPlayers();
    const q = query(collection(db, `games/${roomData.keyCode}/players`));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          uIds.push(change.doc.id);
          // console.log('cv');
          setPlayers((oldValues) => [...oldValues, change.doc.data()]);
          // console.log('bagat', change.doc.data());
        }

        if (change.type === 'modified') {
          // console.log('baga', change.doc.data());
        }

        if (change.type === 'removed') {
          setPlayers((oldValues) =>
            oldValues.filter(
              (player) => player.name !== change.doc.data().name,
            ),
          );
        }
      });
    });
/*
    return async () => {
      unsubscribe();
      try {
        await deleteDoc(
          doc(db, `games/${roomData.keyCode}/players`, auth.currentUser.uid),
        );
      } catch (err) {
        console.log('Err: ', err);
      }
    };*/
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Box safeArea bg="primary1.500" h="100%" w="100%">
        <ModalName
          show={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
          }}
          userNameColors={userNameColors}
          keyCode={roomData.keyCode}
        />

        <Box w="full" alignItems="center" justifyContent="center" p="12">
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

        <Box w="full" px="16">
          <VStack>
            {auth.currentUser.uid == roomData.game_admin_uid && (
              <Button
                style={{ margin: 20 }}
                onPress={() => {
                  if (auth.currentUser.uid == roomData.game_admin_uid) {
                    console.log(players);
                    setRoles();
                    navigation.navigate('Chat');
                  }
                }}
              >
                Start
              </Button>
            )}

            {/* <Button
          style={{ margin: 100 }}
          onPress={() => {
            reset();
          }}
        >
          Reset
        </Button> */}
            {players.map((player, index) => {
              return <Text key={index}>{player.name}</Text>;
            })}
          </VStack>
        </Box>
      </Box>
    </TouchableWithoutFeedback>
  );
};

export default LobbyPage;
