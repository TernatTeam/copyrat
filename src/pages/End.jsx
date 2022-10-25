import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Button,
  Text,
  Flex,
  ScrollView,
  useToast,
} from 'native-base';

export const EndPage = ({ navigation, route }) => {
  return (
    <Box safeArea bg="primary1.500" flex="1" alignItems={"center"} justifyContent="center">
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
    
        <Button // winner
          title="winner"
          rounded="lg"
          mb="3"
          width="20%"
          bg="primary3.500"
          _pressed={{ bg: 'primary3.600' }}
          onPress={() => {
            const { winner } = route.params;
            console.log(winner);
            }
          }
          
        >
          <Text fontWeight="semibold" color="black" fontSize={20}>
            get winner
          </Text>
        </Button>
    </Box>
  );

};

export default EndPage;
