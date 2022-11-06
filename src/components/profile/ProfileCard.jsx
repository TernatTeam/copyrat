import React, { useEffect, useState } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  Box,
  Flex,
  HStack,
  Stack,
  Text,
  VStack,
  IconButton,
  Icon,
} from 'native-base';

import { signOut } from 'firebase/auth';
import { auth } from '../../../config/firebase/firebase-key-config';

import { Ionicons } from '@expo/vector-icons';

export const ProfileCard = ({ navigation }) => {
  const [user, setUser] = useState();

  const logOut = () => {
    signOut(auth).then(() => {
      navigation.reset({
        routes: [{ name: 'Login' }],
      });
    });
  };

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('user');
      setUser(jsonValue != null ? JSON.parse(jsonValue) : null);
    } catch (err) {
      console.log('Err: ', err);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <Box safeArea w="full" alignItems="flex-start">
      <HStack w="full" justifyContent="flex-start">
        <IconButton
          icon={<Icon as={<Ionicons name="log-out" />} />}
          borderRadius="full"
          _icon={{
            color: 'primary3.500',
            size: '8',
          }}
          _pressed={{
            bg: 'primary3.600',
          }}
          onPress={logOut}
          rotation={180}
        />
      </HStack>

      <Stack space={4} w="full" px="4">
        <Box w="full" rounded="xl" bg="primary1.600">
          <Stack space={3} p="4">
            <Flex
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Text fontSize="md" fontFamily="RadioNewsman" color="white">
                {user?.name}
              </Text>

              {user?.role && (
                <Text
                  color="violet.400"
                  fontSize="xs"
                  fontFamily="RadioNewsman"
                >
                  {user.role}
                </Text>
              )}
            </Flex>

            <Text fontSize="sm" color="white" fontFamily="RadioNewsman">
              {user?.email}
            </Text>
          </Stack>
        </Box>

        <Box w="full" rounded="xl" bg="primary1.600">
          <Stack space={3} p="4">
            <Flex
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Text
                fontFamily="RadioNewsman"
                fontSize="md"
                color="white"
                mr="1"
              >
                Game History
              </Text>
            </Flex>

            <VStack space={3}>
              <Text fontFamily="RadioNewsman" color="white" fontSize="sm">
                COMING SOON
              </Text>
            </VStack>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

export default ProfileCard;
