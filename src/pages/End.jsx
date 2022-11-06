import React, { useEffect, useState } from 'react';

import { Box, Button, Text, Modal } from 'native-base';

export const EndPage = ({ navigation, route }) => {
  const [isModalOpen, setIsModalOpen] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsModalOpen(false);
    }, 3000);
  }, []);

  return (
    <Box
      safeArea
      bg="primary1.500"
      flex="1"
      alignItems={'center'}
      justifyContent="center"
      opacity="1"
    >

      <Button
        title="LockIn"
        rounded="lg"
        mb="3"
        width="20%"
        bg="primary3.500"
        _pressed={{ bg: 'primary3.600' }}
        onPress={() => {
          navigation.reset({
            routes: [{ name: 'Tabs' }],
          });
        }}
      >
        <Text fontWeight="semibold" color="black" fontSize={20}>
          Done
        </Text>
      </Button>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => {
          closeModal();
        }}
        contentLabel="Winner name"
      >
        <Text fontSize="4xl" fontFamily="RadioNewsman" color="black">
          {route.params.winner} won!
        </Text>
      </Modal>
    </Box>
  );
};

export default EndPage;
