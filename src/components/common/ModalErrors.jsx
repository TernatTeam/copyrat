import React from 'react';
import { Button, Modal, Text } from 'native-base';

export const ModalErrors = ({
  show = false,
  onClose = () => {},
  errorType,
}) => {
  return (
    <Modal isOpen={show} size="xl">
      <Modal.Content borderRadius={15} maxWidth="350">
        <Modal.Header
          bg="primary1.500"
          alignItems="center"
          justifyContent="center"
        >
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
            Ups an error has occurred!
          </Text>
        </Modal.Header>
        <Modal.Body
          bg="primary1.500"
          alignItems="center"
          justifyContent="center"
        >
          {errorType === 'login' ? (
            <>
              <Text fontSize={15}>Your email or password is incorect</Text>

              <Text fontSize={15}>Please try again</Text>
            </>
          ) : errorType === 'register' ? (
            <Text textAlign="center" fontSize={15}>
              The email address is already in use by another account
            </Text>
          ) : errorType === 'forgotPassword' ? (
            <Text textAlign="center" fontSize={15}>
              Sorry, we were unable to find an email address that matched your
              search.
            </Text>
          ) : null}
        </Modal.Body>
        <Modal.Footer bg="primary1.600">
          <Button
            borderRadius={15}
            bg="primary3.500"
            _pressed={{ bg: 'primary3.600' }}
            flex={1}
            onPress={() => {
              onClose();
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};

export default ModalErrors;
