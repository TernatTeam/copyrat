import React from 'react';
import {players} from './ForgotPassword'
import { Center, Button, Text, Link } from 'native-base';

function voteFor(playerName){
    let indexOfVoted = players.findIndex(player => player.fakeid == playerName);
    players[indexOfVoted].votes++;
    window.alert(players[indexOfVoted].votes);
  };

export const InGamePage = ({ navigation }) => {
  return (
    <Center w="100%" h="100%">
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
        onPress={() => {
            let res = players.filter( role => role.role === 'rat');
            alert(JSON.stringify(res));
            
        }}
      >
        TestButton      
        </Button>
              
        <Button
        onPress={() => {
            for (let i = 0; i < players.length; i++) {
                players[i].role = 'cat';
                players[i].votes = 0;
            }
            navigation.navigate('ForgotPassword')
        }}
      >
        Play Again      
        </Button>
    </Center>
  );
};

export default InGamePage;
