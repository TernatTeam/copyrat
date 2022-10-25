import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Button,
  Text,
  Flex,
  ScrollView,
  useToast,
  Modal,
} from 'native-base';

export const EndPage = ({ navigation, route }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [blurr, setBlurr] = useState(1);

  useEffect(() => {
    setModalOpen(true);
    setBlurr(0.1);

    setTimeout(() => {
      setModalOpen(false);
      setBlurr(1);
    }, 3000);
  }, []);

  return (
    <Box safeArea bg="primary1.500" flex="1" alignItems={"center"} justifyContent="center" opacity={blurr}>
      <Text fontSize="4xl" fontFamily="RadioNewsman" color="black" >
          copyrat
        </Text>
      
        <Button // confirm vote
          title="LockIn"
          rounded="lg"
          mb="3"
          width="20%"
          bg="primary3.500"
          _pressed={{ bg: 'primary3.600' }}
          onPress={() => {
            navigation.reset({
              routes: [{ name: "Home" }],
            });
          }}
          
        >
          <Text fontWeight="semibold" color="black" fontSize={20}>
            Done
          </Text>
        </Button>

        <Modal
          isOpen={modalOpen}
          onRequestClose={() => {
            closeModal();
          }}
          //style={customStyles}
          //bg="coolGray.400"
          contentLabel="Winner name"
        >
          <Text fontSize="4xl" fontFamily="RadioNewsman" color="black">
            {route.params.winner + " won!"}
          </Text>
        </Modal>
    </Box>
  );

};

export default EndPage;
