import React, { useState } from 'react';

import { Button, Icon, Input, Modal, Text } from 'native-base';

import { Ionicons } from '@expo/vector-icons';

export const ModalKeyCode = ({ show = false, onClose = () => {} }) => {
  const [keyCode, setKeyCode] = useState('');

  return (
    <Modal isOpen={show} size="xl" px="6">
      <Modal.Content borderRadius={15}>
        <Modal.Header
          bg="primary1.500"
          alignItems="center"
          justifyContent="center"
        >
          <Text color="white" style={{ fontSize: 18, fontWeight: 'bold' }}>
            Set your in game name
          </Text>
        </Modal.Header>

        <Modal.Body
          bg="primary1.500"
          alignItems="center"
          justifyContent="center"
        >
          <Input
            borderBottomWidth={2}
            borderBottomColor="black"
            _focus={{
              borderBottomColor: 'white',
              placeholderTextColor: 'white',
            }}
            InputRightElement={
              <Icon
                as={<Ionicons name="key-outline" />}
                size={6}
                mr="2"
                color="white"
              />
            }
            variant="underlined"
            placeholder="Room Key"
            placeholderTextColor="black"
            color="white"
            value={keyCode}
            onChangeText={(value) => {
              setKeyCode(value);
            }}
          />
        </Modal.Body>

        <Modal.Footer bg="primary1.500">
          <Button
            p="0"
            bg="primary1.500"
            _pressed={{ bg: 'primary1.500' }}
            flex={1}
            onPress={() => {
              if (keyCode) {
                onClose(keyCode);
              }
            }}
          >
            Done
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};

export default ModalKeyCode;
