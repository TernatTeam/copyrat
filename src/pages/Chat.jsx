import React, { useState, useCallback, useEffect } from 'react';

import { Button, Text, View } from 'native-base';

import { GiftedChat } from 'react-native-gifted-chat';

import {
  collection,
  db,
  doc,
  setDoc,
  auth,
  getDoc,
  deleteDoc,
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
    <View flex={1} backgroundColor={'#747474'}>
      <View
        flexDirection={'row'}
        justifyContent={'space-around'}
        alignItems={'center'}
        marginTop={5}
      >
        <Button onPress={() => navigation.navigate('Vote')}>Vote</Button>
        <View>
          <Text style={{ fontSize: 18, color: 'white' }}>
            You are playing as {fakeId}
          </Text>
        </View>
      </View>

      <GiftedChat
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
    </View>
  );
};

export default ChatPage;
