import React, { useState } from 'react';

import * as yup from 'yup';

import {
  Box,
  Button,
  Modal,
  Text,
  useToast,
  KeyboardAvoidingView,
  VStack,
} from 'native-base';

import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../../config/firebase/firebase-key-config';
import { UnderlinedInput } from '../interface';
import { useColors } from '../../hooks';
import { useGlobal } from '../../../state';

const joinGameSchema = yup.object({
  keyCode: yup.string().required('Key room is required'),
  name: yup.string().required('Name is required'),
});

export const ModalJoinRoom = ({
  show = false,
  onClose = () => {},
  navigation,
}) => {
  const [name, setName] = useState('');
  const [isNameInvalid, setIsInvalidName] = useState(false);
  const [keyCode, setKeyCode] = useState('');
  const [isInvalidKeyCode, setIsInvalidKeyCode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [{}, dispatch] = useGlobal();

  const toast = useToast();
  const id = 'error-toasts';

  const resetFieldsErrors = () => {
    setIsInvalidName(true);
    setIsInvalidKeyCode(true);

    setTimeout(() => {
      setIsInvalidName(false);
      setIsInvalidKeyCode(false);
    }, 2500);
  };

  const showToast = (text) => {
    if (!toast.isActive(id)) {
      toast.show({
        id,
        duration: 2500,
        placement: 'top',
        render: () => {
          return (
            <Box bg="red.500" px="2" py="1" rounded="sm" mb={5}>
              {text}
            </Box>
          );
        },
      });
    }
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

      onClose();

      navigation.reset({
        routes: [{ name: 'Lobby' }],
      });
    } catch (err) {
      console.log('Err: ', err);
      showToast('Something went wrong');
    }
  };

  const searchAndJoinRoom = async () => {
    try {
      const docSnap = await getDoc(
        doc(db, 'games', keyCode, 'admin', 'game_state'),
      );
      const docSnap2 = await getDoc(doc(db, 'games', keyCode));

      if (docSnap.exists()) {
        if (docSnap.data().is_game_ready === false) {
          dispatch({
            type: 'ROOM_DATA',
            keyCode: keyCode,
            game_admin_uid: docSnap2.data().game_admin_uid,
            round_number: 1,
          });

          return true;
        } else {
          showToast('The game already started');

          return false;
        }
      } else {
        showToast('The room does not exist');

        resetFieldsErrors();

        return false;
      }
    } catch (err) {
      console.log(err);

      showToast('Something went wrong');

      return false;
    }
  };

  const onSubmit = () => {
    joinGameSchema
      .isValid({
        name: name,
        keyCode: keyCode,
      })
      .then(async (isValid) => {
        if (isValid) {
          setIsLoading(true);
          const resposeJoinRoom = await searchAndJoinRoom();
          if (resposeJoinRoom) {
            await addPlayerName();
          }
          setIsLoading(false);
        }
      });

    joinGameSchema.validate({ name: name, keyCode: keyCode }).catch((err) => {
      showToast(err.message);

      if (err.path === 'name') {
        setIsInvalidName(true);
      } else {
        setIsInvalidKeyCode(true);
      }
    });
  };

  return (
    <Modal
      isOpen={show}
      onClose={() => {
        onClose();
      }}
      size="md"
      closeOnOverlayClick={!isLoading}
    >
      <KeyboardAvoidingView behavior="position" w="full">
        <Box justifyContent="center" alignItems="center" pb="2" w="full">
          <Modal.Content borderRadius={10}>
            <Modal.Header
              bg="primary1.500"
              alignItems="center"
              justifyContent="center"
            >
              <Text fontFamily="RadioNewsman" color="black" fontSize="md">
                Join room
              </Text>
            </Modal.Header>

            <Modal.Body
              bg="primary1.500"
              alignItems="center"
              justifyContent="center"
            >
              <VStack space={4} w="full">
                <UnderlinedInput
                  inputColor="primary3.500"
                  iconColor="primary3.500"
                  fontFamily="RadioNewsman"
                  placeholder="Name"
                  icon="person-outline"
                  isInvalid={isNameInvalid}
                  value={name}
                  onChangeText={(value) => {
                    setIsInvalidName(false);
                    setName(value);
                  }}
                />

                <UnderlinedInput
                  inputColor="primary3.500"
                  iconColor="primary3.500"
                  fontFamily="RadioNewsman"
                  placeholder="Room Key"
                  icon="key-outline"
                  isInvalid={isInvalidKeyCode}
                  value={keyCode}
                  onChangeText={(value) => {
                    setIsInvalidKeyCode(false);
                    setKeyCode(value.toUpperCase());
                  }}
                />
              </VStack>
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
                <Text
                  fontFamily="RadioNewsman"
                  fontWeight="semibold"
                  color="black"
                >
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

export default ModalJoinRoom;
