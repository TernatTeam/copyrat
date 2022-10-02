import { View, Text } from "react-native";
import React, { useEffect, useReducer, useState } from "react";
import { Button } from "native-base";

import {
  collection,
  db,
  getDocs,
} from '../../config/firebase/firebase-key-config';
import { async } from "@firebase/util";
import { doc, updateDoc, increment } from "firebase/firestore";

let uIds = [];

export const LobbyPage = ({ navigation }) => {  
  const [playersDB, setPlayersDB] = useState([]);
 
  const getPlayers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'games/abcd/players'));
      let playersArray = [];
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        // console.log(doc.id, ' => ', doc.data());
        playersArray.push(doc.data());
        uIds.push(doc.id);
      });
      setPlayersDB(playersArray);
    } catch (err) {
      console.log('Error: ', err);
    }
  };

  useEffect(() => {getPlayers()}, [])
  
  //Assign roles
  const setRoles = () => {
    let no_of_rats = playersDB.length / 2;   
    //arr of 3 rand index
    var arr = [];
    while(arr.length < no_of_rats){
      var r = Math.floor(Math.random() * (playersDB.length - 1)) + 1;
      if(arr.indexOf(r) === -1) arr.push(r);
    }
    //update roles and fake_id
    for(let i = 0; i < no_of_rats; i++) {
      updateDoc(doc(db, 'games/abcd/players/' + uIds[arr[i]]), {
          role: "rat" ,
          fake_id: playersDB[arr[(i + 1) % no_of_rats]].name
      });
    }
  }

  //reset roles and fake_id
  const reset = () => {
    for(let i = 0; i < playersDB.length; i++) {
      updateDoc(doc(db, 'games/abcd/players/' + uIds[i]), {
        role: "cat" ,
        fake_id: playersDB[i].name
    });
    }
  }

  return (
    <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
      <Text>Lobby Page</Text>
      <Button onPress={() => {
        setRoles();
        navigation.navigate("Chat")
        }
        }>Start
      </Button>
      
      <Button onPress={() => {
        reset();
      }
      }>Reset
      </Button>
    </View>
  );
};

export default LobbyPage;