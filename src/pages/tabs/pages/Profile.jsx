import React from 'react';

import { Box } from 'native-base';

import { ProfileCard } from '../../../components/profile';

export const ProfilePage = ({ navigation }) => {
  return (
    <Box w="100%" h="100%" alignItems="center" bg="#747474" safeArea>
      <ProfileCard navigation={navigation} />
    </Box>
  );
};

export default ProfilePage;
