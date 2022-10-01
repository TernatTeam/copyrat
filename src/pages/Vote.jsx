import { View, Text } from "react-native";
import React from "react";
import { Button } from "native-base";

export const VotePage = ({ navigation }) => {
  return (
    <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
      <Text>Vote Page</Text>
      <Button onPress={() => navigation.navigate("Chat")}>NextRound</Button>
    </View>
  );
};

export default VotePage;
