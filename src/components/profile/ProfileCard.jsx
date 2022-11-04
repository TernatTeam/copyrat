import React, { useEffect, useState } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { Box, Flex, Heading, HStack, Stack, Text, VStack } from 'native-base';

export const ProfileCard = () => {
  const [user, setUser] = useState();

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
    <Box safeArea w="100%" h="100%" alignItems="flex-start" p="4">
      <Stack space={4} w="full">
        <Box w="full" rounded="xl" bg="primary1.600">
          <Stack space={3} p="4">
            <Flex
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Heading size="md" color="white" mr="1">
                {user?.name}
              </Heading>

              {user?.role && (
                <Heading fontSize="sm" color="violet.400" fontWeight="bold">
                  {user.role}
                </Heading>
              )}
            </Flex>

            <Text
              fontSize="lg"
              color="white"
              fontWeight="bold"
              ml="-0.5"
              mt="-1"
            >
              {user.email}
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
              <Heading size="md" color="white" mr="1">
                Game History
              </Heading>
            </Flex>

            <VStack space={3}>
              <Box rounded="3xl" bg="violet.400" p="2">
                <Text px="2" fontSize="lg" color="white" fontWeight="bold">
                  ceva
                </Text>
              </Box>

              <Box rounded="3xl" bg="violet.400" p="2">
                <Text px="2" fontSize="lg" color="white" fontWeight="bold">
                  ceva
                </Text>
              </Box>

              <Box rounded="3xl" bg="violet.400" p="2">
                <Text px="2" fontSize="lg" color="white" fontWeight="bold">
                  ceva
                </Text>
              </Box>
            </VStack>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

export default ProfileCard;
