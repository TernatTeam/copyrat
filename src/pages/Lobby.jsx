import React, { useEffect, useReducer, useState } from 'react';

import { View, StyleSheet } from 'react-native';
import { Box, Button, Text, Image } from 'native-base';

// import {
//   collection,
//   db,
//   getDocs,
// } from '../../config/firebase/firebase-key-config';
// import { async } from '@firebase/util';
// import { doc, updateDoc, increment } from 'firebase/firestore';
// import { ImageBackground } from 'react-native';

import background from '../../assets/background.png';

// let uIds = [];

export const LobbyPage = ({ navigation, route }) => {
  // const [playersDB, setPlayersDB] = useState([]);
  const { roomKey } = route.params;

  // const getPlayers = async () => {
  //   try {
  //     const querySnapshot = await getDocs(collection(db, 'games/abcd/players'));
  //     let playersArray = [];
  //     querySnapshot.forEach((doc) => {
  //       // doc.data() is never undefined for query doc snapshots
  //       // console.log(doc.id, ' => ', doc.data());
  //       playersArray.push(doc.data());
  //       uIds.push(doc.id);
  //     });
  //     setPlayersDB(playersArray);
  //   } catch (err) {
  //     console.log('Error: ', err);
  //   }
  // };

  // useEffect(() => {
  //   getPlayers();
  // }, []);

  //Assign roles
  // const setRoles = () => {
  //   let no_of_rats = playersDB.length / 2;
  //   //arr of 3 rand index
  //   var arr = [];
  //   while (arr.length < no_of_rats) {
  //     var r = Math.floor(Math.random() * (playersDB.length - 1)) + 1;
  //     if (arr.indexOf(r) === -1) arr.push(r);
  //   }
  //   //update roles and fake_id
  //   for (let i = 0; i < no_of_rats; i++) {
  //     updateDoc(doc(db, 'games/abcd/players/' + uIds[arr[i]]), {
  //       role: 'rat',
  //       fake_id: playersDB[arr[(i + 1) % no_of_rats]].name,
  //     });
  //   }
  // };

  //reset roles and fake_id
  // const reset = () => {
  //   for (let i = 0; i < playersDB.length; i++) {
  //     updateDoc(doc(db, 'games/abcd/players/' + uIds[i]), {
  //       role: 'cat',
  //       fake_id: playersDB[i].name,
  //     });
  //   }
  // };

  return (
    // <View
    //   style={{
    //     alignItems: 'center',
    //     justifyContent: 'center',
    //     flex: 1,
    //     backgroundColor: '#747474',
    //   }}
    // >
    //   <ImageBackground
    //     source={require('../../assets/logo_trans.png')}
    //     style={{
    //       width: 500,
    //       height: 500,
    //       backgroundColor: 'transparent',
    //       opacity: 0.05,
    //     }}
    //   />
    //   <Text style={{ fontSize: 30, fontWeight: 'bold' }}>Lobby Page</Text>
    //   <Button
    //     style={styles.buttonStyle}
    //     onPress={() => {
    //       setRoles();
    //       navigation.navigate('Chat');
    //     }}
    //   >
    //     Start
    //   </Button>

    //   <Button
    //     style={styles.buttonStyle}
    //     onPress={() => {
    //       reset();
    //     }}
    //   >
    //     Reset
    //   </Button>
    // </View>
    <Box w="100%" h="100%" position="relative">
      <Image
        w="full"
        h="full"
        position="absolute"
        source={background}
        alt="Background"
      />
      <Text>{roomKey}</Text>
    </Box>
  );
};

// const styles = StyleSheet.create({
//   input: {
//     padding: 10,
//     margin: 4,
//     width: '75%',
//     fontSize: 15,
//     backgroundColor: '#74859a',
//     borderRadius: 10,
//     margin: 5,
//   },
//   buttonStyle: {
//     padding: 5,
//     width: 120,
//     height: 50,
//     backgroundColor: '#74859a',
//     borderRadius: 10,
//     borderWidth: 2,
//     borderColor: '#000000',
//     margin: 10,
//   },
// });

export default LobbyPage;
