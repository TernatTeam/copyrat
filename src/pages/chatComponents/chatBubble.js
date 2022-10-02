import { View, Text } from "react-native";
import { Bubble } from "react-native-gifted-chat";
import React from "react";

const chatBubble = (props) => {
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
            color: "white",
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
};

export default chatBubble;
