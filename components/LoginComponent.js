import { useState } from "react";
import { StyleSheet, View, TextInput, Button, Text } from "react-native";
import client from "../client";
import SignUpComponent from "./SignUpComponent";

export default function LoginComponent({ setCurrentUser, setCurrentToken }) {
  const [username, setUsername] = useState("raller");
  const [password, setPassword] = useState("Pass1234!");
  const [signUp, setSignUp] = useState(false);

  function submitLogin(e) {
    client
      .post("/login", {
        username: username,
        password: password,
      })
      .then(function (response) {
        let token = response.data.token;
        let user = response.data.user;
        setCurrentToken(token);
        setCurrentUser(user);
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  if (signUp) {
    return <SignUpComponent setSignUp={setSignUp} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          onChangeText={setUsername}
          value={username}
        />
        <TextInput
          style={styles.input}
          onChangeText={setPassword}
          value={password}
          secureTextEntry={true}
        />
        <Button onPress={submitLogin} title="Log in" />
      </View>
      <View style={styles.footer}>
        <Text>Don't have an account?</Text>
        <Button onPress={() => setSignUp(true)} title="Sign up" color="#888" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    height: 40,
    width: 200,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  footer: {
    marginBottom: 5,
  },
});
