import React, { useState, useEffect } from 'react';

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

import { chatBubble, inputToolBar, sendButton } from '../components/chat';
import { FullPageLoader } from '../components/common/FullPageLoader';

import { useGlobal } from '../../state';

export const ChatPage = ({ navigation }) => {
  const [messages, setMessages] = useState([]);
  const [fakeId, setFakeId] = useState();
  const [userNameColor, setUserNameColor] = useState('');
  const [{ roomData }] = useGlobal();

  const getFakeIdAndUsernameColor = async () => {
    const docRef = doc(
      db,
      `games/${roomData.keyCode}/players`,
      auth.currentUser.uid,
    );
    try {
      const docSnap = await getDoc(docRef);

      setFakeId(docSnap.data().fake_id);
      setUserNameColor(docSnap.data().userNameColor);
    } catch (err) {
      console.log('ERR: ', err);
    }
  };

  const onSend = (messages = []) => {
    const { _id, createdAt, text, user } = messages[0];

    const docRef = doc(db, 'games', roomData.keyCode, 'chat', _id);
    setDoc(docRef, {
      _id,
      createdAt,
      text,
      user,
    });
  };

  useEffect(() => {
    getFakeIdAndUsernameColor();

    const q = query(
      collection(db, `games/${roomData.keyCode}/chat`),
      orderBy('createdAt', 'desc'),
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          setMessages((oldValues) => [
            {
              _id: change.doc.data()._id,
              createdAt: change.doc.data().createdAt.toDate(),
              text: change.doc.data().text,
              user: change.doc.data().user,
            },
            ...oldValues,
          ]);
        }
      });
    });

    return () => unsubscribe();
  }, []);

  // only for dev
  useEffect(() => {
    setMessages([]);
  }, []);

  return fakeId ? (
    <Box h="100%" w="100%" safeArea backgroundColor="#747474" py="4" px="4">
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

          <Box w="68%" justifyContent="center" alignItems="flex-end">
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
        timeTextStyle={{
          left: { color: 'white', marginLeft: -30 },
          right: { color: 'white' },
        }}
        placeholder="Who is the rat?"
        alwaysShowSend={true}
        renderUsernameOnMessage={true}
        messages={messages}
        onSend={(messages) => onSend(messages)}
        renderSend={sendButton}
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
  ) : (
    <FullPageLoader />
  );
};

export default ChatPage;
