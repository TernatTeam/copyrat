import { Button, Text, View } from "native-base";
import React, { useState, useCallback, useEffect } from "react";
import { ViewBase } from "react-native";
import { GiftedChat, Bubble } from "react-native-gifted-chat";

export const ChatPage = ({ navigation }) => {
  const [messages, setMessages] = useState([
    {
      _id: 1,
      text: "Hello World",
      createdAt: new Date(),
      user: {
        _id: 2,
        name: "Dragos",
        avatar:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/WildRat.jpg/330px-WildRat.jpg",
      },
    },
  ]);

  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
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
              <Text>{messages[0].user.name}</Text>
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
          _id: 1,
        }}
      />
    </View>
  );
};

export default ChatPage;
