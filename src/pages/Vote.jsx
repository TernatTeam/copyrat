import { View, Text } from "react-native";
import React, { useEffect, useReducer, useState } from "react";
import { Button } from "native-base";
//import { playersDB } from "./Lobby";
import { doc, updateDoc, increment } from 'firebase/firestore';
import { collection, db, getDocs } from '../../config/firebase/firebase-key-config';

const currentPlayerIndex = 3; // David
let votedPlayerIndex = -1; // nimeni
let uIDs = [];

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
        uIDs.push(doc.id);
      });

      setPlayersDB(playersArray);
    } catch (err) {
      console.log('Error: ', err);
    }
  };

  const updateScore = () => {
    const nrOfPlayers = playersDB.length;
    
    for (let i = 0; i < nrOfPlayers; i++) {
      updateDoc(doc(db, 'games/abcd/players/' + uIDs[i]), {
        score: increment(playersDB[i].score)
      });
    }
  };

  const resetScoresFB = () => {
    const nrOfPlayers = playersDB.length;
    
    for (let i = 0; i < nrOfPlayers; i++) {
      updateDoc(doc(db, 'games/abcd/players/' + uIDs[i]), {
        score: 0
      });
    }
  };

  const voteFor = (playerName) => {
    votedPlayerIndex = playersDB.findIndex(player => player.fake_id == playerName);
    window.alert("You are voting " + playersDB[votedPlayerIndex].fake_id);
  };

  const confirmVote = () => {
    if (votedPlayerIndex >= 0) {
      playersDB[votedPlayerIndex].no_of_votes++;
      window.alert("Locking in.. " + playersDB[votedPlayerIndex].fake_id);
    } else {
      window.alert("You need to vote someone!");
    }
  }

  const resetVotes = () => {
    const nrOfPlayers = playersDB.length;
  
    for (let i = 0; i < nrOfPlayers; i++) {
      playersDB[i].no_of_votes = 0;
      playersDB[i].score = 0;
    }
  }

  const roundUp10 = (num) => {
    return Math.ceil(num / 10) * 10;
  }

  const showScore = () => {
    let results = "Scoreboard:";

    playersDB?.map((player) => {
      results += "\n" + player.name + ": " + player.score;
    });

    window.alert(results);

    showRats();
  }

  const showRats = () => {
    let rats = "The rats this round were:";

    playersDB?.map((player) => {
      if (player.role == 'rat') {
        rats += "\n" + player.name;
      }
    });

    window.alert(rats);
  }

  const calculateScore = () => {
    const nrOfPlayers = playersDB.length;
  
    for (let i = 0; i < nrOfPlayers; i++) {
      if (playersDB[i].role === 'cat') { // real
        let indexOfVoted = playersDB.findIndex(player => player.fake_id == playersDB[i].vote);

        if (playersDB[indexOfVoted].role === 'rat') {
          playersDB[i].score += nrOfPlayers - 1 - playersDB[indexOfVoted].no_of_votes;
        }
        
        if (playersDB[i].score < 1) {
            playersDB[i].score = 1;
        }
        
        playersDB[i].score *= 10;
        
        if (playersDB[i].score == 10 * (nrOfPlayers - 2)) {
          playersDB[i].score += 5;
        }
      } else { // fake
        playersDB[i].score += nrOfPlayers - 2 - playersDB[i].no_of_votes;
        playersDB[i].score *= 10;
        
        if (playersDB[i].score == 10 * (nrOfPlayers - 2)){
          playersDB[i].score += 5;
        }
      }
  
      playersDB[i].score = roundUp10(playersDB[i].score * 76 / nrOfPlayers);
    }
  
    playersDB.sort((a, b) => {
      return (a.score < b.score);
    });

    showScore();

    updateScore();

    resetVotes();
  }

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
      updateDoc(doc(db, 'games/abcd/players/' + uIDs[arr[i]]), {
          role: "rat" ,
          fake_id: playersDB[arr[(i + 1) % no_of_rats]].name
      });
    }
  }

  //reset roles and fake_id
  const reset = () => {
    for(let i = 0; i < playersDB.length; i++) {
      updateDoc(doc(db, 'games/abcd/players/' + uIDs[i]), {
        role: "cat" ,
        fake_id: playersDB[i].name
    });
    }
  }

  useEffect(() => {
    getPlayers()
  }, []);

  //useEffect(() => {console.log(playersDB)}, [playersDB]);
  
  return (
    <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
      <Text paddingBottom="5px">Vote out the rats!</Text>

      {
        playersDB?.map((player, index) => {
          
          if (index != currentPlayerIndex && player.name != playersDB[currentPlayerIndex].fake_id )
            return (
              <Button
                w="20%" h="5%"
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
        })
      }

      <Button
        w="20%" h="5%"
        marginBottom="4px"
        padding="1px"
        bgColor="fuchsia.700"
        onPress={() => {
          confirmVote();
        }}
      >
        Done
      </Button>

      <Button
        w="20%" h="5%"
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
        w="20%" h="5%"
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
        w="20%" h="5%"
        marginBottom="4px"
        padding="1px"
        onPress={() => {
          resetVotes();
          reset();
          setRoles();
          navigation.navigate("Chat");
        }}
      >
        NextRound
      </Button>
    </View>
  );
};

export default VotePage;
