import React, { useState } from 'react';

import * as yup from 'yup';

import {
  Box,
  Button,
  Center,
  Heading,
  HStack,
  Icon,
  Image,
  Input,
  Link,
  ScrollView,
  Text,
  useToast,
  VStack,
} from 'native-base';
import { TouchableWithoutFeedback, Keyboard } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { signIn } from '../../../config/firebase/firebase-functions';

import CopyratLogo from '../../../assets/logo_trans.png';

const loginSchema = yup.object({
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 charachters'),
  email: yup
    .string()
    .required('Email is required')
    .email('Must be a valid email'),
});

export const LoginPage = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [isInvalidEmail, setIsInvalidEmail] = useState(false);

  const [password, setPassword] = useState('');
  const [isInvalidPassword, setIsInvalidPassword] = useState(false);
  const [passWordHidden, setPasswordHidden] = useState(true);

  const toast = useToast();
  const id = 'error-toasts';

  const [isLoading, setIsLoading] = useState(false);

  const resetFieldsErrors = () => {
    setIsInvalidEmail(true);
    setIsInvalidPassword(true);

    setTimeout(() => {
      setIsInvalidEmail(false);
      setIsInvalidPassword(false);
    }, 2500);
  };

  const onSubmit = () => {
    loginSchema
      .isValid({
        email: email,
        password: password,
      })
      .then(async (isValid) => {
        if (isValid) {
          setIsLoading(true);

          await signIn(email, password).then((value) => {
            if (value === 200) {
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
                        Your email or password is incorect
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

    loginSchema.validate({ email: email, password: password }).catch((err) => {
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
      } else {
        setIsInvalidPassword(true);
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
              Sign in to continue!
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

              <Input
                borderBottomWidth={2}
                borderBottomColor={`${isInvalidPassword ? 'red.500' : 'black'}`}
                _focus={
                  isInvalidPassword
                    ? {
                        borderBottomColor: 'red.500',
                        placeholderTextColor: 'red.500',
                      }
                    : {
                        borderBottomColor: 'white',
                        placeholderTextColor: 'white',
                      }
                }
                type={passWordHidden ? 'password' : 'text'}
                InputRightElement={
                  <Icon
                    as={
                      <Ionicons
                        name={
                          passWordHidden ? 'eye-off-outline' : 'eye-outline'
                        }
                      />
                    }
                    size={6}
                    mr="2"
                    color={isInvalidPassword ? `red.500` : 'white'}
                    onPress={() => setPasswordHidden(!passWordHidden)}
                  />
                }
                variant="underlined"
                placeholder="Password"
                placeholderTextColor={isInvalidPassword ? `red.500` : 'black'}
                color={isInvalidPassword ? 'red.500' : 'white'}
                value={password}
                onChangeText={(value) => {
                  setIsInvalidPassword(false);
                  setPassword(value);
                }}
              />

              <Link
                _text={{
                  fontSize: 'xs',
                  fontWeight: '500',
                  color: 'white',
                }}
                onPress={() => {
                  navigation.navigate('ForgotPassword');
                }}
                alignSelf="flex-end"
                mt="1"
              >
                Forgot Password?
              </Link>

              <Button
                title="Sign in"
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
                  Sign in
                </Text>
              </Button>

              <HStack mt="1" justifyContent="center">
                <Text fontSize="sm" color="black">
                  Don't have an account ? &nbsp;
                </Text>

                <Link
                  _text={{
                    color: 'white',
                    fontWeight: 'medium',
                    fontSize: 'sm',
                  }}
                  onPress={() => {
                    navigation.navigate('Register');
                  }}
                >
                  Sign Up
                </Link>
              </HStack>
            </VStack>
          </Box>
        </ScrollView>
      </Center>
    </TouchableWithoutFeedback>
  );
};

export default LoginPage;
