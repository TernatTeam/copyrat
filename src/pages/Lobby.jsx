import { View, Text } from "react-native";
import React from "react";
import { Button } from "native-base";

export const LobbyPage = ({ navigation }) => {
  return (
    <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
      <Text>Lobby Page</Text>
      <Button onPress={() => navigation.navigate("Chat")}>Start</Button>
    </View>
  );
};

export default LobbyPage;
