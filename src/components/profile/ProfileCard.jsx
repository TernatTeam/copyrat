import React, { useEffect, useState } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { Box, Flex, HStack, Stack, Text, IconButton, Icon } from 'native-base';

import { Ionicons } from '@expo/vector-icons';
import { ModalLogout } from '../common';

export const ProfileCard = ({ navigation }) => {
  const [user, setUser] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    <Box safeArea w="full" alignItems="center">
      <ModalLogout
        show={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
      />

      <HStack w="full" justifyContent="space-between" py="1">
        <IconButton
          icon={<Icon as={<Ionicons name="log-out" />} />}
          borderRadius="full"
          _icon={{
            color: 'primary3.300',
            size: '8',
          }}
          _pressed={{
            bg: 'primary3.400',
          }}
          onPress={() => {
            setIsModalOpen(true);
          }}
        />

        <IconButton
          icon={<Icon as={<Ionicons name="settings-outline" />} />}
          borderRadius="full"
          _icon={{
            color: 'primary3.300',
            size: '8',
          }}
          _pressed={{
            bg: 'primary3.400',
          }}
          onPress={() => {
            navigation.navigate({ name: 'Settings' });
          }}
        />
      </HStack>

      <Stack space={4} w="full" pt="4">
        <Box w="full" rounded="xl" bg="primary1.400">
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

            <Text fontSize="sm" color="white" fontWeight="bold">
              {user?.email}
            </Text>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

export default ProfileCard;
