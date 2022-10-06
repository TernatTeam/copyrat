import { View, Text, TouchableOpacity } from "react-native";
import { Box, Button, Center } from "native-base";
import React, { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  increment,
  serverTimestamp,
} from "firebase/firestore";
import {
  db,
  collection,
  auth,
  getDocs,
  addDoc,
  query,
  onSnapshot,
} from "../../config/firebase/firebase-key-config";
import { useGlobal } from "../../state";
import { Ionicons } from "@expo/vector-icons";
import { Icon } from "native-base";
import { async } from "@firebase/util";

export const VotePage = ({ navigation }) => {
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
  const [adminId, setAdminId] = useState("");
  const [{ roomData }] = useGlobal();

  useEffect(() => {
    updateDoc(doc(db, "games", roomData.keyCode, "admin", "gameState"), {
      navToScore: false,
    });
    console.log("LOBBY");
  }, []);

  useEffect(() => {
    const q = query(collection(db, `games`, roomData.keyCode, "admin"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "modified") {
          navigation.reset({
            routes: [{ name: "Scoreboard" }],
          });
        }
      });
    });

    return async () => {
      unsubscribe();
    };
  }, []);

  const getPlayers = async () => {
    try {
      // iau playerii jocului curent
      const querySnapshot = await getDocs(
        collection(db, `games/${roomData.keyCode}/players`)
      );
      // ii pun in arrayul playersArray pentru a updata valoarea arrayului playersDB
      let playersArray = [];
      // la fel si pentru id ul acestora
      let idArray = [];

      querySnapshot.forEach((doc) => {
        // pentru fiecare player luat din baza de data
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

  const getAdminIdAndRound = async () => {
    // functie care retine id ul adminului si runda, se apeleaza o data la
    const docSnap = await getDoc(doc(db, `games/${roomData.keyCode}`)); // prima incarcare a paginii
    setAdminId(docSnap.data().game_admin_uid);
    setRoundNo(docSnap.data().round_number);
  };

  const voteFor = (index) => {
    // retine ultima optiune de votare a playerului curent
    setIndexOfVoted(index); // in variabila indexOfVoted

    window.alert(`You are voting for ${playersDB[index].fake_id}`);
  };

  const confirmVote = async () => {
    // functia care trimite catre baza de date indicele persoanei cu care votezi
    // si ii creste acestuia numarul de voturi primite
    await updateDoc(
      doc(db, `games/${roomData.keyCode}/players/${playerIDs[indexOfVoted]}`),
      {
        no_of_votes: increment(1),
      }
    );

    await updateDoc(
      doc(db, `games/${roomData.keyCode}/players/${auth.currentUser.uid}`),
      {
        vote: indexOfVoted,
      }
    );

    getPlayers();
  };

  const calculateScore = async () => {
    // functia care calculeaza punctajele la final de runda
    let newScores = []; // array auxiliar in care stocam scorurile de runda asta
    const nrOfPlayers = playersDB.length;

    console.log(playersDB);

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

      //console.log(playersDB[i].name, score);
    }

    for (let i = 0; i < nrOfPlayers; i++) {
      // si apoi il actualizez in baza de date pentru fiecare jucator
      await updateDoc(
        doc(db, `games/${roomData.keyCode}/players/${playerIDs[i]}`),
        {
          score: increment(newScores[i]),
        }
      );
    }
  };

  const showRats = () => {
    // functia care afiseaza jucatorii care au avut rolul de "rat"
    let rats = "The rats this round were:";

    playersDB.map((player) => {
      // verificam prin array ul de playeri
      if (player.name != player.fake_id) {
        rats += "\n" + player.name; // retinem numele celor cu numele si fake_id ul diferit
      }
    });

    window.alert(rats);
  };

  useEffect(() => {
    getPlayers(); // cand se incarca prima data pagina, luam din baza de date

    getAdminIdAndRound(); // playerii si id urile lor, cat si pe al admin ului si numarul rundei
  }, []);

  return (
    <Center
      style={{
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        backgroundColor: "#747474",
      }}
    >
      <Text style={{ fontFamily: "RadioNewsman", fontSize: 25 }}>
        Vote out the rats!
      </Text>

      {
        // generare butoane de votare
        playersDB?.map((player, index) => {
          // parcurg array ul de playeri
          if (
            player.name != currentPlayer.name &&
            player.name != currentPlayer.fake_id
          ) {
            // verificare sa nu fie playerul curent
            return (
              // (sau ala drept care se da, in cazul ratilor)
              // <Button
              //   w="20%"
              //   h="5%"
              //   marginBottom="4px"
              //   padding="1px"
              //   key={index}
              //   onPress={() => {
              //     // la apasare, se apeleaza functia care
              //     voteFor(index); // retine ultima optiune de votare a playerului curent
              //   }}
              // >
              //   {player.fake_id}
              // </Button>
              <TouchableOpacity
                key={index}
                onPress={() => {
                  //     // la apasare, se apeleaza functia care
                  voteFor(index); // retine ultima optiune de votare a playerului curent
                }}
                style={{ width: "80%", margin: 10, marginTop: 15 }}
              >
                <Box
                  style={{
                    backgroundColor: player.userNameColor,
                    paddingVertical: 5,
                    borderRadius: 10,
                    justifyContent: "space-between",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: 22,
                      marginLeft: 10,
                      fontWeight: "bold",
                    }}
                  >
                    {player.fake_id}
                  </Text>

                  <Icon
                    as={<Ionicons name="checkbox" />}
                    size={6}
                    mr="2"
                    color={"white"}
                  />
                </Box>
              </TouchableOpacity>
            );
          }
        })
      }

      <Button // butonul cu dare confirmi votul final
        title="LockIn"
        marginTop={6}
        marginBottom={3}
        rounded="lg"
        medium
        bg="primary3.500"
        _pressed={{ bg: "primary3.600" }}
        onPress={() => {
          // la apasare, se apeleaza functia care trimite catre baza de date indicele persoanei cu care votezi
          if (indexOfVoted != null) {
            // doar daca playerul a votat cu cineva. Atunci, poti
            if (!alreadyVoted) {
              // confirma votul o singura data, adica daca nu ai mai apasat
              confirmVote(); // pe "Done" (variabila alreadyVoted are valoarea false)
              setAlreadyVoted(true);
              window.alert(`Locking in ... ${playersDB[indexOfVoted].fake_id}`);
            } else {
              window.alert("You already locked in your vote!");
            }
          } else {
            window.alert("Please vote for someone!"); // in caz contrar, anunt playerul
          } // ca nu a votat cu nimeni
        }}
      >
        <Text style={{ fontWeight: "semibold", color: "black", fontSize: 16 }}>
          Lock In Your Vote!
        </Text>
      </Button>

      <Button
        title="stopVote"
        rounded="lg"
        medium
        bg="rosybrown"
        _pressed={{ bg: "red.500" }}
        onPress={() => {
          // butonul care calculeaza si afiseaza scorurile, si da update in baza de date

          if (auth.currentUser.uid == adminId) {
            getPlayers();
            window.alert("Checking votes...");
            setTimeout(() => {
              let all_voted = true;
              for (let i = 0; i < playersDB.length; i++) {
                if (playersDB[i].vote < 0) all_voted = false;
              }
              if (!all_voted) {
                //daca nu si-a facut update
                window.alert("Votes not locked in! Please try again!");
              } else {
                // acest lucru e posibil doar daca playerul care apasa are rolul de admin
                calculateScore(); // calculam scorurile
                setTimeout(() => {
                  showRats(); // apoi afisam ratii de tura aceasta
                }, 1000);

                setTimeout(() => {
                  window.alert("Calculating scores...");
                }, 4000);

                setTimeout(async () => {
                  // navigation.navigate("Scoreboard"); // ne mutam pe pagina cu leaderboard ul
                  await updateDoc(
                    doc(db, "games", roomData.keyCode, "admin", "gameState"),
                    {
                      navToScore: true,
                    }
                  );
                }, 6000);
              }
            }, 3000);
          } else {
            window.alert("Wait! Only the game creator can stop the voting."); // altfel, este anuntat ca
          } // nu are acest drept
        }}
      >
        <Text style={{ fontWeight: "semibold", color: "black", fontSize: 16 }}>
          Stop Vote!
        </Text>
      </Button>
    </Center>
  );
};

export default VotePage;
