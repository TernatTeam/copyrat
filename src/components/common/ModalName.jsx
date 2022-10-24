import React, { useState } from 'react';

import * as yup from 'yup';

import {
  Box,
  Button,
  Modal,
  Text,
  useToast,
  KeyboardAvoidingView,
} from 'native-base';

import {
  auth,
  db,
  doc,
  setDoc,
} from '../../../config/firebase/firebase-key-config';
import { UnderlinedInput } from '../interface';
import { useColors } from '../../hooks';

const joinGameSchema = yup.object({
  name: yup.string().required('Name is required'),
});

export const ModalName = ({ show = false, onClose = () => {}, keyCode }) => {
  const [name, setName] = useState('');
  const [isNameInvalid, setIsInvalidName] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const toast = useToast();
  const id = 'error-toasts';

  const resetFieldsErrors = () => {
    setIsInvalidName(true);

    setTimeout(() => {
      setIsInvalidName(false);
    }, 2500);
  };

  const addPlayerName = async () => {
    const currenUserUID = auth.currentUser.uid;

    try {
      await setDoc(doc(db, `games/${keyCode}/players/${currenUserUID}`), {
        name: name,
        fake_id: name,
        no_of_votes: 0,
        score: 0,
        vote: -1,
        userNameColor: useColors(),
      });

      return true;
    } catch (err) {
      console.log('Err: ', err);
      return false;
    }
  };

  const onSubmit = () => {
    joinGameSchema
      .isValid({
        name: name,
      })
      .then(async (isValid) => {
        if (isValid) {
          setIsLoading(true);

          const response = await addPlayerName();

          if (response) {
            onClose();
          } else {
            if (!toast.isActive(id)) {
              toast.show({
                id,
                duration: 2500,
                placement: 'top',
                render: () => {
                  return (
                    <Box bg="red.500" px="2" py="1" rounded="sm" mb={5}>
                      Something went wrong
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

    joinGameSchema.validate({ name: name }).catch((err) => {
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

      if (err.path === 'name') {
        setIsInvalidName(true);
      }
    });
  };

  return (
    <Modal isOpen={show} justifyContent="center" size="md">
      <KeyboardAvoidingView behavior="position" w="full">
        <Box justifyContent="center" alignItems="center" pb="2" w="full">
          <Modal.Content borderRadius={15}>
            <Modal.Header
              bg="primary1.500"
              alignItems="center"
              justifyContent="center"
            >
              <Text color="white" style={{ fontSize: 18, fontWeight: 'bold' }}>
                Name
              </Text>
            </Modal.Header>

            <Modal.Body
              bg="primary1.500"
              alignItems="center"
              justifyContent="center"
            >
              <UnderlinedInput
                placeholder="Name"
                icon="person-outline"
                isInvalid={isNameInvalid}
                value={name}
                onChangeText={(value) => {
                  setIsInvalidName(false);
                  setName(value);
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

export default ModalName;
