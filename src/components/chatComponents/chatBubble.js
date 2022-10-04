import { View, Text } from "react-native";
import { Bubble } from "react-native-gifted-chat";
import React from "react";
import { auth } from "../../../config/firebase/firebase-key-config";

const chatBubble = (props) => {
  if (
    props.currentMessage.user._id == auth.currentUser.uid ||
    props.previousMessage.user == props.currentMessage.user
  ) {
    return (
      <View
        style={{
          borderRadius: 25,
          borderTopRightRadius: 0,
          maxWidth: "80%",
        }}
      >
        <Bubble
          {...props}
          textStyle={{
            right: {
              color: "white",
              textAlign: "left",
            },
          }}
          wrapperStyle={{
            right: {
              backgroundColor: "#DE6F6F",
              borderTopRightRadius: 0,
              borderRadius: 25,
              marginRight: "10%",
            },
          }}
        />
      </View>
    );
  }
  return (
    <View
      style={{
        maxWidth: "80%",
        backgroundColor: "#DE6F6F",
        flexShrink: 1,
        borderRadius: 30,
        borderTopLeftRadius: 0,
      }}
    >
      <View marginLeft={"10%"}>
        <Text
          style={{
            color: props.currentMessage.user.userNameColor,
            fontSize: 15,
          }}
        >
          {props.currentMessage.user.fakeId}
        </Text>
      </View>

      {/* User colors: lightblue, black, antiquewhite, aqua,purple, darkmagenta, gainsboro*/}

      <Bubble
        {...props}
        textStyle={{
          left: {
            color: "white",
          },
        }}
        wrapperStyle={{
          left: {
            backgroundColor: "#DE6F6F",
            borderTopLeftRadius: 0,
            borderRadius: 25,
            marginLeft: "10%",
          },
        }}
      />
    </View>
  );
};

export default chatBubble;
