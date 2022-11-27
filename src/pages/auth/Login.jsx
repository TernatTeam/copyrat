import React, { useEffect, useRef, useState } from 'react';

import * as yup from 'yup';

import {
  Box,
  Button,
  Center,
  HStack,
  Image,
  Link,
  ScrollView,
  Text,
  useToast,
  VStack,
} from 'native-base';
import { TouchableWithoutFeedback, Keyboard } from 'react-native';

import { signIn } from '../../../config/firebase/firebase-functions';

import CopyratLogo from '../../../assets/logo_trans.png';
import { UnderlinedInput } from '../../components/interface';
import { useKeyboard } from '../../hooks';

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
  const scroll = useRef();
  const keyboardStatus = useKeyboard();

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
                      <Text
                        bg="primary4.300"
                        px="2"
                        py="1"
                        fontFamily="RadioNewsman"
                        rounded="sm"
                      >
                        Your email or password is incorrect
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

    loginSchema.validate({ email: email, password: password }).catch((err) => {
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
      } else {
        setIsInvalidPassword(true);
      }
    });
  };

  useEffect(() => {
    if (keyboardStatus) {
      scroll.current.scrollTo({ y: 100, animated: true });
    }
  }, [keyboardStatus]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Center bg="primary1.300" h="100%" w="100%">
        <ScrollView w="full" h="full" px="12" ref={scroll}>
          <Box safeArea pt="16" pb="2">
            <Center w="full" mb="4">
              <Image size="xl" alt="Copy Rat Logo" source={CopyratLogo} />
            </Center>

            <Text fontSize="lg" fontFamily="RadioNewsman" color="black">
              Welcome
            </Text>

            <Text mt="1" fontSize="sm" fontFamily="RadioNewsman" color="black">
              Sign in to continue!
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

              <UnderlinedInput
                inputColor="primary3.300"
                iconColor="primary3.300"
                focusInputColor="primary3.500"
                focusIconColor="primary3.500"
                fontFamily="RadioNewsman"
                placeholder="Password"
                icon={passWordHidden ? 'eye-outline' : 'eye-off-outline'}
                type={passWordHidden ? 'password' : 'text'}
                isInvalid={isInvalidPassword}
                iconClickedCallback={() => {
                  setPasswordHidden(!passWordHidden);
                }}
                isIconClickable={true}
                value={password}
                onChangeText={(value) => {
                  setIsInvalidPassword(false);
                  setPassword(value);
                }}
              />

              <Link
                _text={{
                  fontSize: 11,
                  color: 'white',
                  fontFamily: 'RadioNewsman',
                }}
                onPress={() => {
                  navigation.navigate('ForgotPassword');
                }}
                alignSelf="flex-end"
                mt="1"
              >
                Forgot password?
              </Link>

              <Button
                title="Sign in"
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
                  Sign in
                </Text>
              </Button>

              <HStack mt="1" justifyContent="flex-end">
                <Text fontFamily="RadioNewsman" fontSize={11} color="black">
                  Don't have an account ? &nbsp;
                </Text>

                <Link
                  _text={{
                    color: 'white',
                    fontFamily: 'RadioNewsman',
                    fontSize: 11,
                  }}
                  onPress={() => {
                    navigation.navigate('Register');
                  }}
                >
                  Sign up
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
