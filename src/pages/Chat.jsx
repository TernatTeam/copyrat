import { Button, Center, Text, View } from "native-base";
import React, {
  useState,
  useCallback,
  useLayoutEffect,
  useEffect,
} from "react";
import { TouchableOpacity, ViewBase } from "react-native";
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";
import {
  collection,
  db,
  doc,
  setDoc,
  auth,
  getDoc,
} from "../../config/firebase/firebase-key-config";
import { query, onSnapshot, orderBy } from "firebase/firestore";
import chatBubble from "./chatComponents/chatBubble";
import inputToolBar from "./chatComponents/inputToolBar";
import { useGlobal } from "../../state";

export const ChatPage = ({ navigation }) => {
  const [messages, setMessages] = useState([]);
  const [fakeId, setFakeId] = useState();
  const [{ keycode }] = useGlobal();

  useLayoutEffect(() => {
    const getFakeId = async () => {
      const docRef = doc(db, "games", keycode.value, "players", auth.currentUser.uid);
      const docSnap = await getDoc(docRef);

      setFakeId(docSnap.data().fake_id);
    };
    return getFakeId;
  });

  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );

    const { _id, createdAt, text, user } = messages[0];

    const docRef = doc(db, "games", keycode.value, "chat", _id);
    setDoc(
      docRef,
      {
        _id,
        createdAt,
        text,
        user,
      },
      { merge: true }
    );
  }, []);

  useLayoutEffect(() => {
    const q = query(
      collection(db, `games/${keycode.value}/chat`),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setMessages(
        querySnapshot.docs.map((doc) => ({
          _id: doc.data()._id,
          createdAt: doc.data().createdAt.toDate(),
          text: doc.data().text,
          user: doc.data().user,
        }))
      );
    });
    return unsubscribe;
  }, []);

  return (
    <View flex={1} backgroundColor={"#747474"}>
      <View flexDirection={"row"} justifyContent={"space-around"}>
        <Button onPress={() => navigation.navigate("Vote")}>Vote</Button>
        <Button onPress={() => navigation.navigate("Lobby")}>Exit</Button>
      </View>
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        renderInputToolbar={inputToolBar}
        renderBubble={chatBubble}
        user={{
          _id: auth.currentUser?.uid,
          fakeId: fakeId,
        }}
      />
    </View>
  );
};

export default ChatPage;
