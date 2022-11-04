import React from 'react';

import { Box } from 'native-base';
import { ProfileCard } from '../../../components/profile';

export const ProfilePage = () => {
  return (
    <Box
      w="100%"
      h="100%"
      justifyContent="center"
      alignItems="center"
      bg="#747474"
      safeArea
    >
      <ProfileCard />
    </Box>
  );
};

export default ProfilePage;
