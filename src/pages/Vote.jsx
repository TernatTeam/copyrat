import {View, Text} from 'react-native';
import {Button} from 'native-base';
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

export const VotePage = ({navigation}) => {

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
*/

  const [currentPlayer, setCurrentPlayer] = useState({});
  const [adminId, setAdminId] = useState("");
  const [{keycode}] = useGlobal();

  const getPlayers = async () => {
    try {
      // iau playerii jocului curent
      const querySnapshot = await getDocs(collection(db, `games/${keycode.value}/players`));
      // ii pun in arrayul playersArray pentru a updata valoarea arrayului playersDB
      let playersArray = [];
      // la fel si pentru id ul acestora
      let idArray = [];

      querySnapshot.forEach((doc) => { // pentru fiecare player luat din baza de data
        playersArray.push(doc.data()); // il retin in array ul auxiliar       
        idArray.push(doc.id); // retinem si id urile playerilor in array ul auxiliar
     
        if (doc.id == auth.currentUser.uid) { // daca am gasit playeryl cu id ul curent, il retinem in
         setCurrentPlayer(doc.data());    // variabila currentPlayer pentru a avea acces usor la date
        }                                // cand cream butoanele de votare
      });

      setPlayersDB(playersArray); // modific arrayul in care tin minte playerii
      setPlayerIDs(idArray); // modific arrayul in care tin minte id urile
    } catch(err) {
      console.log(`Error: ${err}`);
    }
  }

  const getAdminId = async () => { // functie care retine id ul adminului, se apeleaza o data la
    const docSnap = await getDoc(doc(db, `games/${keycode.value}`)); // prima incarcare a paginii
    setAdminId(docSnap.data().game_admin_uid);
  }

  const voteFor = (index) => { // retine ultima optiune de votare a playerului curent
    setIndexOfVoted(index);    // in variabila indexOfVoted

    window.alert(`You are voting for ${playersDB[index].fake_id}`);
  }

  const confirmVote = async () => { 
  // functia care trimite catre baza de date indicele persoanei cu care votezi
  // si ii creste acestuia numarul de voturi primite
    await updateDoc(doc(db, `games/${keycode.value}/players/${playerIDs[indexOfVoted]}`), {
      no_of_votes: increment(1)
    });

    await updateDoc(doc(db, `games/${keycode.value}/players/${auth.currentUser.uid}`), {
      vote: indexOfVoted
    });
  }

  const calculateScore = async () => { // functia care calculeaza punctajele la final de runda
    let newScores = []; // array auxiliar in care stocam scorurile de runda asta
    const nrOfPlayers = playersDB.length;

    console.log(playersDB);
    
    for (let i = 0; i < nrOfPlayers; i++) { // calculam pentru fiecare player
      let score = 0;
      
      if (playersDB[i].name == playersDB[i].fake_id) { // Real
        if (playersDB[playersDB[i].vote].name != playersDB[playersDB[i].vote].fake_id) { //vot bun
          score += nrOfPlayers - 1 - playersDB[playersDB[i].vote].no_of_votes;
        }
        if (score < 1) {
          score = 1;
        }
        score *= 10;
        if (score == 10 * (nrOfPlayers - 2)) {
          score += 5;
        }
        
      } else {// fake
        score += nrOfPlayers - 2 - playersDB[i].no_of_votes;
        score *= 10;
        if (score == (nrOfPlayers - 2)) {
          score += 5;
        }
      }

      score = (score * 76) / nrOfPlayers;
      score = Math.ceil(score / 10) * 10;

      newScores.push(score);  // incarc in vectorul auxiliar fiecare scor nou
    
      console.log(playersDB[i].name, score);
    }
    
    for (let i = 0; i < nrOfPlayers; i++) { // si apoi il actualizez in baza de date pentru fiecare jucator
      await updateDoc(doc(db, `games/${keycode.value}/players/${playerIDs[i]}`), {
        score: increment(newScores[i])
      });
    }
  }

  const showRats = () => { // functia care afiseaza jucatorii care au avut rolul de "rat"
    let rats = 'The rats this round were:';

    playersDB.map((player) => { // verificam prin array ul de playeri
      if (player.name != player.fake_id) {
        rats += '\n' + player.name; // retinem numele celor cu numele si fake_id ul diferit
      }
    });

    window.alert(rats);
  }

  const showScore = async () => { // functia care afiseaza scorurile in ordine descrescatoare
    let players = []; // vom da un update array ului de playeri pentru a lua scorurile

    try {
      const querySnapshot = await getDocs(collection(db, `games/${keycode.value}/players`));

      querySnapshot.forEach((doc) => {
        players.push(doc.data());
      });
    } catch (err) {
      console.log('Error: ', err);
    }

    players.sort((a, b) => {
      return a.score < b.score;
    });

    let results = 'Scoreboard:';

    players.map((player) => {
      results += '\n' + player.name + ': ' + player.score;
    });

    window.alert(results);
  };

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
      await updateDoc(doc(db, `games/${keycode.value}/players/${playerIDs[i]}`), {
        fake_id: newFakeIds[i],
        no_of_votes: 0,
        vote: null
      })
    }
  }

  const deleteChat = async () => { // stergem din baza de date chatul de runda trecuta
    let messageIDs = [];

    try {
      const querySnapshot = await getDocs(collection(db, `games/${keycode.value}/chat`));

      querySnapshot.forEach((doc) => {
        messageIDs.push(doc.id); // luam id ul fiecarui mesaj din colectia chat
      });                        // corespunzatoare camerei de joc
    } catch (err) {
      console.log('Error: ', err);
    }

    for (let i = 0; i < messageIDs.length; i++) {
      deleteDoc(doc(db, `games/${keycode.value}/chat/${messageIDs[i]}`)); // il stergem
    }
  }

  useEffect(() => {
    getPlayers(); // cand se incarca prima data pagina, luam din baza de date
    getAdminId(); // playerii si id urile lor, cat si pe al admin ului
  }, []);         

  return (
    <View style = {{alignItems: 'center', justifyContent: 'center', flex: 1}}>
      <Text paddingBottom="5px">Vote out the rats!</Text>
      
      { // generare butoane de votare
        playersDB?.map((player, index) => { // parcurg array ul de playeri
          if (player.name != currentPlayer.name &&
              player.name != currentPlayer.fake_id) { // verificare sa nu fie playerul curent
            return (                                  // (sau ala drept care se da, in cazul ratilor)
              <Button
                w="20%"
                h="5%"
                marginBottom="4px"
                padding="1px"
                key={index}
                onPress={() => {  // la apasare, se apeleaza functia care
                  voteFor(index); // retine ultima optiune de votare a playerului curent
                }}
              >
                {player.fake_id}
              </Button>
            );
          }
        })
      }

      <Button // butonul cu dare confirmi votul final
        w="20%"
        h="5%"
        marginBottom="4px"
        padding="1px"
        bgColor="fuchsia.700"
        onPress={() => {
        // la apasare, se apeleaza functia care trimite catre baza de date indicele persoanei cu care votezi
          if (indexOfVoted != null) { // doar daca playerul a votat cu cineva. Atunci, poti
            if (!alreadyVoted) {      // confirma votul o singura data, adica daca nu ai mai apasat
              confirmVote();          // pe "Done" (variabila alreadyVoted are valoarea false)
              setAlreadyVoted(true); 

              window.alert(`Locking in ... ${playersDB[indexOfVoted].fake_id}`);
            } else {
              window.alert('You already locked in your vote!');
            }
          } else {
            window.alert('Please vote for someone!'); // in caz contrar, anunt playerul
          }                                         // ca nu a votat cu nimeni
        }}
      >Done</Button>

      <Button
        w="20%"
        h="5%"
        marginBottom="4px"
        padding="1px"
        bgColor="emerald.600"
        onPress={() => { // butonul care calculeaza si afiseaza scorurile, si da update in baza de date
          if (auth.currentUser.uid == adminId) { // acest lucru e posibil doar daca playerul care apasa are rolul de admin
            getPlayers(); // actualizam arrayul de playeri

            calculateScore(); // calculam scorurile                    
          
            showRats(); // apoi afisam ratii de tura aceasta

            setTimeout(() => {
              showScore(); // si scorurile cumulate
            }, 1500);
          } else {
            window.alert('Wait! Only the game creator can stop the voting.'); // altfel, este anuntat ca
          }                                                                   // nu are acest drept
        }}
      >Stop Vote!</Button>

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

    </View>
  );
};

export default VotePage;