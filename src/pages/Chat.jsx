import React, { useState, useEffect } from 'react';

import { Box, Button, Center, Divider, HStack, Text, Modal } from 'native-base';

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
  updateDoc,
} from '../../config/firebase/firebase-key-config';

import { chatBubble, inputToolBar, sendButton } from '../components/chat';
import { FullPageLoader } from '../components/common/FullPageLoader';

import { useGlobal } from '../../state';

export const ChatPage = ({ navigation, route }) => {
  const [messages, setMessages] = useState([]);
  const [fakeId, setFakeId] = useState();
  const [userNameColor, setUserNameColor] = useState('');
  const [{ roomData, playerInfo }] = useGlobal();
  const [modalOpen, setModalOpen] = useState(false);
  const [blurr, setBlurr] = useState(1);
  const [countdown, setCountdown] = useState(15);

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
    const q = query(collection(db, `games`, roomData.keyCode, 'admin'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'modified') {
          navigation.reset({
            routes: [{ name: 'Vote' }],
          });
        }
      });
    });

    return async () => {
      unsubscribe();
    };
  }, []);

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

  useEffect(() => {
    setModalOpen(true);
    setBlurr(0.7);

    setTimeout(() => {
      setModalOpen(false);
      setBlurr(1);
    }, 2000);
  }, []);

  useEffect(() => {
    if(auth.currentUser.uid == roomData.game_admin_uid) {
      setTimeout(async () => {
        await updateDoc(
          doc(db, 'games', roomData.keyCode, 'admin', 'gameState'),
          {
            navToScore: true,
          },
        );
      }, countdown * 1000); 
    }
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (countdown >= 0) {
        setCountdown(countdown - 1);
      }
    }, 1000);
  }, [countdown]);

  return userNameColor ? (
    <Box h="100%" w="100%" safeArea backgroundColor="#747474" py="3" px="4" opacity={blurr}>
      <Center py="2">
        <HStack justifyContent="space-between" alignItems="center" w="full">
          <Box w="30%">
            <Button
              title="Vote"
              rounded="lg"
              size="sm"
              bg="primary3.500"
              _pressed={{ bg: 'primary3.600' }}
              onPress={async() => {
                if(auth.currentUser.uid == roomData.game_admin_uid) {
                  await updateDoc(
                    doc(db, 'games', roomData.keyCode, 'admin', 'gameState'),
                    {
                      navToScore: true,
                    },
                  );
                }
              }}
            >
              <Text fontWeight="semibold" color="black">
                {countdown > 0 ? countdown : "Vote"}
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

      <Modal
        isOpen={modalOpen}
        contentLabel="Round number"
      >
        <Text fontSize="4xl" fontFamily="RadioNewsman" color="black">
          {"Round " + route.params.round}
        </Text>
      </Modal>
    </Box>
  ) : (
    <FullPageLoader />
  );
};

export default ChatPage;
