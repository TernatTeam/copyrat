import React, { useState } from 'react';

import * as yup from 'yup';

import { Box, Button, Icon, Input, Modal, Text, useToast } from 'native-base';

import { Ionicons } from '@expo/vector-icons';

import {
  auth,
  db,
  doc,
  setDoc,
} from '../../../config/firebase/firebase-key-config';
// import { TouchableWithoutFeedback } from 'react-native';

const joinGameSchema = yup.object({
  name: yup.string().required('Name is required'),
});

export const ModalName = ({
  show = false,
  onClose = () => {},
  keyCode,
  userNameColors,
}) => {
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
        userNameColor: userNameColors[Math.floor(Math.random() * 6)],
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
          <Input
            borderBottomWidth={2}
            borderBottomColor={`${isNameInvalid ? 'red.500' : 'black'}`}
            _focus={
              isNameInvalid
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
                as={<Ionicons name="person-outline" />}
                size={6}
                mr="2"
                color={isNameInvalid ? `red.500` : 'white'}
              />
            }
            variant="underlined"
            placeholder="Name"
            placeholderTextColor={isNameInvalid ? `red.500` : 'black'}
            color={isNameInvalid ? 'red.500' : 'white'}
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
    </Modal>
  );
};

export default ModalName;
