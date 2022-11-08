import React from 'react';

import { Box, Button, Modal, Text, KeyboardAvoidingView } from 'native-base';

export const ModalShowRats = ({
  show = false,
  onClose = () => {},
  players,
}) => {
  return (
    <Modal isOpen={show} onClose={onClose} justifyContent="center" size="md">
      <KeyboardAvoidingView behavior="position" w="full">
        <Box justifyContent="center" alignItems="center" pb="2" w="full">
          <Modal.Content borderRadius={15}>
            <Modal.Header
              bg="primary1.300"
              alignItems="center"
              justifyContent="center"
            >
              <Text
                fontFamily="RadioNewsman"
                color="white"
                textAlign="center"
                style={{ fontSize: 18, fontWeight: 'bold' }}
              >
                The rats this round were:
              </Text>
            </Modal.Header>

            <Modal.Body
              bg="primary1.300"
              alignItems="center"
              justifyContent="center"
            >
              {players.map((player, index) => {
                if (player.name != player.fake_id) {
                  return (
                    <Text
                      color={player.userNameColor}
                      fontFamily="RadioNewsman"
                      key={index}
                    >
                      {player.name}
                    </Text>
                  );
                }
              })}
            </Modal.Body>

            <Modal.Footer bg="primary1.300">
              <Button
                w="full"
                bg="primary3.300"
                _pressed={{ bg: 'primary3.400' }}
                onPress={onClose}
              >
                <Text
                  fontFamily="RadioNewsman"
                  fontWeight="semibold"
                  color="black"
                >
                  Ok
                </Text>
              </Button>
            </Modal.Footer>
          </Modal.Content>
        </Box>
      </KeyboardAvoidingView>
    </Modal>
  );
};
