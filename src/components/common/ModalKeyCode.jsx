import React, { useState } from 'react';

import * as yup from 'yup';

import {
  Box,
  Button,
  Icon,
  Input,
  Modal,
  Text,
  useToast,
  KeyboardAvoidingView,
} from 'native-base';

import { Ionicons } from '@expo/vector-icons';

import { db, doc, getDoc } from '../../../config/firebase/firebase-key-config';

const joinGameSchema = yup.object({
  keyCode: yup.string().required('Key room is required'),
});

export const ModalKeyCode = ({ show = false, onClose = () => {} }) => {
  const [keyCode, setKeyCode] = useState('');
  const [isInvalidKeyCode, setIsInvalidKeyCode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const toast = useToast();
  const id = 'error-toasts';

  const resetFieldsErrors = () => {
    setIsInvalidKeyCode(true);

    setTimeout(() => {
      setIsInvalidKeyCode(false);
    }, 2500);
  };

  const onSubmit = () => {
    joinGameSchema
      .isValid({
        keyCode: keyCode,
      })
      .then(async (isValid) => {
        if (isValid) {
          setIsLoading(true);

          const docSnap = await getDoc(
            doc(db, 'games', keyCode, 'admin', 'gameState'),
          );
          const docSnap2 = await getDoc(doc(db, 'games', keyCode));
          if (docSnap.exists()) {
            if (docSnap.data().is_game_ready === false) {
              onClose(keyCode, docSnap2.data().game_admin_uid);
            } else {
              if (!toast.isActive(id)) {
                toast.show({
                  id,
                  duration: 2500,
                  placement: 'top',
                  render: () => {
                    return (
                      <Box bg="red.500" px="2" py="1" rounded="sm" mb={5}>
                        The game already started
                      </Box>
                    );
                  },
                });
              }
            }
          } else {
            if (!toast.isActive(id)) {
              toast.show({
                id,
                duration: 2500,
                placement: 'top',
                render: () => {
                  return (
                    <Box bg="red.500" px="2" py="1" rounded="sm" mb={5}>
                      The room does not exist
                    </Box>
                  );
                },
              });
            }

            resetFieldsErrors();
          }

          setIsLoading(false);
        }
      });

    joinGameSchema.validate({ keyCode: keyCode }).catch((err) => {
      if (!toast.isActive(id)) {
        toast.show({
          id,
          duration: 2500,
          placement: 'top',
          render: () => {
            return (
              <Box bg="red.500" px="2" py="1" rounded="sm" mb={5}>
                {err.message}
              </Box>
            );
          },
        });
      }

      if (err.path === 'keyCode') {
        setIsInvalidKeyCode(true);
      }
    });
  };

  return (
    <Modal
      isOpen={show}
      onClose={() => {
        onClose(null);
      }}
      size="md"
    >
      <KeyboardAvoidingView behavior="position" w="full">
        <Box justifyContent="center" alignItems="center" pb="2" w="full">
          <Modal.Content borderRadius={10}>
            <Modal.Header
              bg="primary1.500"
              alignItems="center"
              justifyContent="center"
            >
              <Text color="white" style={{ fontSize: 18, fontWeight: 'bold' }}>
                Room key
              </Text>
            </Modal.Header>

            <Modal.Body
              bg="primary1.500"
              alignItems="center"
              justifyContent="center"
            >
              <Input
                borderBottomWidth={2}
                borderBottomColor={`${isInvalidKeyCode ? 'red.500' : 'black'}`}
                _focus={
                  isInvalidKeyCode
                    ? {
                        borderBottomColor: 'red.500',
                        placeholderTextColor: 'red.500',
                      }
                    : {
                        borderBottomColor: 'white',
                        placeholderTextColor: 'white',
                      }
                }
                InputRightElement={
                  <Icon
                    as={<Ionicons name="key-outline" />}
                    size={6}
                    mr="2"
                    color={isInvalidKeyCode ? `red.500` : 'white'}
                  />
                }
                variant="underlined"
                placeholder="Room Key"
                placeholderTextColor={isInvalidKeyCode ? `red.500` : 'black'}
                color={isInvalidKeyCode ? 'red.500' : 'white'}
                value={keyCode}
                onChangeText={(value) => {
                  setIsInvalidKeyCode(false);
                  setKeyCode(value.toUpperCase());
                }}
              />
            </Modal.Body>

            <Modal.Footer bg="primary1.500">
              <Button
                w="full"
                bg="primary3.500"
                _pressed={{ bg: 'primary3.600' }}
                onPress={onSubmit}
                disabled={isLoading}
                isLoading={isLoading}
                //the size didnt match so i had to do this..
                _spinner={{ paddingY: '0.48' }}
              >
                <Text fontWeight="semibold" color="black">
                  Done
                </Text>
              </Button>
            </Modal.Footer>
          </Modal.Content>
        </Box>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default ModalKeyCode;
