import React from 'react';

import { Button, Center, Text } from 'native-base';

import {
  db,
  collection,
  addDoc,
} from '../../../config/firebase/firebase-key-config';

export const LoginPage = ({ navigation }) => {
  const writeData = async () => {
    try {
      await addDoc(collection(db, `test/`), {
        muie: 'muie2',
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Center w="100%" h="100%">
      <Text>Login Page</Text>
      <Button
        marginBottom="4px"
        onPress={() => {
          navigation.navigate('Register');
        }}
      >
        Regsiter
      </Button>

      <Button onPress={writeData}>Write in db</Button>
    </Center>
  );
};

export default LoginPage;
