import React, { useState } from 'react';

import * as yup from 'yup';

import {
  Box,
  Button,
  Center,
  Flex,
  Icon,
  IconButton,
  ScrollView,
  Text,
  useToast,
  VStack,
} from 'native-base';

import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../config/firebase/firebase-key-config';

import { TouchableWithoutFeedback, Keyboard } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useColors, useKeyboard } from '../hooks';
import UnderlinedInput from '../components/interface/UnderlinedInput';
import { useGlobal } from '../../state';

const joinGameSchema = yup.object({
  name: yup.string().required('Name is required'),
});

const timeButtons = [
  { label: '3 min', value: 30 },
  { label: '5 min', value: 300 },
  { label: '7 min', value: 420 },
];

export const RoomSettingsPage = ({ navigation }) => {
  const [isLoadingCreateRoom, setIsLoadingCreateRoom] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [name, setName] = useState('');
  const [isInvalidName, setIsInvalidName] = useState(false);
  const [selectedTime, setSelectedTime] = useState(180);
  const keyboardStatus = useKeyboard();
  const [{}, dispatch] = useGlobal();

  const toast = useToast();
  const id = 'error-toasts';

  const resetFieldsErrors = () => {
    setIsInvalidName(true);

    setTimeout(() => {
      setIsInvalidName(false);
    }, 2500);
  };

  const generateRoomKey = async (length) => {
    setIsLoadingCreateRoom(true);
    setIsDisabled(true);

    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const charactersLength = characters.length;
    const currentUser = auth.currentUser;

    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    try {
      await setDoc(doc(db, 'games', result), {
        game_admin_uid: currentUser.uid,
      });

      await setDoc(doc(db, 'games', result, 'admin', 'game_state'), {
        is_game_ready: false,
        nav_to_score: false,
      });

      dispatch({
        type: 'ROOM_DATA',
        keyCode: result,
        game_admin_uid: currentUser.uid,
        round_number: 1,
      });

      return result;
    } catch (err) {
      console.log(err);
    }
  };

  const addPlayerName = async (keyCode) => {
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

      setIsLoadingCreateRoom(false);
      setIsDisabled(false);

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
          setIsLoadingCreateRoom(true);
          const keyCode = await generateRoomKey(4);
          const response = await addPlayerName(keyCode);

          if (response) {
            navigation.reset({
              routes: [
                { name: 'Lobby', params: { roundSeconds: selectedTime } },
              ],
            });
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

          setIsLoadingCreateRoom(false);
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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Center safeArea bg="primary1.500" h="100%" w="100%" position="relative">
        <Box px="4" w="full" justifyContent="center" alignItems="flex-start">
          <IconButton
            icon={<Icon as={<Ionicons name="close-outline" />} />}
            borderRadius="full"
            _icon={{
              color: 'primary3.500',
              size: '8',
            }}
            _pressed={{
              bg: 'primary3.600',
            }}
            onPress={() => {
              navigation.navigate('Tabs');
            }}
          />
        </Box>

        <ScrollView w="full" h="full" px="10">
          <Text
            py="10"
            pb="10"
            fontSize="3xl"
            textAlign="center"
            fontFamily="RadioNewsman"
            color="black"
          >
            Create Game
          </Text>

          <VStack space={8}>
            <Box justifyContent="center">
              <Text
                fontFamily="RadioNewsman"
                color="black"
                fontWeight="semibold"
                fontSize="md"
              >
                Set your username:
              </Text>

              <UnderlinedInput
                inputColor="primary3.500"
                iconColor="primary3.500"
                placeholder="username"
                icon="person-outline"
                onChangeText={(value) => {
                  setIsInvalidName(false);
                  setName(value);
                }}
                isInvalid={isInvalidName}
                value={name}
              />
            </Box>

            <Box>
              <Text
                mb="3"
                fontFamily="RadioNewsman"
                color="black"
                fontWeight="semibold"
                fontSize="md"
              >
                Set the time of every round:
              </Text>

              <Flex
                direction="row"
                w="full"
                justifyContent="space-between"
                alignItems="center"
              >
                {timeButtons.map((timeButton, index) => {
                  return (
                    <Button
                      title={timeButton.label}
                      key={index}
                      borderWidth={
                        selectedTime === timeButton.value ? '3' : '3'
                      }
                      borderColor={
                        selectedTime === timeButton.value
                          ? 'black'
                          : 'primary3.50'
                      }
                      px="4"
                      bg="primary3.500"
                      _pressed={{ bg: 'primary3.600' }}
                      onPress={() => {
                        setSelectedTime(timeButton.value);
                      }}
                    >
                      <Text fontFamily="RadioNewsman">{timeButton.label}</Text>
                    </Button>
                  );
                })}
              </Flex>
            </Box>
          </VStack>
        </ScrollView>

        <Box
          position="absolute"
          bottom={keyboardStatus ? '2' : '6'}
          w="full"
          px="4"
        >
          <Button
            title="Create game"
            w="full"
            bg="primary3.500"
            _pressed={{ bg: 'primary3.600' }}
            onPress={onSubmit}
            disabled={isDisabled}
            isLoading={isLoadingCreateRoom}
            _spinner={{ paddingY: '0.48' }}
          >
            <Text fontFamily="RadioNewsman" fontWeight="semibold" color="black">
              Create game
            </Text>
          </Button>
        </Box>
      </Center>
    </TouchableWithoutFeedback>
  );
};

export default RoomSettingsPage;
