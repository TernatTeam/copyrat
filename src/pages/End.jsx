import React from 'react';

import { Box, Button, Flex, ScrollView, Text, VStack } from 'native-base';

export const EndPage = ({ navigation, route }) => {
  const sortedPlayers = route.params.players.sort((a, b) => {
    return a.score < b.score;
  });

  return (
    <Box safeArea bg="primary1.300" h="100%" w="100%" px="4">
      <Box w="full" alignItems="center" justifyContent="center" pt="6">
        <Text fontSize="2xl" fontFamily="RadioNewsman" color="black">
          Winners
        </Text>
      </Box>

      <Box w="full" alignItems="center" justifyContent="center" pt="4" pb="6">
        <Box borderColor="primary2.400" borderBottomWidth="2" p="2" mb="6">
          <Text
            textAlign="center"
            color="primary2.400"
            fontFamily="RadioNewsman"
            fontSize="2xl"
          >
            {sortedPlayers[0].score}
          </Text>

          <Text color="primary2.400" fontFamily="RadioNewsman" fontSize="2xl">
            {sortedPlayers[0].name}
          </Text>
        </Box>

        <Flex justifyContent="space-around" w="full" direction="row">
          <Box borderBottomWidth="2" borderColor="#C0C0C0" p="2">
            <Text
              textAlign="center"
              color="#C0C0C0"
              fontFamily="RadioNewsman"
              fontSize="xl"
            >
              {sortedPlayers[1].score}
            </Text>

            <Text color="#C0C0C0" fontFamily="RadioNewsman" fontSize="xl">
              {sortedPlayers[1].name}
            </Text>
          </Box>

          <Box borderBottomWidth="2" borderColor="#CD7F32" p="2">
            <Text
              textAlign="center"
              color="#CD7F32"
              fontFamily="RadioNewsman"
              fontSize="xl"
            >
              {sortedPlayers[2].score}
            </Text>

            <Text color="#CD7F32" fontFamily="RadioNewsman" fontSize="xl">
              {sortedPlayers[2].name}
            </Text>
          </Box>
        </Flex>
      </Box>

      <Box px="4" bg="primary1.400" rounded="xl" h="50%">
        <ScrollView w="full">
          <VStack my="2" flex="1" justifyContent="center" alignItems="center">
            {sortedPlayers.map((player, index) => {
              return (
                index >= 3 && (
                  <Flex
                    key={index}
                    direction="row"
                    justify="space-between"
                    align="center"
                    bg={player.userNameColor}
                    padding={3}
                    borderRadius={10}
                    my="2"
                    w="full"
                  >
                    <Text fontSize="sm" fontFamily="RadioNewsman" color="black">
                      {index + 1}.
                    </Text>

                    <Text fontSize="md" fontFamily="RadioNewsman" color="black">
                      {player.name}
                    </Text>

                    <Text fontFamily="RadioNewsman" color="black">
                      {player.score}
                    </Text>
                  </Flex>
                )
              );
            })}
          </VStack>
        </ScrollView>
      </Box>

      <Box py="6" mt="auto">
        <Button
          onPress={() => {
            navigation.reset({
              routes: [{ name: 'Tabs' }],
            });
          }}
          title="Start"
          rounded="lg"
          medium
          bg="primary3.300"
          _pressed={{ bg: 'primary3.400' }}
        >
          <Text fontFamily="RadioNewsman" color="black">
            Done
          </Text>
        </Button>
      </Box>
    </Box>
  );
};

export default EndPage;
