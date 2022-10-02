import { Button, Text, View } from "native-base";
import React, { useState, useCallback, useLayoutEffect } from "react";
import { ViewBase } from "react-native";
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import {
  collection,
  db,
  doc,
  setDoc,
} from "../../config/firebase/firebase-key-config";
import { query, onSnapshot, orderBy } from "firebase/firestore";

export const ChatPage = ({ navigation }) => {
  const [messages, setMessages] = useState([
    // {
    //   _id: 2,
    //   text: "Salutare",
    //   createdAt: new Date(),
    //   user: {
    //     _id: 2,
    //     name: "Costi",
    //     avatar:
    //       "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/WildRat.jpg/330px-WildRat.jpg",
    //   },
    // },
    // {
    //   _id: 1,
    //   text: "Hello World",
    //   createdAt: new Date(),
    //   user: {
    //     _id: 2,
    //     name: "Dragos",
    //     avatar:
    //       "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/WildRat.jpg/330px-WildRat.jpg",
    //   },
    // },
  ]);

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
    // const unsubscribe = db
    //   .collection("chats")
    //   .orderBy("createdAt", "desc")
    //   .onSnapshot((snapshot) =>
    //     setMessages(
    //       snapshot.docs.map((doc) => ({
    //         _id: doc.data()._id,
    //         createdAt: doc.data().createdAt.toDate(),
    //         text: doc.data().text,
    //         user: doc.data().user,
    //       }))
    //     )
    //   );

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
              <Text>{props.currentMessage.user.name}</Text>
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
      />
    </View>
  );
};

export default ChatPage;
