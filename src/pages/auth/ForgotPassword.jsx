import React from 'react';
import InGamePage from './InGame';
import { Center, Button, Text } from 'native-base';

var players = [
  {
    name: 'Dragos',
    role: 'cat',
    votes: 0, 
    fakeid: null,
    score: 0
  },
  {
    name: 'Cosmin',
    role: 'cat',
    votes: 0,
    fakeid: null, 
    score: 0
  }, 
  {
    name: 'Mario',
    role: 'cat',
    votes: 0,
    fakeid: null, 
    score: 0
  },
  {
  name: 'David',
  role: 'cat',
  votes: 0,
  fakeid: null, 
  score: 0
  },
  {
    name: 'Costin',
    role: 'cat',
    votes: 0, 
    fakeid: null,
    score: 0
  },
  {
    name: 'Matei',
    role: 'cat',
    votes: 0,
    fakeid: null, 
    score: 0
  }
];

export const ForgotPasswordPage = ({ navigation }) => {
  function set_roles() {
    let no_of_rats = players.length / 2;
    let cnt = 0;
    while (cnt < no_of_rats) {
      let val = Math.floor(Math.random() * 5) + 1;
      if (players[val].role === 'cat') {
        players[val].role = 'rat';
        cnt++;
      }
    }
    for(let i = 0; i < players.length; i++)
      players[i].fakeid = players[i].name;
    let res = players.filter( role => role.role === 'rat');
    res[0].fakeid = res[no_of_rats - 1].name;
    for (let i = 1; i < no_of_rats; i++) {
      res[i].fakeid = res[i - 1].name;
    }

    navigation.navigate('InGame')
    //alert(JSON.stringify(res));
    
    // reset roles
    
    
  }
  return (
    
    <Center w="100%" h="100%" bgColor="primary1.500">
      <Button
        onPress={() => 
          set_roles()
          
        }
      >
        Apasa
      </Button>
      
    </Center>
  );
};



export default ForgotPasswordPage;
export {players};
