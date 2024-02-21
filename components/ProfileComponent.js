import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableHighlight,
  Button,
} from "react-native";
import client from "../client";
import { useUserContext } from "../context/UserContext";

export default function ProfileComponent() {
  const userContext = useUserContext();
  function reloadUser() {
    client
      .get("/get_user", currentToken)
      .then(function (res) {
        let token = response.data.token;
        let user = response.data.user;
        userContext.setToken(token);
        userContext.setUser(user.username);
      })
      .catch(function (err) {});
  }

  function logOut() {
    userContext.setUser();
    userContext.setToken();
  }

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <TouchableHighlight onPress={reloadUser} style={styles.touchable}>
        <Image
          source={{
            uri: `${client.baseURL}/media/reload.png`,
          }}
          style={styles.reload}
        />
      </TouchableHighlight>
      <View style={styles.container}>
        <Image
          style={styles.image}
          source={{
            uri: `${client.baseURL}/${userContext.user.profile.image}`,
          }}
        />
        <Text style={{ color: "white" }}>{userContext.user.username}</Text>
      </View>
      <Button style={styles.logout} title="Log out" onPress={logOut} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  image: {
    width: 50,
    height: 50,
  },
  reload: {
    width: 50,
    height: 50,
  },
  touchable: {
    position: "absolute",
    top: 30,
    right: 10,
  },
  logout: {},
});
