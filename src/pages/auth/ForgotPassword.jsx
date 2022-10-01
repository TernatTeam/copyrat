import React, { useEffect, useState } from 'react';
import { Center, Text, Button } from 'native-base';
import { db, collection, getDocs } from '../../../config/firebase/firebase-key-config';

let players = [
  {
    name: 'Dragos',
    role: 'rat',
    fakeid: 'Matei',
    nrOfVotes: 0,
    vote: 'Mario',
    score: 0
  },
  {
    name: 'Cosmin',
    role: 'cat',
    fakeid: 'Cosmin',
    vote: 'Mario',
    nrOfVotes: 0, 
    score: 0
  }, 
  {
    name: 'Mario',
    role: 'rat',
    fakeid: 'Dragos',
    vote: 'Cosmin',
    nrOfVotes: 0, 
    score: 0
  },
  {
    name: 'David',
    role: 'cat',
    fakeid: 'David',
    vote: 'Mario',
    nrOfVotes: 0, 
    score: 0
  },
  {
    name: 'Costin',
    role: 'cat',
    fakeid: 'Costin',
    vote: 'Mario',
    nrOfVotes: 0, 
    score: 0
  },
  {
    name: 'Matei',
    role: 'rat',
    fakeid: 'Mario',
    nrOfVotes: 0,
    vote: 'Dragos',
    score: 0
  }
];

let currentPlayerIndex = 3; // David

export const ForgotPasswordPage = () => {
  /*const [playersDB, setPlayersDB] = useState([]);

  const getPlayers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'games/abcd/players'));
      let playersArray = [];
  
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        // console.log(doc.id, ' => ', doc.data());
        playersArray.push(doc.data());
      });
  
      setPlayersDB(playersArray);
    } catch (err) {
      console.log('Error: ', err);
    }
  };*/

  const voteFor = (playerName) => {
    let indexOfVoted = players.findIndex(player => player.fakeid == playerName);
    players[indexOfVoted].nrOfVotes++;
    window.alert(players[indexOfVoted].nrOfVotes);
  };
  
  const resetVotes = () => {
    const nrOfPlayers = players.length;
  
    for (let i = 0; i < nrOfPlayers; i++) {
      players[i].nrOfVotes = players[i].score = 0;
    }
  }
  
  const roundUp10 = (num) => {
    return Math.ceil(num / 10) * 10;
  }

  const showScore = () => {
    let results = "Scoreboard:";

    players?.map((player) => {
      results += "\n" + player.name + ": " + player.score;
    });

    window.alert(results);

    showRats();

    resetVotes();
  }

  const showRats = () => {
    let rats = "The rats this round were:";

    players?.map((player) => {
      if (player.role == 'rat') {
        rats += "\n" + player.name;
      }
    });

    window.alert(rats);
  }

  const calculateScore = () => {
    const nrOfPlayers = players.length;
  
    for (let i = 0; i < nrOfPlayers; i++) {
      if (players[i].role === 'cat') { // real
        let indexOfVoted = players.findIndex(player => player.fakeid == players[i].vote);

        if (players[indexOfVoted].role === 'rat') {
          players[i].score += nrOfPlayers - 1 - players[indexOfVoted].nrOfVotes;
        }
        
        if (players[i].score < 1) {
            players[i].score = 1;
        }
        
        players[i].score *= 10;
        
        if (players[i].score == 10 * (nrOfPlayers - 2)) {
          players[i].score += 5;
        }
      } else { // fake
        players[i].score += nrOfPlayers - 2 - players[i].nrOfVotes;
        players[i].score *= 10;
        
        if (players[i].score == 10 * (nrOfPlayers - 2)){
          players[i].score += 5;
        }
      }
  
      players[i].score = roundUp10(players[i].score * 76 / nrOfPlayers);
    }
  
    players.sort((a, b) => {
      return (a.score < b.score);
    });

    showScore();
  }
   
  // useEffect(() => {
  //   getPlayers();
  // }, []);

  return (
    <Center w="100%" h="100%" bgColor="coolGray.300">
      <Text paddingBottom="5px">Vote out the rats!</Text>

      {
        players?.map((player, index) => {
          
          if (index != currentPlayerIndex && player.name != players[currentPlayerIndex].fakeid )
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
        bgColor="amber.900"
        onPress={() => {
          resetVotes();
        }}
      >
        Reset
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
      
    </Center>
  );
};

export default ForgotPasswordPage;
