import React, { useEffect, useState } from 'react';

import * as yup from 'yup';

import {
  Box,
  Button,
  Center,
  Heading,
  Icon,
  Image,
  Input,
  Text,
  ScrollView,
  useToast,
  VStack,
} from 'native-base';
import { TouchableWithoutFeedback, Keyboard } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { forgotPass } from '../../../config/firebase/firebase-functions';

import CopyratLogo from '../../../assets/logo_trans.png';

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
                      <Box bg="red.500" px="2" py="1" rounded="sm" mb={5}>
                        Email not found
                      </Box>
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
              <Box bg="red.500" px="2" py="1" rounded="sm" mb={5}>
                {err.message}
              </Box>
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
      <Center bg="primary1.500" h="100%" w="100%">
        <ScrollView w="full" h="full" px="16">
          <Box safeArea pt="16" pb="2">
            <Center w="full" mb="4">
              <Image
                alt="Copy Rat Logo"
                source={CopyratLogo}
                style={{ width: 150, height: 150 }}
              />
            </Center>

            <Heading size="lg" fontWeight="600" color="black">
              Welcome
            </Heading>

            <Heading mt="1" size="xs" fontWeight="semibold" color="black">
              Reset your password to continue!
            </Heading>

            <VStack space={4} mt="4">
              <Input
                borderBottomWidth={2}
                borderBottomColor={`${isInvalidEmail ? 'red.500' : 'black'}`}
                _focus={
                  isInvalidEmail
                    ? {
                        borderBottomColor: 'red.500',
                        placeholderTextColor: 'red.500',
                      }
                    : {
                        borderBottomColor: 'white',
                        placeholderTextColor: 'white',
                      }
                }
                InputRightElement={
                  <Icon
                    as={<Ionicons name="mail-outline" />}
                    size={6}
                    mr="2"
                    color={isInvalidEmail ? `red.500` : 'white'}
                  />
                }
                variant="underlined"
                placeholder="Email"
                placeholderTextColor={isInvalidEmail ? `red.500` : 'black'}
                color={isInvalidEmail ? 'red.500' : 'white'}
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
                bg="primary3.500"
                _pressed={{ bg: 'primary3.600' }}
                onPress={onSubmit}
                disabled={isLoading}
                isLoading={isLoading}
                //the size didnt match so i had to do this..
                _spinner={{ paddingY: '0.45' }}
              >
                <Text fontWeight="semibold" color="black">
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
