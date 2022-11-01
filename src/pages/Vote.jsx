import React, { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import {
  Box,
  Button,
  Center,
  useToast,
  Text,
  ScrollView,
  VStack,
} from 'native-base';

import {
  db,
  doc,
  getDoc,
  updateDoc,
  increment,
  collection,
  auth,
  getDocs,
  onSnapshot,
} from '../../config/firebase/firebase-key-config';
import { useGlobal } from '../../state';
import { Ionicons } from '@expo/vector-icons';
import { Icon } from 'native-base';

export const VotePage = ({ navigation }) => {
  const toast = useToast();
  const id = 'voting-toasts';
  /* variabile carora li se modifica valoarea pe parcursul jocului:
  -> playersDB = array ul cu playeri, luat din baza de date
  -> uIDs = arrayul cu id-urile playerilor, in cazul in care un player iese din joc
  -> indexOfVoted = indexul playerului cu care doresti sa votezi, pana confirmi votul
  -> alreadyVoted = variabila de stare, care indica daca playerul si a confirmat sau nu votul
*/
  const [playersDB, setPlayersDB] = useState([]);
  const [playerIDs, setPlayerIDs] = useState([]);
  const [indexOfVoted, setIndexOfVoted] = useState(null);
  const [alreadyVoted, setAlreadyVoted] = useState(false);
  /* variabile carora nu li se modifica valoarea pe parcursul jocului:
  -> keycode = retine cheia camerei de joc in "keycode.value"
  -> currentPlayer = odata initializat, retine informatiile despre playerul curent
  -> adminId = id ul playerului care a creat camera
  -> roundNo = numarul rundei curente
*/
  const [roundNo, setRoundNo] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState({});
  const [{ roomData }] = useGlobal();

  const getPlayers = async () => {
    try {
      const querySnapshot = await getDocs(
        collection(db, `games/${roomData.keyCode}/players`),
      );
      // ii pun in arrayul playersArray pentru a updata valoarea arrayului playersDB
      let playersArray = [];
      // la fel si pentru id ul acestora
      let idArray = [];
      querySnapshot.forEach((doc) => {
        playersArray.push(doc.data()); // il retin in array ul auxiliar
        idArray.push(doc.id); // retinem si id urile playerilor in array ul auxiliar

        if (doc.id == auth.currentUser.uid) {
          // daca am gasit playeryl cu id ul curent, il retinem in
          setCurrentPlayer(doc.data()); // variabila currentPlayer pentru a avea acces usor la date
        } // cand cream butoanele de votare
      });

      setPlayersDB(playersArray); // modific arrayul in care tin minte playerii
      setPlayerIDs(idArray); // modific arrayul in care tin minte id urile
    } catch (err) {
      console.log(`Error: ${err}`);
    }
  };

  // used to get round only
  const getAdminIdAndRound = async () => {
    const docSnap = await getDoc(doc(db, `games/${roomData.keyCode}`)); // prima incarcare a paginii
    setRoundNo(docSnap.data().round_number);
  };

  const confirmVote = async () => {
    // functia care trimite catre baza de date indicele persoanei cu care votezi
    // si ii creste acestuia numarul de voturi primite
    await updateDoc(
      doc(db, `games/${roomData.keyCode}/players/${playerIDs[indexOfVoted]}`),
      {
        no_of_votes: increment(1),
      },
    );

    await updateDoc(
      doc(db, `games/${roomData.keyCode}/players/${auth.currentUser.uid}`),
      {
        vote: indexOfVoted,
      },
    );
  };

  const calculateScore = async () => {
    // functia care calculeaza punctajele la final de runda
    let newScores = []; // array auxiliar in care stocam scorurile de runda asta
    const nrOfPlayers = playersDB.length;

    for (let i = 0; i < nrOfPlayers; i++) {
      // calculam pentru fiecare player
      let score = 0;

      if (playersDB[i].name == playersDB[i].fake_id) {
        // Real
        if (
          playersDB[playersDB[i].vote].name !=
          playersDB[playersDB[i].vote].fake_id
        ) {
          //vot bun
          score += nrOfPlayers - 1 - playersDB[playersDB[i].vote].no_of_votes;
        }
        if (score < 1) {
          score = 1;
        }
        score *= 10;
        if (score == 10 * (nrOfPlayers - 2)) {
          score += 5;
        }
      } else {
        // fake
        score += nrOfPlayers - 2 - playersDB[i].no_of_votes;
        score *= 10;
        if (score == nrOfPlayers - 2) {
          score += 5;
        }
      }

      score = (score * 76) / nrOfPlayers;
      score = Math.ceil(score / 10) * 10;

      if (roundNo == 3) {
        score *= 1.5;
      }

      newScores.push(score); // incarc in vectorul auxiliar fiecare scor nou
    }

    for (let i = 0; i < nrOfPlayers; i++) {
      // si apoi il actualizez in baza de date pentru fiecare jucator
      await updateDoc(
        doc(db, `games/${roomData.keyCode}/players/${playerIDs[i]}`),
        {
          score: increment(newScores[i]),
        },
      );
    }
  };

  useEffect(() => {
    getPlayers(); // cand se incarca prima data pagina, luam din baza de date
    getAdminIdAndRound(); // playerii si id urile lor, cat si pe al admin ului si numarul rundei

    updateDoc(doc(db, 'games', roomData.keyCode, 'admin', 'game_state'), {
      nav_to_score: false,
    });

    const q = doc(db, 'games', `${roomData.keyCode}/admin/game_state`);
    const unsubscribe = onSnapshot(q, (doc) => {
      if (doc.data().nav_to_score === true) {
        navigation.reset({
          routes: [{ name: 'Scoreboard' }],
        });
      }
    });

    return () => {
      unsubscribe();
    };
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
      <Box pt="6" w="full" alignItems="center" justifyContent="center">
        <Text fontSize="2xl" fontFamily="RadioNewsman">
          Vote out the rats!
        </Text>
      </Box>

      <Box px="4" mt="2" mb="12" h="60%">
        <ScrollView w="full">
          <VStack flex="1" justifyContent="center" alignItems="center" px="2">
            {
              // generare butoane de votare
              playersDB?.map((player, index) => {
                // checking valid vote button
                return (
                  player.name != currentPlayer.name &&
                  player.name != currentPlayer.fake_id && (
                    <TouchableOpacity
                      key={index}
                      onPress={() => {
                        if (!alreadyVoted) {
                          setIndexOfVoted(index); // save vote
                        } else {
                          showToast('You already locked in your vote');
                        }
                      }}
                      style={{
                        width: '100%',
                        margin: 10,
                        marginTop: 15,
                        alignItems: 'center',
                      }}
                    >
                      <Center
                        flexDirection="row"
                        justifyContent="space-between"
                        alignItems="center"
                        w="full"
                        p="2"
                        bgColor={player.userNameColor}
                        borderRadius="lg"
                      >
                        <Text color="black" fontWeight="bold" fontSize="lg">
                          {player.fake_id}
                        </Text>

                        <Icon
                          as={
                            indexOfVoted === index ? (
                              <Ionicons name="checkbox" />
                            ) : (
                              <Ionicons name="square-outline" />
                            )
                          }
                          size={6}
                          color={'white'}
                        />
                      </Center>
                    </TouchableOpacity>
                  )
                );
              })
            }
          </VStack>
        </ScrollView>
      </Box>

      <Box p="6" mt="auto">
        <Button
          title="LockIn"
          rounded="lg"
          mb="3"
          medium
          disabled={alreadyVoted}
          bg={alreadyVoted ? 'primary3.600' : 'primary3.500'}
          _pressed={{ bg: 'primary3.600' }}
          onPress={() => {
            // la apasare, se apeleaza functia care trimite catre baza de date indicele persoanei cu care votezi
            if (indexOfVoted != null) {
              // doar daca playerul a votat cu cineva. Atunci, poti
              // confirma votul o singura data, adica daca nu ai mai apasat
              confirmVote(); // pe "Done" (variabila alreadyVoted are valoarea false)
              setAlreadyVoted(true);
              showToast(`Locking in ... ${playersDB[indexOfVoted].fake_id}`);
            } else {
              showToast('Please vote for someone');
              // in caz contrar, anunt playerul
            } // ca nu a votat cu nimeni
          }}
        >
          <Text fontWeight="semibold" color={alreadyVoted ? 'grey' : 'black'}>
            Lock In Your Vote
          </Text>
        </Button>

        {auth.currentUser.uid === roomData.game_admin_uid && (
          <Button
            title="stopVote"
            rounded="lg"
            medium
            bg="red.700"
            _pressed={{ bg: 'red.800' }}
            onPress={async () => {
              let all_voted = true;
              // butonul care calculeaza si afiseaza scorurile, si da update in baza de date
              await getPlayers();

              for (let i = 0; i < playersDB.length; i++) {
                if (playersDB[i].vote < 0) {
                  all_voted = false;
                }
              }

              if (!all_voted) {
                //daca nu si-a facut update
                showToast('Votes not locked in! Please try again');
              } else {
                // if votes locked in
                calculateScore(); // scores
                showToast('Calculating scores... Muie :D');
                // ne mutam pe pagina cu leaderboard ul
                setTimeout(async () => {
                  // wait for votes b4 leaving page
                  await updateDoc(
                    doc(db, 'games', roomData.keyCode, 'admin', 'game_state'),
                    {
                      nav_to_score: true,
                    },
                  );
                }, 1000);
              }
            }}
          >
            <Text fontWeight="semibold" color="white">
              Stop Vote
            </Text>
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default VotePage;
