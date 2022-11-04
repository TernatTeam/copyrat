import React, { useState, useEffect } from 'react';

import {
  Box,
  Center,
  Divider,
  HStack,
  Text,
  Modal,
  Icon,
  Flex,
} from 'native-base';

import { GiftedChat } from 'react-native-gifted-chat';

import {
  collection,
  doc,
  setDoc,
  getDoc,
  query,
  onSnapshot,
  orderBy,
} from 'firebase/firestore';
import { db, auth } from '../../config/firebase/firebase-key-config';

import { Ionicons } from '@expo/vector-icons';

import { chatBubble, inputToolBar, sendButton } from '../components/chat';
import { FullPageLoader } from '../components/common';

import { useGlobal } from '../../state';

export const ChatPage = ({ navigation, route }) => {
  const [messages, setMessages] = useState([]);
  const [fakeId, setFakeId] = useState();
  const [userNameColor, setUserNameColor] = useState('');
  const [{ roomData, playerInfo }] = useGlobal();
  const [isRoundModalOpen, setIsRoundModalOpen] = useState(true);
  const [isTimesUpModalOpen, setIsTimesUpModalOpen] = useState(false);
  const [roundEndTimestamp, setRoundEndTimestamp] = useState();
  const [countDown, setCountDown] = useState(0);

  const addSeconds = (date, seconds) => {
    date.setSeconds(date.getSeconds() + seconds);
    return date;
  };

  const getRoundTime = async () => {
    const docRef = doc(db, `games/${roomData.keyCode}/admin/game_settings`);

    try {
      const docSnap = await getDoc(docRef);

      const roundEndTimestamp = addSeconds(
        docSnap.data().round_start_timestamp.toDate(),
        docSnap.data().round_seconds,
      );

      setRoundEndTimestamp(new Date(roundEndTimestamp).getTime());
    } catch (err) {
      console.log(err);
    }
  };

  const getFakeIdAndUsernameColor = async () => {
    const docRef = doc(
      db,
      `games/${roomData.keyCode}/players`,
      auth.currentUser.uid,
    );

    try {
      const docSnap = await getDoc(docRef);

      setFakeId(docSnap.data().fake_id);

      for (let i = 0; i < playerInfo.nameAndColor.length; i++) {
        if (playerInfo.nameAndColor[i].name == docSnap.data().fake_id) {
          setUserNameColor(playerInfo.nameAndColor[i].userNameColor);
          break;
        }
      }
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
    setTimeout(() => {
      setIsRoundModalOpen(false);
    }, 2000);

    getRoundTime();
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

    return unsubscribe;
  }, []);

  // only for dev
  useEffect(() => {
    setMessages([]);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.floor((roundEndTimestamp - new Date().getTime()) / 1000) >= 0) {
        setCountDown(
          Math.floor((roundEndTimestamp - new Date().getTime()) / 1000),
        );
      }

      if (Math.floor((roundEndTimestamp - new Date().getTime()) / 1000) <= 0) {
        clearInterval(interval);
        setIsTimesUpModalOpen(true);

        setTimeout(() => {
          navigation.reset({
            routes: [{ name: 'Vote' }],
          });
        }, 2000);
      }
    }, 1000);
  }, [roundEndTimestamp]);

  return userNameColor ? (
    <Box
      h="100%"
      w="100%"
      safeArea
      backgroundColor="#747474"
      py="3"
      px="4"
      opacity={isRoundModalOpen || isTimesUpModalOpen ? 0.7 : 1}
    >
      <Modal isOpen={isRoundModalOpen} contentLabel="Round number">
        <Text fontSize="4xl" fontFamily="RadioNewsman" color="black">
          Round {route.params.round}
        </Text>
      </Modal>

      <Modal isOpen={isTimesUpModalOpen} contentLabel="Round number">
        <Text fontSize="4xl" fontFamily="RadioNewsman" color="black">
          Times up!
        </Text>
      </Modal>

      <Center py="2" px="1">
        <HStack justifyContent="space-between" alignItems="center" w="full">
          <Flex direction="row" w="30%">
            <Icon
              as={<Ionicons name="alarm-outline" />}
              size={6}
              color={countDown <= 30 ? 'red.500' : 'white'}
              mr="2"
            />
            <Text
              fontSize="lg"
              fontFamily="RadioNewsman"
              fontWeight="semibold"
              color={countDown <= 30 ? 'red.500' : 'black'}
            >
              {countDown}
            </Text>
          </Flex>

          <Box w="68%" justifyContent="center" alignItems="flex-end">
            <Text
              isTruncated={true}
              fontFamily="RadioNewsman"
              color="white"
              fontSize="md"
            >
              Playing as&nbsp;
              <Text color={userNameColor}>{fakeId}</Text>
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
