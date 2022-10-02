import { Button, Text, View } from "native-base";
import React, {
  useState,
  useCallback,
  useLayoutEffect,
  useEffect,
} from "react";
import { ViewBase } from "react-native";
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import {
  collection,
  db,
  doc,
  setDoc,
  auth,
  getDoc,
} from "../../config/firebase/firebase-key-config";
import { query, onSnapshot, orderBy } from "firebase/firestore";
import { async } from "@firebase/util";

export const ChatPage = ({ navigation }) => {
  const [messages, setMessages] = useState([]);
  const [fakeId, setFakeId] = useState();

  useLayoutEffect(() => {
    const getFakeId = async () => {
      const docRef = doc(db, "games", "abcd", "players", auth.currentUser.uid);
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

    const docRef = doc(db, "games", "abcd", "chat", _id);
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
      collection(db, "games/abcd/chat"),
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
    <View flex={1}>
      <View flexDirection={"row"} justifyContent={"space-around"}>
        <Button onPress={() => navigation.navigate("Vote")}>Vote</Button>
        <Button onPress={() => navigation.navigate("Lobby")}>Exit</Button>
      </View>
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        renderBubble={(props) => {
          return (
            <View>
              <Text>{props.currentMessage.user.fakeId}</Text>
              <Bubble
                {...props}
                textStyle={{
                  right: {
                    color: "white",
                  },
                  left: {
                    color: "black",
                  },
                }}
                wrapperStyle={{
                  left: {
                    backgroundColor: "chocolate",
                  },
                  right: {
                    backgroundColor: "#3A13C3",
                  },
                }}
              />
            </View>
          );
        }}
        user={{
          _id: auth.currentUser?.uid,
          fakeId: fakeId,
        }}
      />
    </View>
  );
};

export default ChatPage;
