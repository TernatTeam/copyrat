import React from "react";
import { InputToolbar } from "react-native-gifted-chat";

const inputToolBar = (props) => {
  return (
    <InputToolbar
      {...props}
      containerStyle={{
        backgroundColor: "darkgray",
        borderRadius: 30,
        alignItems: "flex-end",
        flex: 1,
        margin: 5,
      }}
      textInputStyle={{ color: "white" }}
      placeHolderColor={"white"}
    />
  );
};

export default inputToolBar;
