import React from 'react';
import {players} from './ForgotPassword'
import { Center, Button, Text, Link } from 'native-base';

function voteFor(playerName){
    let indexOfVoted = players.findIndex(player => player.fakeid == playerName);
    players[indexOfVoted].no_of_votes++;
    window.alert(players[indexOfVoted].no_of_votes);
  };

  function roundUp10(num) {
    return Math.ceil(num / 10) * 10;
  }

  function calculateScore() {
    const nrOfPlayers = players.length;
  
    for (let i = 0; i < nrOfPlayers; i++) {
      let indexOfVoted = players.findIndex(player => player.fakeid == players[i].vote);

      if (players[i].role === 'cat') { // real
        if (players[players[i].vote].role === 'rat') {
          players[i].score += nrOfPlayers - 1 - players[players[i].vote].no_of_votes;
        }
        
        if (players[i].score < 1) {
            players[i].score = 1;
        }
        
        players[i].score *= 10;
        
        if (players[i].score == 10 * (nrOfPlayers - 2)) {
          players[i].score += 5;
        }
      } else { // fake
        players[i].score += nrOfPlayers - 2 - players[i].no_of_votes;
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
                players[i].no_of_votes = players[i].score = 0;
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
