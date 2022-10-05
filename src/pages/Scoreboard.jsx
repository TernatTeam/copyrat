import {Text} from 'react-native';
import {Box, Heading} from 'native-base';
import React, {useEffect, useState} from 'react';
import {
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  increment
} from 'firebase/firestore';
import {
  db,
  collection,
  auth,
  getDocs
} from '../../config/firebase/firebase-key-config';
import {useGlobal} from '../../state';

export const ScorePage = ({navigation}) => {

/* variabile carora li se modifica valoarea pe parcursul jocului:
  -> playersDB = array ul cu playeri, luat din baza de date
  -> roomData = variabila globala care retine informatii despre jocul curent
*/

  const [playersDB, setPlayersDB] = useState([]);
  const [{ roomData }] = useGlobal();

  const getSortedPlayers = async () => { // functie care ia din baza de date arrayul cu playeri si ii sorteaza dupa scor
    try {
      // iau playerii jocului curent
      const querySnapshot = await getDocs(collection(db, `games/${roomData.keyCode}/players`));
      // ii pun in arrayul playersArray pentru a updata valoarea arrayului playersDB
      let playersArray = [];

      querySnapshot.forEach((doc) => { // pentru fiecare player luat din baza de data
        playersArray.push(doc.data()); // il retin in array ul auxiliar       
      });

      playersArray.sort((a, b) => {
        return a.score < b.score; // sortam array ul auxiliar in functie de scor
      });

      setPlayersDB(playersArray); // modific arrayul in care tin minte playerii
    } catch(err) {
      console.log(`Error: ${err}`);
    }
  }

  const roundReset = async () => { // functia care reseteaza fieldurile no_of_votes, vote, fake_id
    let newFakeIds = []; // in acest array construim noile fake_id uri

    for (let i = 0; i < playersDB.length; i++) {
      newFakeIds.push(playersDB[i].name);
    }

    let no_of_rats = Math.floor(playersDB.length / 2); // iau numarul de rati
    let ratsIndex = []; // arrayul cu indecsii generati la intamplare

    while (ratsIndex.length < no_of_rats) { // generare indecsi
      let newRatIndex = Math.floor(Math.random() * (playersDB.length - 1)) + 1;
      
      if (ratsIndex.indexOf(newRatIndex) == -1) {
        ratsIndex.push(newRatIndex);
      }
    }

    // actualizam fake_id urile in vectorul auxiliar pentru a le schimba pe toate odata in baza de date
    let firstRatId = newFakeIds[ratsIndex[0]];

    for (let i = 0; i < no_of_rats - 1; i++) {
      newFakeIds[ratsIndex[i]] = newFakeIds[ratsIndex[i + 1]]; // schimbam noile id uri in mod
    }                                                          // circular intre rati, 2 cate 2                                                 
    
    newFakeIds[ratsIndex[no_of_rats - 1]] = firstRatId;

    for (let i = 0; i < playersDB.length; i++) { // actualizez baza de date
      await updateDoc(doc(db, `games/${roomData.keyCode}/players/${playerIDs[i]}`), {
        fake_id: newFakeIds[i],
        no_of_votes: 0,
        vote: -1
      })
    }
  }

  const deleteChat = async () => { // stergem din baza de date chatul de runda trecuta
    let messageIDs = [];

    try {
      const querySnapshot = await getDocs(collection(db, `games/${roomData.keyCode}/chat`));

      querySnapshot.forEach((doc) => {
        messageIDs.push(doc.id); // luam id ul fiecarui mesaj din colectia chat
      });                        // corespunzatoare camerei de joc
    } catch (err) {
      console.log('Error: ', err);
    }

    for (let i = 0; i < messageIDs.length; i++) {
      deleteDoc(doc(db, `games/${roomData.keyCode}/chat/${messageIDs[i]}`)); // il stergem
    }
  }

  useEffect(() => {
    getSortedPlayers();
  });

  return (
    <Box safeArea bg="primary1.500" h="100%" w="100%">
      <Box px="5" w="full" justifyContent="center" alignItems="flex-start">
        <Box w="full" alignItems="center" justifyContent="center">
          <Heading size="2xl" fontWeight="500" color="black">
            Scoreboard:
          </Heading>
        </Box>
        
        {
          playersDB.map((player, index) => {
            return (
              <Text>{index + 1}. {player.name} .. {player.score}</Text>
            );
          })
        }
      </Box>

      <Button
        w="20%"
        h="5%"
        marginBottom="4px"
        padding="1px"
        onPress={() => { // butonul care va incepe o noua runda
          if (auth.currentUser.uid == adminId) { // acest lucru e posibil doar daca playerul care apasa are rolul de admin
            roundReset(); // setam noi fake_id uri si resetam no_of_votes, vote    
            deleteChat(); // stergem chatul de tura trecuta
          }

          setTimeout(() => {
            window.alert("Storing this round's scores...");
          }, 1000);

          setTimeout(() => {
            window.alert('Preparing new roles...');
          }, 3000);

          setTimeout(() => {
            navigation.navigate('Chat'); // ne intoarcem la chat
          }, 5000);
        }}
      >Next Round</Button>
    </Box>
  );
};

export default ScorePage;