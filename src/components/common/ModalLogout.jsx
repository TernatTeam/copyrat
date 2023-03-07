import React, { useState } from 'react';

import { Box, Button, Modal, Text, KeyboardAvoidingView } from 'native-base';

import { signOut } from 'firebase/auth';
import { auth } from '../../../config/firebase/firebase-key-config';

export const ModalLogout = ({ show, onClose = () => {} }) => {
  const [isLoading, setIsLoading] = useState(false);

  const removeValue = async () => {
    try {
      await AsyncStorage.removeItem('user');
    } catch (e) {
      console.log(e);
    }
  };

  const logout = async () => {
    setIsLoading(true);

    await removeValue();

    await signOut(auth);
  };

  return (
    <Modal isOpen={show} onClose={onClose} justifyContent="center" size="md">
      <KeyboardAvoidingView behavior="position" w="full">
        <Box justifyContent="center" alignItems="center" pb="2" w="full">
          <Modal.Content borderRadius={15}>
            <Modal.Header
              bg="primary1.300"
              alignItems="center"
              justifyContent="center"
            >
              <Text
                fontFamily="RadioNewsman"
                color="white"
                textAlign="center"
                style={{ fontSize: 18, fontWeight: 'bold' }}
              >
                Are you sure you want to log out?
              </Text>
            </Modal.Header>

            <Modal.Footer bg="primary1.300">
              <Button
                mb="2"
                w="full"
                bg="primary3.300"
                _pressed={{ bg: 'primary3.400' }}
                onPress={onClose}
              >
                <Text
                  fontFamily="RadioNewsman"
                  fontWeight="semibold"
                  color="black"
                >
                  No
                </Text>
              </Button>

              <Button
                w="full"
                bg="primary4.300"
                onPress={logout}
                disabled={isLoading}
                isLoading={isLoading}
                //the size didnt match so i had to do this..
                _spinner={{ paddingY: '0.48' }}
                _pressed={{ bg: 'primary4.400' }}
              >
                <Text
                  fontFamily="RadioNewsman"
                  fontWeight="semibold"
                  color="white"
                >
                  Yes
                </Text>
              </Button>
            </Modal.Footer>
          </Modal.Content>
        </Box>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default ModalLogout;
