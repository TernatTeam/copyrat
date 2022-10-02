import { View, Text } from "react-native";
import { Button, Flex } from "native-base";
import React from "react";

export const HomePage = ({ navigation }) => {
  return (
    <View style={{ alignItems: "center", justifyContent: "center", flex: 1, backgroundColor: "#747474" }}>
      <Text>Home Page</Text>
      <Button onPress={() => navigation.navigate("Lobby")}>Lobby</Button>
    </View>
  );
};

export default HomePage;
