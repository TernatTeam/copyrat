import React, { useState } from 'react';

import { Center, Button, Text } from 'native-base';

import {
  collection,
  db,
  getDocs,
} from '../../../config/firebase/firebase-key-config';

let players = [
  {
    name: 'Dragos', //index 0
    role: 'cat',
    no_of_votes: 0,
    vote: 2,
    fakeid: null,
    score: 0,
  },
  {
    name: 'Cosmin', //index 1
    role: 'cat',
    no_of_votes: 0,
    vote: 2,
    fakeid: null,
    score: 0,
  },
  {
    name: 'Mario', //index 2
    role: 'cat',
    no_of_votes: 0,
    vote: 0,
    fakeid: null,
    score: 0,
  },
  {
    name: 'David', //index 3
    role: 'cat',
    no_of_votes: 0,
    vote: 0,
    fakeid: null,
    score: 0,
  },
  {
    name: 'Costin', //index 4
    role: 'cat',
    no_of_votes: 0,
    vote: 3,
    fakeid: null,
    score: 0,
  },
  {
    name: 'Matei', //index 5
    role: 'cat',
    no_of_votes: 0,
    vote: -1,
    fakeid: null,
    score: 0,
  },
];

export const ForgotPasswordPage = ({ navigation }) => {
  const [playersDB, setPlayersDB] = useState([]);

  const setRoles = () => {
    let no_of_rats = players.length / 2;
    let cnt = 0;

    while (cnt < no_of_rats) {
      let val = Math.floor(Math.random() * 5) + 1;
      if (players[val].role === 'cat') {
        players[val].role = 'rat';
        cnt++;
      }
    }

    for (let i = 0; i < players.length; i++) {
      players[i].fakeid = players[i].name;
    }

    let res = players.filter((role) => role.role === 'rat');
    res[0].fakeid = res[no_of_rats - 1].name;

    for (let i = 1; i < no_of_rats; i++) {
      res[i].fakeid = res[i - 1].name;
    }

    navigation.navigate('InGame');
    //alert(JSON.stringify(res));

    // reset roles
  };

  const getPlayers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'games/abcd/players'));
      let playersArray = [];

      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        // console.log(doc.id, ' => ', doc.data());
        playersArray.push(doc.data());
      });

      setPlayersDB(playersArray);
    } catch (err) {
      console.log('Error: ', err);
    }
  };

  return (
    <Center w="100%" h="100%" bgColor="primary1.500">
      <Button
        onPress={() => {
          setRoles();
        }}
      >
        Apasa
      </Button>

      <Button
        onPress={() => {
          getPlayers();
        }}
      >
        Nu apasa
      </Button>

      {playersDB &&
        playersDB.map((player, index) => {
          return <Text key={index}>{player.name}</Text>;
        })}
    </Center>
  );
};

export default ForgotPasswordPage;
export { players };
