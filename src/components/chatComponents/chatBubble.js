import { View, Text } from "react-native";
import { Bubble } from "react-native-gifted-chat";
import React from "react";
import { auth } from "../../../config/firebase/firebase-key-config";

const chatBubble = (props) => {
  if (props.currentMessage.user._id == auth.currentUser.uid) {
    return (
      <View justifyContent="center">
        <Bubble
          {...props}
          textStyle={{
            right: {
              color: "white",
            },
          }}
          wrapperStyle={{
            right: {
              backgroundColor: "#DE6F6F",
              borderTopRightRadius: 0,
              borderRadius: 25,
            },
          }}
        />
      </View>
    );
  }
  return (
    <View
      style={{
        maxWidth: "70%",
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
