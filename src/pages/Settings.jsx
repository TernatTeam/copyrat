import React, { useEffect, useState } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { Box, IconButton, Icon, Text, Stack, Flex, Button } from 'native-base';

import { Ionicons } from '@expo/vector-icons';

const textSizeButtons = [
  { label: 'small', value: 'sm' },
  { label: 'medium', value: 'md' },
  { label: 'large', value: 'lg' },
];

export const SettingsPage = ({ navigation }) => {
  const [selectedSize, setSelectedSize] = useState('md');

  const today = new Date();
  const time = today.getHours() + ':' + today.getMinutes();
  const hours = today.getHours();
  const ampm = hours >= 12 ? 'PM' : 'AM';

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('settings');
      setSelectedSize(
        jsonValue != null ? JSON.parse(jsonValue).textSizeChat : null,
      );
    } catch (err) {
      console.log('Err: ', err);
    }
  };

  const setData = async (textSizeButton) => {
    setSelectedSize(textSizeButton.value);
    const applicationSettings = JSON.stringify({
      textSizeChat: textSizeButton.value,
    });

    try {
      await AsyncStorage.setItem('settings', applicationSettings);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <Box w="100%" h="100%" bg="primary1.300" safeArea>
      <Box
        px="1"
        pt="1"
        w="full"
        justifyContent="center"
        alignItems="flex-start"
      >
        <IconButton
          icon={<Icon as={<Ionicons name="close-outline" />} />}
          borderRadius="full"
          _icon={{
            color: 'primary3.300',
            size: '8',
          }}
          _pressed={{
            bg: 'primary3.400',
          }}
          onPress={() => {
            navigation.navigate('Profile');
          }}
        />
      </Box>

      <Stack w="full" px="4" pt="4">
        <Box w="full" rounded="xl" bg="primary1.400">
          <Stack space={4} p="4">
            <Flex justifyContent="center" alignItems="center" direction="row">
              <Icon
                as={<Ionicons name="chatbox-ellipses-outline" />}
                color="white"
                mr="2"
                size="xl"
              />
              <Text fontSize="xl" color="white" fontFamily="RadioNewsman">
                Chat settings
              </Text>
            </Flex>

            <Box px="2">
              <Text fontFamily="RadioNewsman" color="black" fontSize="md">
                Text size:
              </Text>

              <Box w="full" justifyContent="center" alignItems="center" h="24">
                <Box
                  maxWidth="80%"
                  backgroundColor="#a4a4a4"
                  borderRadius="xl"
                  borderTopRightRadius="0"
                  pl="3"
                  pr="6"
                  py="1"
                >
                  <Text
                    fontWeight="bold"
                    fontSize={selectedSize}
                    color="white"
                    mb="1"
                  >
                    copyrat
                  </Text>

                  <Text textAlign="right" color="white" fontSize="xs">
                    {time} {ampm}
                  </Text>
                </Box>
              </Box>

              <Flex
                direction="row"
                w="full"
                justifyContent="space-between"
                alignItems="center"
              >
                {textSizeButtons.map((textSizeButton, index) => {
                  return (
                    <Button
                      title={textSizeButton.label}
                      key={index}
                      borderWidth={
                        selectedSize === textSizeButton.value ? '3' : '3'
                      }
                      borderColor={
                        selectedSize === textSizeButton.value
                          ? 'black'
                          : 'primary3.225'
                      }
                      px="4"
                      bg="primary3.300"
                      _pressed={{ bg: 'primary3.400' }}
                      onPress={() => {
                        setData(textSizeButton);
                      }}
                    >
                      <Text fontFamily="RadioNewsman">
                        {textSizeButton.label}
                      </Text>
                    </Button>
                  );
                })}
              </Flex>
            </Box>

            {/* <Box px="2">
              <Text fontFamily="RadioNewsman" color="black" fontSize="md">
                Sound:
              </Text>
            </Box> */}
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

export default SettingsPage;
