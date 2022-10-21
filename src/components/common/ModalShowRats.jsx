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
              bg="primary1.500"
              alignItems="center"
              justifyContent="center"
            >
              <Text color="white" style={{ fontSize: 18, fontWeight: 'bold' }}>
                The rats this round were:
              </Text>
            </Modal.Header>

            <Modal.Body
              bg="primary1.500"
              alignItems="center"
              justifyContent="center"
            >
              {players.map((player, index) => {
                if (player.name != player.fake_id) {
                  return (
                    <Text color="white" fontWeight="semibold" key={index}>
                      {player.name}
                    </Text>
                  );
                }
              })}
            </Modal.Body>

            <Modal.Footer bg="primary1.500">
              <Button
                w="full"
                bg="primary3.500"
                _pressed={{ bg: 'primary3.600' }}
                onPress={onClose}
              >
                <Text fontWeight="semibold" color="black">
                  Muie Dragos
                </Text>
              </Button>
            </Modal.Footer>
          </Modal.Content>
        </Box>
      </KeyboardAvoidingView>
    </Modal>
  );
};
