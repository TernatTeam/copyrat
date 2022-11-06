import React, { useState } from 'react';

import {
  Text,
  Image,
  VStack,
  useToast,
  Icon,
  IconButton,
  Box,
  Button,
  HStack,
} from 'native-base';

import { Ionicons } from '@expo/vector-icons';

import CopyratLogo from '../../../../assets/logo_trans.png';
import { ModalJoinRoom } from '../../../components/common';
import { TouchableOpacity } from 'react-native';

export const HomePage = ({ navigation }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toast = useToast();
  const id = 'voting-toasts';
  const rat_alert = [
    'If they talk about you, they talk about themselves',
    'You’re Italic. I’m in bold.',
    'Go buy yourself a personality.',
    'An original is worth more than a copy. Sometimes.',
    'Don’t study me. You won’t graduate.',
    'Great, a copycat.',
    'A copycat can never influence, but might win.',
    'Parrots mimic their owners.',
    'To copy others is actually why you’re here',
    'I guess you are a fan of monkey’s threat.',
    'No one wants to be you. I promise',
    'Cri-cri...grey autumn...',
    'I’m Yu. He’s Mi.',
  ];

  const showToast = (message) => {
    if (!toast.isActive(id)) {
      return toast.show({
        id,
        duration: 2500,
        placement: 'top',
        render: () => {
          return (
            <Box
              textAlign="center"
              bg="#71dada"
              px="2"
              py="1"
              rounded="sm"
              mb={5}
              justifyContent="center"
              alignItems="center"
              flex={1}
            >
              <Text fontSize="md" fontWeight="bold">
                {message}
              </Text>
            </Box>
          );
        },
      });
    }
  };

  return (
    <Box safeArea bg="primary1.500" h="100%" w="100%">
      <ModalJoinRoom
        show={isModalOpen}
        navigation={navigation}
        onClose={() => {
          setIsModalOpen(false);
        }}
      />

      <HStack px="4" w="full" justifyContent="flex-end">
        <IconButton
          icon={<Icon as={<Ionicons name="book" />} />}
          borderRadius="full"
          _icon={{
            color: 'primary3.500',
            size: '8',
          }}
          _pressed={{
            bg: 'primary3.600',
          }}
          onPress={() => navigation.navigate('Rules')}
        />
      </HStack>

      <Box px="10">
        <TouchableOpacity
          onPress={() => {
            showToast(rat_alert[Math.floor(Math.random() * 13)]);
          }}
        >
          <VStack justifyContent="flex-start" alignItems="center">
            <Image
              mt="-6"
              mb="-20"
              size="2xl"
              alt="Copy Rat Logo"
              source={CopyratLogo}
            />

            <Text fontSize="5xl" fontFamily="RadioNewsman" color="black">
              copyrat
            </Text>
          </VStack>
        </TouchableOpacity>

        <HStack
          flexDirection="column"
          justifyContent="center"
          alignItems="flex-end"
          w="full"
          pt="20"
        >
          <Box w="full" alignItems="flex-start" mb="20">
            <Button
              w="60%"
              title="Create Room"
              rounded="lg"
              medium
              bg="primary3.500"
              _pressed={{ bg: 'primary3.600' }}
              onPress={() => {
                navigation.navigate('Room Settings');
              }}
            >
              <Text fontFamily="RadioNewsman" color="black" fontSize="md">
                Create room
              </Text>
            </Button>
          </Box>

          <Box w="full" alignItems="flex-end">
            <Button
              w="60%"
              title="Join Room"
              rounded="lg"
              medium
              bg="primary3.500"
              _pressed={{ bg: 'primary3.600' }}
              onPress={() => {
                setIsModalOpen(true);
              }}
            >
              <Text fontFamily="RadioNewsman" color="black" fontSize="md">
                Join room
              </Text>
            </Button>
          </Box>
        </HStack>
      </Box>
    </Box>
  );
};

export default HomePage;
