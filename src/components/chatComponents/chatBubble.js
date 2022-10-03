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
    <View style={{ maxWidth: "70%" }}>
      <View>
        <Text style={{ color: "rosybrown", fontSize: 15 }}>
          {props.currentMessage.user.fakeId}
        </Text>
      </View>

      <Bubble
        {...props}
        textStyle={{
          left: {
            color: "white",
          },
        }}
        wrapperStyle={{
          left: {
            backgroundColor: "rosybrown",
            borderTopLeftRadius: 0,
            borderRadius: 25,
          },
        }}
      />
    </View>
  );
};

export default chatBubble;
