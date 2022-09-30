import React from 'react';

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

export const ForgotPasswordPage = () => {
  function smth() {
    
    let cnt = 0;
    while (cnt < 3) {
      let val = Math.floor(Math.random() * 5) + 1;
      if (players[val].role === 'cat') {
        players[val].role = 'rat';
        cnt++;
      }
    }
    let res = players.filter( role => role.role === 'rat');
    res[0].fakeid = res[2].name;
    for (let i = 1; i < 3; i++) {
      res[i].fakeid = res[i - 1].name;
    }
    alert(JSON.stringify(res));

    // reset roles
    for (let i = 0; i < 6; i++)
      players[i].role = 'cat';
  }
  return (
    
    <Center w="100%" h="100%" bgColor="primary1.500">
      <Button
        onPress={() => 
          smth()
        }
      >
        Apasa
      </Button>
      
    </Center>
  );
};



export default ForgotPasswordPage;
