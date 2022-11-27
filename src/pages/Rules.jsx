import React, { useState } from 'react';

import { Text, Icon, IconButton, Flex, HStack, VStack, Box } from 'native-base';

import { Ionicons } from '@expo/vector-icons';

import { Audio } from 'expo-av';

export const RulesPage = ({ navigation }) => {
  const [page, setPage] = useState(1);

  const playSound = async () => {
    await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });

    await Audio.Sound.createAsync(
      {
        uri: 'https://firebasestorage.googleapis.com/v0/b/copyrat-7b7d6.appspot.com/o/page-flip-02.mp3?alt=media&token=45237d61-b866-4715-930c-f082c590a7e9',
      },
      { shouldPlay: true, rate: 2 },
    );
  };

  return (
    <Flex safeArea bg="primary1.300" h="100%" w="100%" alignItems="center">
      <HStack
        px="2"
        w="full"
        justifyContent="space-between"
        alignItems="flex-start"
      >
        <IconButton
          icon={<Icon as={<Ionicons name="close-outline" />} />}
          borderRadius="full"
          _icon={{
            color: 'white',
            size: '8',
          }}
          _pressed={{
            bg: 'primary3.400',
          }}
          onPress={() => {
            navigation.navigate('Tabs');
          }}
        />
      </HStack>

      <VStack p="5" justifyContent="center" alignItems="center" m="auto">
        {page == 1 && (
          <Text
            color="white"
            fontSize="17"
            fontFamily="RadioNewsman"
            textAlign="center"
          >
            Simple as meow. Three rounds, one chat and o lot of copyrats.{'\n'}
            {'\n'}
            Each round, you'll be assigned to be just like someone from the
            lobby. You'll see your role in the top right of your screen:{'\n'}
            'Playing as ...'.{'\n'}
            {'\n'}
            You could either play as yourself (meaning you're a cat), either as
            one of your friends (making you a rat).
          </Text>
        )}

        {page == 2 && (
          <Text
            color="white"
            fontSize="17"
            fontFamily="RadioNewsman"
            textAlign="center"
          >
            Let's say you're a cat. Try and catch the impostors among you ;).
            Ask personal questions, test their memory, see their response, do
            the math then pick a rat.{'\n'}
            {'\n'}
            As a rat, be a copy of the one you've been assigned. When texting,
            it will appear like it's them talking, so don't panic when you see
            yourself in there saying something you didn't.{'\n'}
            {'\n'}
            Chat like the one you've been assigned, quote them, do anything just
            to fool the rest. You can vote as well, so try to catch the other
            rats.
          </Text>
        )}

        {page == 3 && (
          <Text
            color="white"
            fontSize="17"
            fontFamily="RadioNewsman"
            textAlign="center"
          >
            Let's see the scoring!{'\n'}
            Well, the rats get points by fooling the others and having as little
            players as possible vote for them.{'\n'}
            {'\n'}
            Rats will be rats, so their vote doesn't add to their score, but it
            makes the others gain less.{'\n'}
            {'\n'}
            Cats get points by correctly voting out the rats. Avoid teamming up,
            cause cats split points when voting for the same rat.{'\n'}
            {'\n'}
            Bonus points for anyone who does his job perfectly.{'\n'}
            {'\n'}
            {'\n'}
            Good luck !
          </Text>
        )}
      </VStack>

      <HStack
        p="4"
        w="full"
        justifyContent="space-between"
        alignItems="flex-end"
      >
        {page > 1 ? (
          <IconButton
            icon={<Icon as={<Ionicons name="arrow-undo" />} />}
            borderRadius="full"
            _icon={{
              color: 'white',
              size: '8',
            }}
            _pressed={{
              bg: 'primary3.400',
            }}
            onPress={() => {
              playSound();
              setTimeout(() => {
                if (page > 1) {
                  setPage(page - 1);
                }
              }, 200);
            }}
          />
        ) : (
          <Box w="12"></Box>
        )}

        <Text
          color="white"
          fontSize="15"
          fontFamily="RadioNewsman"
          alignItems="center"
          pb="2"
        >
          {page} / 3
        </Text>

        {page < 3 ? (
          <IconButton
            icon={<Icon as={<Ionicons name="arrow-redo" />} />}
            borderRadius="full"
            _icon={{
              color: 'white',
              size: '8',
            }}
            _pressed={{
              bg: 'primary3.400',
            }}
            onPress={() => {
              playSound();
              setTimeout(() => {
                if (page < 3) {
                  setPage(page + 1);
                }
              }, 200);
            }}
          />
        ) : (
          <Box w="12"></Box>
        )}
      </HStack>
    </Flex>
  );
};

export default RulesPage;
