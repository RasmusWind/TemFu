import { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Button,
  Text,
  BackHandler,
} from "react-native";
import { client, session_client } from "../client";
import SignUpComponent from "./SignUpComponent";
import { useUserContext } from "../context/UserContext";

export default function LoginComponent() {
  const userContext = useUserContext();
  const [username, setUsername] = useState("raller");
  const [password, setPassword] = useState("Pass1234!");
  const [signUp, setSignUp] = useState(false);

  function handleBackButtonClick() {}

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
  }, []);

  function submitLogin(e) {
    session_client
      .post("/session_login", {
        username: username,
        password: password,
      })
      .then(function (res) {
        userContext.setUser(res.data.user);
        userContext.setToken(res.data.token);
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
          placeholderTextColor="white"
        />
        <TextInput
          style={styles.input}
          onChangeText={setPassword}
          value={password}
          secureTextEntry={true}
          placeholderTextColor="white"
        />
        <Button onPress={submitLogin} title="Log in" />
      </View>
      <View style={styles.footer}>
        <Text style={{ color: "white" }}>Don't have an account?</Text>
        <Button onPress={() => setSignUp(true)} title="Sign up" color="#888" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
  },
  input: {
    color: "white",
    borderColor: "white",
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
