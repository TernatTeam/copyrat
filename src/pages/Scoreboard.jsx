import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Button,
  Text,
  Flex,
  ScrollView,
  useToast,
} from 'native-base';
import {
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  increment,
} from 'firebase/firestore';
import {
  db,
  collection,
  auth,
  getDocs,
  query,
  onSnapshot,
} from '../../config/firebase/firebase-key-config';
import { useGlobal } from '../../state';
import { ModalShowRats } from '../components/common';

let route = 'Chat';

export const ScorePage = ({ navigation }) => {
  const toast = useToast();
  const id = 'scoreboard-toasts';
  /* variabile carora li se modifica valoarea pe parcursul jocului:
  -> playersDB = array ul cu playeri, luat din baza de date
*/
  const [playersDB, setPlayersDB] = useState([]);
  const [playerIDs, setPlayerIDs] = useState([]);

  /* variabile carora nu li se modifica valoarea pe parcursul jocului:
  -> roomData = variabila globala care retine informatii despre jocul curent
  -> adminId = id ul playerului care a creat camera
  -> currentPlayer = obiectul cu informatiile despre un player (divera pe fiecare device)
  -> roundNo = numarul rundei curente
*/
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [{ roomData }] = useGlobal();

  useEffect(() => {
    const q = query(collection(db, `games`, roomData.keyCode, 'admin'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'modified') {
          navigation.reset({
            routes: [{ name: route }],
          });
        }
      });
    });

    return async () => {
      unsubscribe();
    };
  }, []);

  const getSortedPlayers = async () => {
    // functie care ia din baza de date arrayul cu playeri si ii sorteaza dupa scor
    try {
      // iau playerii jocului curent
      const querySnapshot = await getDocs(
        collection(db, `games/${roomData.keyCode}/players`),
      );
      // ii pun in arrayul playersArray pentru a updata valoarea arrayului playersDB
      let playersArray = [];
      // la fel si pentru id ul acestora
      let idArray = [];

      querySnapshot.forEach((doc) => {
        // pentru fiecare player luat din baza de data
        playersArray.push(doc.data()); // il retin in array ul auxiliar
        idArray.push(doc.id); // retinem si id urile playerilor in array ul auxiliar
      });

      playersArray.sort((a, b) => {
        return a.score < b.score; // sortam array ul auxiliar in functie de scor
      });

      setPlayersDB(playersArray); // modific arrayul in care tin minte playerii
      setPlayerIDs(idArray); // modific arrayul in care tin minte id urile
    } catch (err) {
      console.log(`Error: ${err}`);
    }
  };

  const roundReset = async () => {
    // functia care reseteaza fieldurile no_of_votes, vote, fake_id
    let newFakeIds = []; // in acest array construim noile fake_id uri

    for (let i = 0; i < playersDB.length; i++) {
      newFakeIds.push(playersDB[i].name);
    }

    let no_of_rats = Math.floor(playersDB.length / 2); // iau numarul de rati
    let ratsIndex = []; // arrayul cu indecsii generati la intamplare

    while (ratsIndex.length < no_of_rats) {
      // generare indecsi
      let newRatIndex = Math.floor(Math.random() * playersDB.length);

      if (ratsIndex.indexOf(newRatIndex) == -1) {
        ratsIndex.push(newRatIndex);
      }
    }

    // actualizam fake_id urile in vectorul auxiliar pentru a le schimba pe toate odata in baza de date
    let firstRatId = newFakeIds[ratsIndex[0]];

    for (let i = 0; i < no_of_rats - 1; i++) {
      newFakeIds[ratsIndex[i]] = newFakeIds[ratsIndex[i + 1]]; // schimbam noile id uri in mod
    } // circular intre rati, 2 cate 2

    newFakeIds[ratsIndex[no_of_rats - 1]] = firstRatId;

    for (let i = 0; i < playersDB.length; i++) {
      // actualizez baza de date
      await updateDoc(
        doc(db, `games/${roomData.keyCode}/players/${playerIDs[i]}`),
        {
          fake_id: newFakeIds[i],
          no_of_votes: 0,
          vote: -1,
        },
      );
    }
  };

  const deleteChat = async () => {
    // stergem din baza de date chatul de runda trecuta
    let messageIDs = [];

    try {
      const querySnapshot = await getDocs(
        collection(db, `games/${roomData.keyCode}/chat`),
      );

      querySnapshot.forEach((doc) => {
        messageIDs.push(doc.id); // luam id ul fiecarui mesaj din colectia chat
      }); // corespunzatoare camerei de joc
    } catch (err) {
      console.log('Error: ', err);
    }

    for (let i = 0; i < messageIDs.length; i++) {
      deleteDoc(doc(db, `games/${roomData.keyCode}/chat/${messageIDs[i]}`)); // il stergem
    }
  };

  const countNextRound = async () => {
    await updateDoc(doc(db, `games/${roomData.keyCode}`), {
      round_number: increment(1),
    });
  };

  let roundNo = 1;

  useEffect(() => {
    getSortedPlayers();

    setIsModalOpen(true);

    const checkRound = async () => {
      const docSnap = await getDoc(doc(db, `games/${roomData.keyCode}`)); // prima incarcare a paginii
      roundNo = docSnap.data().round_number;
      if (roundNo > 2) route = 'Home';
    };

    checkRound();
  }, []);

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
              bg="rosybrown"
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
      <Box px="5" w="full" justifyContent="center" alignItems="flex-start">
        <ModalShowRats
          show={isModalOpen}
          players={playersDB}
          onClose={() => {
            setIsModalOpen(false);
          }}
        />

        <Box w="full" alignItems="center" justifyContent="center">
          <Heading size="2xl" fontWeight="500" color="black">
            Scoreboard:
          </Heading>
        </Box>

        <Box justifyContent="center" alignItems="center" w="full" h="70%">
          <ScrollView w="full">
            {playersDB.map((player, index) => {
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
                  <Text fontSize="sm" fontWeight="bold">
                    {index + 1}.
                  </Text>
                  <Text fontSize="md" fontWeight="bold" color="white">
                    {player.name}
                  </Text>
                  <Text fontWeight="bold">{player.score}</Text>
                </Flex>
              );
            })}
          </ScrollView>
        </Box>
      </Box>

      {auth.currentUser.uid === roomData.game_admin_uid && (
        <Box w="full" p="6" mt="auto">
          <Button
            title="Next round"
            rounded="lg"
            medium
            bg="primary3.500"
            _pressed={{ bg: 'primary3.600' }}
            onPress={() => {
              //getAdminIdAndRound();
              // butonul care va incepe o noua runda

              // acest lucru e posibil doar daca playerul care apasa are rolul de admin
              roundReset(); // setam noi fake_id uri si resetam no_of_votes, vote
              deleteChat(); // stergem chatul de tura trecuta
              countNextRound(); // actualizez numarul rundei

              if (roundNo < 3) {
                showToast('Preparing new roles...');
              } else {
                showToast('Well done! See you again soon');
              }

              setTimeout(async () => {
                await updateDoc(
                  doc(db, 'games', roomData.keyCode, 'admin', 'game_state'),
                  {
                    nav_to_score: false,
                  },
                );
              }, 1000);
            }}
          >
            <Text fontWeight="semibold" color="black">
              Next Round
            </Text>
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default ScorePage;
