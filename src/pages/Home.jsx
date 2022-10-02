import { View, Text, Image } from "react-native";
import { Button, Flex } from "native-base";
import React from "react";


export const HomePage = ({ navigation }) => {
  return (
    <View style={{ alignItems: "center", justifyContent: "center", flex: 1, backgroundColor: "#747474" }}>
      <Image source={require('../../assets/logo_trans.png')} style = {{width:300, height: 300}} />
      <Text style={{fontSize: 60, fontWeight: "bold"}} 
      >copyrat</Text>
      <Button style={{padding: 10, width: 120, height: 50, backgroundColor: '#74859a', borderRadius: 10, borderWidth: 2, borderColor: '#000000', margin: 100}}
      onPress={() => navigation.navigate("Lobby")}>Lobby</Button>
    </View>
  );
};

export default HomePage;
