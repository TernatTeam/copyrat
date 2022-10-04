import {View, Text, Button} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  doc,
  getDoc,
  updateDoc,
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
  -> currentPlayerId = id ul pe care playerul curent il are in baza de date (difera pe fiecare device)
  -> currentPlayer = odata initializat, retine informatiile despre playerul curent
  -> adminId = id ul playerului care a creat camera
*/

  const [{keycode}] = useGlobal();
  const currentPlayerId = auth.currentUser.uid;
  let currentPlayer = {};
  let adminId = "";
  
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
     
        if (doc.id == currentPlayerId) { // daca am gasit playeryl cu id ul curent, il retinem in
          currentPlayer = doc.data();    // variabila currentPlayer pentru a avea acces usor la date
        }                                // cand cream butoanele de votare
      });

      setPlayersDB(playersArray); // modific arrayul in care tin minte playerii
      setPlayerIDs(playerIDs); // modific arrayul in care tin minte id urile
    } catch(err) {
      console.log(`Error: ${err}`);
    }
  }

  const getAdminId = async () => { // functie care retine id ul adminului, se apeleaza o data la
    const docSnap = await getDoc(doc(db, `games/${keycode.value}`)); // prima incarcare a paginii
    adminId = docSnap.data().game_admin_uid;
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

    await updateDoc(doc(db, `games/${keycode.value}/players/${currentPlayerId}`), {
      vote: indexOfVoted
    });
  }

  const calculateScore = () => {
    ;
  }

  const reset = async () => { // resetam in baza de date fake_id, no_of_votes, vote
    for (let i = 0; i < playerIDs.length; i++) { // pentru fiecare player
      await updateDoc(doc(db, `games/${keycode.value}/players/${playerIDs[i]}`), {
        fake_id: playersDB[i].name,
        no_of_votes: 0,
        vote: null
      });
    }
  }

  const setRoles = async () => { // setam noi fake_id uri
    let no_of_rats = Math.floor(playersDB.length / 2); // iau numarul de rati
    let ratsIndex = []; // arrayul cu indecsii generati la intamplare

    while (ratsIndex.length < no_of_rats) { // generare indecsi
      let newRatIndex = Math.floor(Math.random() * (playersDB.length - 1)) + 1;
      
      if (ratsIndex.indexOf(newRatIndex) == -1) {
        ratsIndex.push(newRatIndex);
      }
    }

    for (let i = 0; i < no_of_rats; i++) { // actualizam fake_id urile in baza de date
      await updateDoc(doc(db, `games/${keycode.value}/players/${playerIDs[ratsIndex[i]]}`), {
        fake_id: playersDB[ratsIndex[(i + 1) % no_of_rats]].name // alegem noile id uri in mod
      });                                                        // circular intre rati
    }
  }

  const deleteChat = () => { // stergem din baza de date chatul de runda trecuta
    ;
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
                {player.name}
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
          if (currentPlayerId == adminId) { // acest lucru e posibil doar daca playerul care
            calculateScore();               // apasa are rolul de admin
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
          if (currentPlayerId == adminId) { // acest lucru e posibil doar daca playerul care apasa are rolul de admin
            reset();  // resetam fake_id, no_of_votes, vote    
            setRoles(); // setam noi fake_id uri
            deleteChat(); // stergem chatul de tura trecuta
          }

          setAlreadyVoted(false); // ii redau playerului dreptul de a vota

          setTimeout(() => {
            window.alert("Storing this round's scores...");
          }, 1000);

          setTimeout(() => {
            window.alert('Preparing new roles...');
          }, 3000);

          setTimeout(() => {
            navigation.navigate('Chat');
          }, 5000);
        }}
      >Next Round</Button>

    </View>
  );
};

export default VotePage;
