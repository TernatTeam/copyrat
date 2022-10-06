import React, { useState, useCallback, useEffect } from 'react';

import { Box, Button, Center, Divider, HStack, Text } from 'native-base';

import { GiftedChat } from 'react-native-gifted-chat';

import {
  collection,
  db,
  doc,
  setDoc,
  auth,
  getDoc,
  query,
  onSnapshot,
  orderBy,
} from '../../config/firebase/firebase-key-config';

import chatBubble from '../components/chat/chatBubble';
import inputToolBar from '../components/chat/inputToolBar';

import { useGlobal } from '../../state';

export const ChatPage = ({ navigation }) => {
  const [messages, setMessages] = useState([]);
  const [fakeId, setFakeId] = useState();
  const [userNameColor, setUserNameColor] = useState('');
  const [{ roomData }] = useGlobal();

  const getFakeIdAndUsernameColor = useCallback(async () => {
    const docRef = doc(
      db,
      `games/${roomData.keyCode}/players`,
      auth.currentUser.uid,
    );
    const docSnap = await getDoc(docRef);

    setFakeId(docSnap.data().fake_id);
    setUserNameColor(docSnap.data().userNameColor);
  }, []);

  useEffect(() => {
    getFakeIdAndUsernameColor();
  }, [getFakeIdAndUsernameColor]);

  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages),
    );

    const { _id, createdAt, text, user } = messages[0];

    const docRef = doc(db, 'games', roomData.keyCode, 'chat', _id);
    setDoc(docRef, {
      _id,
      createdAt,
      text,
      user,
    });
  }, []);

  useEffect(() => {
    const q = query(
      collection(db, `games/${roomData.keyCode}/chat`),
      orderBy('createdAt', 'desc'),
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setMessages(
        querySnapshot.docs.map((doc) => ({
          _id: doc.data()._id,
          createdAt: doc.data().createdAt.toDate(),
          text: doc.data().text,
          user: doc.data().user,
        })),
      );
    });

    return () => unsubscribe();
  }, []);

  return (
    <Box w="100%" h="100%" safeArea backgroundColor="#747474" py="4" px="4">
      <Center py="2">
        <HStack justifyContent="space-between" alignItems="center" w="full">
          <Box w="30%">
            <Button
              title="Vote"
              rounded="lg"
              size="sm"
              bg="primary3.500"
              _pressed={{ bg: 'primary3.600' }}
              onPress={() => navigation.navigate('Vote')}
            >
              <Text fontWeight="semibold" color="black">
                Vote
              </Text>
            </Button>
          </Box>

          <Box w="68%" alignSelf="center">
            <Text
              isTruncated={true}
              fontWeight="bold"
              color="white"
              fontSize="xl"
            >
              Playing as <Text color={userNameColor}>{fakeId}</Text>
            </Text>
          </Box>
        </HStack>
      </Center>

      <Divider h="0.5" bgColor="white" />

      <GiftedChat
        placeholder="Who is the rat?"
        alwaysShowSend={true}
        renderUsernameOnMessage={true}
        messages={messages}
        onSend={(messages) => onSend(messages)}
        renderInputToolbar={inputToolBar}
        renderBubble={chatBubble}
        renderAvatar={null}
        user={{
          _id: auth.currentUser?.uid,
          fakeId: fakeId,
          userNameColor: userNameColor,
        }}
      />
    </Box>
  );
};

export default ChatPage;
