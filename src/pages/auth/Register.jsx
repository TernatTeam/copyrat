import React from 'react';

import { Center, Button, Text } from 'native-base';

export const RegisterPage = ({ navigation }) => {
  return (
    <Center w="100%" h="100%">
      <Text>Register Page</Text>
      <Button
        onPress={() => {
          navigation.navigate('ForgotPassword');
        }}
      >
        Forgot Password
      </Button>
    </Center>
  );
};

export default RegisterPage;
