import React, { useState } from "react";

import { Center, Button, View, Box } from "native-base";
import { registration } from "../../../config/firebase/firebase-functions";
import { Text } from "react-native";
import { TouchableWithoutFeedback, StyleSheet } from "react-native";
import { Keyboard } from "react-native";
import { TextInput } from "react-native";

export const RegisterPage = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  return (
    <Center style={{ flex: 1 }}>
      {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss}> */}
      <>
        <Text style={{ fontSize: 20 }}>Create Your Account</Text>

        <Box style={styles.input}>
          <TextInput
            placeholder="Username"
            autoCompleteType={null}
            fontSize={15}
            onChangeText={(name) => {
              setName(name);
            }}
          />
        </Box>
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

        <Button onPress={() => registration(name, email, password)}>
          Register
        </Button>
      </>
      {/* </TouchableWithoutFeedback> */}
    </Center>
  );
};

export default RegisterPage;

const styles = StyleSheet.create({
  input: {
    padding: 10,
    margin: 4,
    width: "75%",
    fontSize: 15,
    backgroundColor: "chocolate",
    borderRadius: 10,
    margin: 5,
  },
});
