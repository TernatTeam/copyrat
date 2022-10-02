import React, { useState, useEffect } from "react";

import { Center, Button, View, Box } from "native-base";
import { auth } from "../../../config/firebase/firebase-key-config";
import { signIn } from "../../../config/firebase/firebase-functions";
import { Text } from "react-native";
import { TouchableWithoutFeedback, StyleSheet } from "react-native";
import { Keyboard } from "react-native";
import { TextInput, Image } from "react-native";
import { Alert } from "react-native";

export const LoginPage = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <Center style={{ flex: 1, backgroundColor: "#747474" }}>
      <Image source={require('../../../assets/logo_trans.png')} style = {{width:200, height: 200}} />
      {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss}> */}
      <>
        <Text style={{ fontSize: 30, fontWeight: 'bold' }}>Sign In</Text>

        <Box style={styles.input}>
          <TextInput
            placeholder="Email"
            autoCompleteType={null}
            fontSize={15}
            onChangeText={(mail) => {
              setEmail(mail);
            }}
          />
        </Box>
        <Box style={styles.input}>
          <TextInput
            placeholder="Password"
            autoCompleteType={null}
            secureTextEntry={true}
            fontSize={15}
            onChangeText={(pass) => {
              setPassword(pass);
            }}
          />
        </Box>

        <Button
          onPress={() =>
            signIn(email, password).then((value) => {
              if (value == 200) {
                navigation.navigate("Home");
              }
            })
          }
        >
          Sign In
        </Button>
        <Button
          onPress={() => {
            
                navigation.navigate("Register");
              
            }
          }
        >
          Register
        </Button>
      </>
      {/* </TouchableWithoutFeedback> */}
    </Center>
  );
};

export default LoginPage;

const styles = StyleSheet.create({
  input: {
    padding: 10,
    margin: 4,
    width: "75%",
    fontSize: 15,
    backgroundColor: "#74859a",
    borderRadius: 10,
    margin: 5,
  },
});
