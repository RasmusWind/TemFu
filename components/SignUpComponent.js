import { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  Button,
  BackHandler,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import client from "../client";

function SignUpComponent({ setSignUp }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    const handleBackButtonClick = () => {
      setSignUp(false);
      return true;
    };

    const backhandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackButtonClick
    );
    return () => {
      backhandler.remove();
    };
  }, []);
  async function confirmSignUp() {
    console.log(username, password);
    if (password != confirmPassword) {
      setPasswordError("Passwords do not match");
      setPassword("");
      setConfirmPassword("");
      return;
    }
    if (username == "") {
      setUsernameError("Username is null");
      return;
    }
    if (password == "") {
      setPasswordError("Password is null");
      setPassword("");
      setConfirmPassword("");
      return;
    }

    await client
      .post(`${client.baseURL}/signup`, "", {
        username: username,
        password: password,
        email: email,
      })
      .then(function (res) {
        setSignUp(false);
      })
      .catch(function (err) {
        setUsernameError("Username already exists");
        setPassword();
        setConfirmPassword();
      });
  }

  return (
    <View style={styles.container}>
      <Icon
        onPress={() => setSignUp(false)}
        style={styles.backarrow}
        name="arrow-left"
        size={30}
        color="#000"
      />
      <View style={styles.container}>
        {usernameError.length > 0 ? (
          <Text style={{ color: "red" }}>{usernameError}</Text>
        ) : null}
        <TextInput
          style={{
            ...styles.input,
            ...(usernameError.length > 0 ? styles.inputError : null),
          }}
          value={username}
          onFocus={usernameError.length > 0 ? () => setUsernameError("") : null}
          onChangeText={setUsername}
          placeholder="username"
          placeholderTextColor="white"
        />
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="e-mail"
          placeholderTextColor="white"
        />
        {passwordError.length > 0 ? (
          <Text style={{ color: "red" }}>{passwordError}</Text>
        ) : null}
        <TextInput
          secureTextEntry={true}
          style={{
            ...styles.input,
            ...(passwordError.length > 0 ? styles.inputError : null),
          }}
          value={password}
          onFocus={passwordError.length > 0 ? () => setPasswordError("") : null}
          onChangeText={setPassword}
          placeholder="password"
          placeholderTextColor="white"
        />
        <TextInput
          secureTextEntry={true}
          style={{
            ...styles.input,
            ...(passwordError.length > 0 ? styles.inputError : null),
          }}
          value={confirmPassword}
          onFocus={passwordError.length > 0 ? () => setPasswordError("") : null}
          onChangeText={setConfirmPassword}
          placeholder="confirm password"
          placeholderTextColor="white"
        />
        <Button
          style={styles.button}
          onPress={confirmSignUp}
          title="Sign Up!"
        />
      </View>
      <View style={styles.footer}>
        <Text styles={{ color: "white" }}>Already have an account?</Text>
        <Button onPress={() => setSignUp(false)} title="Log in" color="#888" />
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
  inputError: {
    borderColor: "red",
  },
  button: {},
  backarrow: {
    position: "absolute",
    left: 10,
    top: 30,
  },
});

export default SignUpComponent;
