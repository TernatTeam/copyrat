import React from 'react';

import { Box, Flex, Stack, Text, VStack } from 'native-base';

export const GameHistory = () => {
  return (
    <Box w="full" rounded="xl" bg="primary1.400">
      <Stack space={3} p="4">
        <Flex
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Text fontFamily="RadioNewsman" fontSize="md" color="white" mr="1">
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
  );
};

export default GameHistory;
