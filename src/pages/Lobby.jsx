import React, { useEffect, useReducer, useState, StyleSheet } from 'react';

import { Box, Button, Icon, Input, Text } from 'native-base';

import { Ionicons } from '@expo/vector-icons';

import { async } from '@firebase/util';
import { updateDoc, increment } from 'firebase/firestore';
import { ImageBackground } from 'react-native';

import {
  addDoc,
  auth,
  collection,
  db,
  doc,
  setDoc,
  getDoc,
  getDocs,
} from '../../config/firebase/firebase-key-config';
import { useGlobal } from '../../state';

let uIds = [];

export const LobbyPage = ({ navigation, route }) => {
  const [playersDB, setPlayersDB] = useState([]);
  const [username, setUsername] = useState('');
  const [{ keycode }] = useGlobal();
  const userNameColors = [
    'lightblue',
    'black',
    'antiquewhite',
    'aqua,purple',
    'darkmagenta',
    'gainsboro',
  ];

  const addPlayerName = async () => {
    const currenUserUID = auth.currentUser.uid;

    try {
      await setDoc(doc(db, `games/${keycode.value}/players/${currenUserUID}`), {
        name: username,
        fake_id: username,
        role: 'cat',
        no_of_votes: 0,
        score: 0,
        vote: null,
        index: 0,
        userNameColor: userNameColors[Math.floor(Math.random() * 7)],
      });
    } catch (err) {
      console.log('Err: ', err);
    }
  };

  const getPlayers = async () => {
    try {
      const querySnapshot = await getDocs(
        collection(db, `games/${keycode.value}/players`),
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

  useEffect(() => {
    getPlayers();
  }, []);

  //Assign roles
  const setRoles = async () => {
    //set index
    for (let i = 0; i < playersDB.length; i++) {
      await updateDoc(doc(db, `games/${keycode.value}/players/` + uIds[i]), {
        index: i,
      });
    }

    let no_of_rats = Math.floor(playersDB.length / 2);

    //arr of 3 rand index
    var arr = [];

    while (arr.length < no_of_rats) {
      var r = Math.floor(Math.random() * playersDB.length);
      if (arr.indexOf(r) === -1) arr.push(r);
    }
    console.log(arr);
    //update roles and fake_id
    for (let i = 0; i < no_of_rats; i++) {
      await updateDoc(
        doc(db, `games/${keycode.value}/players/` + uIds[arr[i]]),
        {
          role: 'rat',
          fake_id: playersDB[arr[(i + 1) % no_of_rats]].name,
        },
      );
    }
  };

  //reset roles and fake_id
  const reset = async () => {
    for (let i = 0; i < playersDB.length; i++) {
      await updateDoc(doc(db, `games/${keycode.value}/players/` + uIds[i]), {
        role: 'cat',
        fake_id: playersDB[i].name,
      });
    }
  };

  return (
    <Box w="100%" h="100%" position="relative" bg="primary1.500" p="4">
      <Text>{keycode.value}</Text>

      <Input
        mb="4"
        borderBottomWidth={2}
        borderBottomColor="black"
        _focus={{
          borderBottomColor: 'white',
          placeholderTextColor: 'white',
        }}
        InputRightElement={
          <Icon
            as={<Ionicons name="person-outline" />}
            size={6}
            mr="2"
            color="white"
          />
        }
        variant="underlined"
        placeholder="Room Key"
        placeholderTextColor="black"
        color="white"
        value={username}
        onChangeText={(value) => {
          setUsername(value);
        }}
      />

      <Button onPress={addPlayerName}>SetName</Button>
      <Button
        style={{ margin: 20 }}
        onPress={async () => {
          const docSnap = await getDoc(doc(db, 'games', keycode.value));

          if (auth.currentUser.uid == docSnap.data().game_admin_uid) {
            setRoles();
          }

          navigation.navigate('Chat');
        }}
      >
        Start
      </Button>
      <Button
        style={{ margin: 100 }}
        onPress={() => {
          reset();
        }}
      >
        Reset
      </Button>
    </Box>
  );
};

export default LobbyPage;
