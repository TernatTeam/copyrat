import React from 'react';

import { Center, Text, Button, v3CompatibleTheme } from 'native-base';
import { RefreshControl } from 'react-native';

let players = [
  {
    name: 'Dragos',
    role: 'rat',
    votes: 0, 
    score: 0
  },
  {
    name: 'Cosmin',
    role: 'cat',
    votes: 0, 
    score: 0
  }, 
  {
    name: 'Mario',
    role: 'rat',
    votes: 0, 
    score: 0
  },
  {
  name: 'David',
  role: 'cat',
  votes: 0, 
  score: 0
  },
  {
    name: 'Costin',
    role: 'cat',
    votes: 0, 
    score: 0
  }
];

function voteFor(playerName){
  let indexOfVoted = players.findIndex(player => player.name == playerName);
  players[indexOfVoted].votes++;
  window.alert(players[indexOfVoted].votes);
};

export const ForgotPasswordPage = () => {
  return (
    <Center w="100%" h="100%" bgColor="primary1.500">
      <Text paddingBottom="5px">Forgot Password Page</Text>
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
        bgColor="amber.900"
        onPress={() => {
          players.forEach(function (player){
            player.votes = 0;
          });
        }}
      >
        Reset
      </Button>
    </Center>
  );
};

export default ForgotPasswordPage;
