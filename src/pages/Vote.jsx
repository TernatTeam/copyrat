import { View, Text, ScrollViewBase } from 'react-native';
import React, { useEffect, useReducer, useState } from 'react';
import { Button } from 'native-base';
//import { playersDB } from "./Lobby";
import {
  doc,
  updateDoc,
  increment,
  deleteDoc,
  query,
  where,
  onSnapshot,
} from 'firebase/firestore';
import {
  collection,
  db,
  getDocs,
  auth,
} from '../../config/firebase/firebase-key-config';
import { useGlobal } from '../../state';

let currentPlayerId = '';
let currentPlayer = {};
let votedPlayerIndex = -1; // nimeni
let uIDs = [];

export const VotePage = ({ navigation }) => {
  const [playersDB, setPlayersDB] = useState([]);
  const [alreadyVoted, setAlreadyVoted] = useState(false);
  const [{ keycode }] = useGlobal(); 

  const getPlayers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, `games/${keycode.value}/players`));
      currentPlayerId = auth.currentUser.uid;
      let playersArray = [];

      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        // console.log(doc.id, ' => ', doc.data());
        playersArray.push(doc.data());
        uIDs.push(doc.id);

        if (doc.id == currentPlayerId) {
          currentPlayer = doc.data();
          //console.log(currentPlayer);
        }
      });

      setPlayersDB(playersArray);
    } catch (err) {
      console.log('Error: ', err);
    }
  };

  const deleteChat = async () => {
    let messageIDs = [];

    try {
      const querySnapshot = await getDocs(collection(db, `games/${keycode.value}/chat`));

      querySnapshot.forEach((doc) => {
        messageIDs.push(doc.id);
      });
    } catch (err) {
      console.log('Error: ', err);
    }

    for (let i = 0; i < messageIDs.length; i++) {
      deleteDoc(doc(db, `games/${keycode.value}/chat/${messageIDs[i]}`));
    }
  };

  const resetScoresFB = () => {
    const nrOfPlayers = playersDB.length;

    for (let i = 0; i < nrOfPlayers; i++) {
      updateDoc(doc(db, `games/${keycode.value}/players/${uIDs[i]}`), {
        score: 0,
      });
    }
  };

  const voteFor = (playerName) => {
    votedPlayerIndex = playersDB.findIndex(
      (player) => player.fake_id == playerName,
    );
    window.alert(`You are voting for ${playersDB[votedPlayerIndex].fake_id}`);
  };

  const confirmVote = () => {
    if (votedPlayerIndex >= 0) {
      updateDoc(doc(db, `games/${keycode.value}/players/${uIDs[votedPlayerIndex]}`), {
        no_of_votes: increment(1),
      });

      updateDoc(doc(db, `games/${keycode.value}/players/${currentPlayerId}`), {
        vote: playersDB[votedPlayerIndex].fake_id,
      });

      window.alert(`Locking in.. ${playersDB[votedPlayerIndex].fake_id}`);
    } else {
      window.alert('You need to vote someone!');
    }
  };

  const roundUp10 = (num) => {
    return Math.ceil(num / 10) * 10;
  };

  const showScore = async () => {
    let players = [];

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

    players?.map((player) => {
      results += '\n' + player.name + ': ' + player.score;
    });

    window.alert(results);
  };

  const showRats = () => {
    let rats = 'The rats this round were:';

    playersDB?.map((player) => {
      if (player.role == 'rat') {
        rats += '\n' + player.name;
      }
    });

    window.alert(rats);
  };

  const calculateScore = async () => {
    const nrOfPlayers = playersDB.length;
    let newScore;

    for (let i = 0; i < nrOfPlayers; i++) {
      newScore = 0;

      if (playersDB[i].role == 'cat') {
        // real
        let indexOfVoted = playersDB.findIndex(
          (player) => player.fake_id == playersDB[i].vote,
        );

        if (playersDB[indexOfVoted]?.role == 'rat') {
          newScore += nrOfPlayers - 1 - playersDB[indexOfVoted].no_of_votes;
        }

        if (newScore < 1) {
          newScore = 1;
        }

        newScore *= 10;

        if (newScore == 10 * (nrOfPlayers - 2)) {
          newScore += 5;
        }
      } else {
        // fake
        newScore += nrOfPlayers - 2 - playersDB[i].no_of_votes;
        newScore *= 10;

        if (newScore == 10 * (nrOfPlayers - 2)) {
          newScore += 5;
        }
      }

      newScore = roundUp10((newScore * 76) / nrOfPlayers);

      await updateDoc(doc(db, `games/${keycode.value}/players/${uIDs[i]}`), {
        score: increment(newScore),
      });
    }

    showRats();

    setTimeout(() => {
      showScore();
    }, 1500);
  };

  //Assign roles
  const setRoles = () => {
    let no_of_rats = Math.floor(playersDB.length / 2);
    //arr of 3 rand index
    let arr = [];
    while (arr.length < no_of_rats) {
      let r = Math.floor(Math.random() * (playersDB.length - 1)) + 1;
      if (arr.indexOf(r) === -1) arr.push(r);
    }
    //update roles and fake_id
    for (let i = 0; i < no_of_rats; i++) {
      updateDoc(doc(db, `games/${keycode.value}/players/${uIDs[arr[i]]}`), {
        role: 'rat',
        fake_id: playersDB[arr[(i + 1) % no_of_rats]].name,
      });
    }
  };

  //reset roles, fake_id, vote, no_of_votes
  const reset = () => {
    for (let i = 0; i < playersDB.length; i++) {
      updateDoc(doc(db, `games/${keycode.value}/players/${uIDs[i]}`), {
        role: 'cat',
        fake_id: playersDB[i].name,
        vote: 0,
        no_of_votes: 0,
      });
    }
  };

  /*const finishRound = () => {
    reset();
    setRoles();
    navigation.navigate("Chat");
  }

  const checkVotes = () => {
    const q = query(collection(db, 'games/abcd/players'));
    let cnt = 0;
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        if (doc.data().vote != " ") {
          cnt++;
        }
      });

      if (cnt == playersDB.length) {
        finishRound();
      }
    });

    return unsubscribe;
  }

  useEffect(() => {
    checkVotes();
  }, []);*/

  useEffect(() => {
    getPlayers();
  }, []);

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
      <Text paddingBottom="5px">Vote out the rats!</Text>

      {playersDB?.map((player, index) => {
        if (
          player.name != currentPlayer.name &&
          player.name != currentPlayer.fake_id
        )
          return (
            <Button
              w="20%"
              h="5%"
              marginBottom="4px"
              padding="1px"
              key={index}
              onPress={() => {
                voteFor(player.name);
              }}
            >
              {player.name}
            </Button>
          );
      })}

      <Button
        w="20%"
        h="5%"
        marginBottom="4px"
        padding="1px"
        bgColor="fuchsia.700"
        onPress={() => {
          if (alreadyVoted == false) {
            confirmVote();
            setAlreadyVoted(true);
          }
        }}
      >
        Done
      </Button>

      <Button
        w="20%"
        h="5%"
        marginBottom="4px"
        padding="1px"
        bgColor="emerald.600"
        onPress={() => {
          calculateScore();
        }}
      >
        Stop Vote!
      </Button>

      <Button
        w="20%"
        h="5%"
        marginBottom="4px"
        padding="1px"
        bgColor="black"
        onPress={() => {
          resetScoresFB();
        }}
      >
        Reset FB
      </Button>

      <Button
        w="20%"
        h="5%"
        marginBottom="4px"
        padding="1px"
        onPress={() => {
          reset();
          setRoles();
          deleteChat();

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
      >
        NextRound
      </Button>
    </View>
  );
};

export default VotePage;
