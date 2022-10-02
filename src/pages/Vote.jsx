import { View, Text } from "react-native";
import React, { useEffect, useReducer, useState } from "react";
import { Button } from "native-base";
import { playersDB } from "./Lobby";

import {
  collection,
  db,
  getDocs,
} from '../../config/firebase/firebase-key-config';


export const VotePage = ({ navigation }) => {
  const [playersDB, setPlayersDB] = useState([]);
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

  useEffect(() => {getPlayers()}, [])
  useEffect(() => {console.log(playersDB)}, [playersDB])
  
  return (
    <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
      <Text>Vote Page</Text>
      <Button onPress={() => navigation.navigate("Chat")}>NextRound</Button>
    </View>
  );
};

export default VotePage;
