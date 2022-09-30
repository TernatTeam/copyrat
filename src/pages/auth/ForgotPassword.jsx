import React from 'react';

import { Center, Text, Button } from 'native-base';

let players = [
  {
    name: 'Dragos',
    role: 'rat',
    fakeid: 'Matei',
    vote: 'Mario',
    nrOfVotes: 0, 
    score: 0
  },
  {
    name: 'Cosmin',
    role: 'cat',
    fakeid: 'Cosmin',
    vote: 'Matei',
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
    vote: 'Dragos',
    nrOfVotes: 0,
    score: 0
  }
];

function voteFor(playerName) {
  let indexOfVoted = players.findIndex(player => player.fakeid == playerName);
  players[indexOfVoted].votes++;
  window.alert(players[indexOfVoted].votes);
};

function resetVotes() {
  const nrOfPlayers = players.length;

  for (let i = 0; i < nrOfPlayers; i++) {
    players[i].votes = players[i].score = 0;
  }
}

function roundUp10(num) {
  return Math.ceil(num / 10) * 10;
}

function calculateScore() {
  const nrOfPlayers = players.length;

  for (let i = 0; i < nrOfPlayers; i++) {
    let indexOfVoted = players.findIndex(player => player.fakeid == players[i].vote);

    if (players[i].role === 'cat') { // real
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

  window.alert("Scoreboard:\nDragos: " + players[0].score +
                          "\nCosmin: " + players[1].score +
                          "\nMario: " + players[2].score +
                          "\nDavid: " + players[3].score + 
                          "\nCostin: " + players[4].score + 
                          "\nMatei: " + players[5].score);
}


export const ForgotPasswordPage = () => {
  return (
    <Center w="100%" h="100%" bgColor="coolGray.300">
      <Text paddingBottom="5px">Vote out the rats!</Text>
      <Button
        w="20%" h="5%"
        marginBottom="4px"
        padding="1px"
        onPress={() => {
          voteFor('Dragos');
        }}
      >
        Dragos
      </Button>

      <Button
        w="20%" h="5%"
        marginBottom="4px"
        padding="1px"
        onPress={() => {
          voteFor('Cosmin');
        }}
      >
        Cosmin
      </Button>

      <Button
        w="20%" h="5%"
        marginBottom="4px"
        padding="1px"
        onPress={() => {
          voteFor('Mario');
        }}
      >
        Mario
      </Button>

      <Button
        w="20%" h="5%"
        marginBottom="4px"
        padding="1px"
        onPress={() => {
          voteFor('David');
        }}
      >
        David
      </Button>

      <Button
        w="20%" h="5%"
        marginBottom="4px"
        padding="1px"
        onPress={() => {
          voteFor('Costin');
        }}
      >
        Costin
      </Button>

      <Button
        w="20%" h="5%"
        marginBottom="4px"
        padding="1px"
        onPress={() => {
          voteFor('Matei');
        }}
      >
        Matei
      </Button>

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
