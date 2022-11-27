import React from 'react';

import { Stack } from 'native-base';

import { ProfileCard, GameHistory } from '../../../components/profile';

export const ProfilePage = ({ navigation }) => {
  return (
    <Stack
      w="100%"
      h="100%"
      alignItems="center"
      bg="primary1.300"
      safeArea
      px="2"
      space="4"
    >
      <ProfileCard navigation={navigation} />
      <GameHistory />
    </Stack>
  );
};

export default ProfilePage;
