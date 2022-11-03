import React from 'react';

import { Box, Text } from 'native-base';

export const ProfilePage = () => {
  return (
    <Box
      w="100%"
      h="100%"
      justifyContent="center"
      alignItems="center"
      bg="#747474"
    >
      <Text fontFamily="RadioNewsman" fontSize="4xl" color="white">
        esti gay!
      </Text>
    </Box>
  );
};

export default ProfilePage;
