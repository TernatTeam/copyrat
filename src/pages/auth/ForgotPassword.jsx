import React, { useState } from 'react';

import * as yup from 'yup';

import {
  Box,
  Button,
  Center,
  Heading,
  Image,
  Text,
  ScrollView,
  useToast,
  VStack,
} from 'native-base';
import { TouchableWithoutFeedback, Keyboard } from 'react-native';

import { forgotPass } from '../../../config/firebase/firebase-functions';

import CopyratLogo from '../../../assets/logo_trans.png';
import { UnderlinedInput } from '../../components/interface';

const forgotPasswordSchema = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .email('Must be a valid email'),
});

export const ForgotPasswordPage = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [isInvalidEmail, setIsInvalidEmail] = useState(false);

  const toast = useToast();
  const id = 'error-toasts';

  const [isLoading, setIsLoading] = useState(false);

  const emailFound = () => {
    if (!toast.isActive(id)) {
      toast.show({
        id,
        duration: 900,
        placement: 'top',
        render: () => {
          return (
            <Box bg="green.500" px="2" py="1" rounded="sm" mb={5}>
              Check your email
            </Box>
          );
        },
      });
    }

    setTimeout(() => {
      navigation.reset({
        routes: [{ name: 'Login' }],
      });
    }, 1000);
  };

  const resetFieldsErrors = () => {
    setIsInvalidEmail(true);

    setTimeout(() => {
      setIsInvalidEmail(false);
    }, 2500);
  };

  const onSubmit = () => {
    forgotPasswordSchema
      .isValid({
        email: email,
      })
      .then(async (isValid) => {
        if (isValid) {
          setIsLoading(true);

          await forgotPass(email).then((value) => {
            if (value === 200) {
              emailFound();

              return;
            } else if (value === 500) {
              if (!toast.isActive(id)) {
                toast.show({
                  id,
                  duration: 2500,
                  placement: 'top',
                  render: () => {
                    return (
                      <Text
                        bg="primary4.300"
                        px="2"
                        py="1"
                        fontFamily="RadioNewsman"
                        rounded="sm"
                      >
                        Email not found
                      </Text>
                    );
                  },
                });
              }

              resetFieldsErrors();
              setIsLoading(false);
            }
          });
        }
      });

    forgotPasswordSchema.validate({ email: email }).catch((err) => {
      if (!toast.isActive(id)) {
        toast.show({
          id,
          duration: 2500,
          placement: 'top',
          render: () => {
            return (
              <Text
                bg="primary4.300"
                px="2"
                py="1"
                fontFamily="RadioNewsman"
                rounded="sm"
              >
                {err.message}
              </Text>
            );
          },
        });
      }

      if (err.path === 'email') {
        setIsInvalidEmail(true);
      }
    });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Center bg="primary1.300" h="100%" w="100%">
        <ScrollView w="full" h="full" px="12">
          <Box safeArea pt="16" pb="2">
            <Center w="full" mb="4">
              <Image size="xl" alt="Copy Rat Logo" source={CopyratLogo} />
            </Center>

            <Text fontSize="lg" fontFamily="RadioNewsman" color="black">
              Welcome
            </Text>

            <Text mt="1" fontSize="sm" fontFamily="RadioNewsman" color="black">
              Enter your email to continue!
            </Text>

            <VStack space={4} mt="4">
              <UnderlinedInput
                inputColor="primary3.300"
                iconColor="primary3.300"
                focusInputColor="primary3.500"
                focusIconColor="primary3.500"
                fontFamily="RadioNewsman"
                placeholder="Email"
                icon="mail-outline"
                isInvalid={isInvalidEmail}
                value={email}
                onChangeText={(value) => {
                  setIsInvalidEmail(false);
                  setEmail(value);
                }}
              />

              <Button
                title="Send"
                rounded="lg"
                medium
                bg="primary3.300"
                _pressed={{ bg: 'primary3.400' }}
                onPress={onSubmit}
                disabled={isLoading}
                isLoading={isLoading}
                //the size didnt match so i had to do this..
                _spinner={{ paddingY: '0.45' }}
              >
                <Text fontFamily="RadioNewsman" color="black">
                  Send
                </Text>
              </Button>
            </VStack>
          </Box>
        </ScrollView>
      </Center>
    </TouchableWithoutFeedback>
  );
};

export default ForgotPasswordPage;
