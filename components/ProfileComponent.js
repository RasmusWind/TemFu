import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableHighlight,
  Button,
} from "react-native";
import client from "../client";

export default function ProfileComponent({
  currentUser,
  setCurrentUser,
  currentToken,
  setCurrentToken,
}) {
  function reloadUser() {
    client
      .get("/get_user", {
        headers: {
          Authorization: `Token ${currentToken}`,
        },
      })
      .then(function (res) {
        let token = response.data.token;
        let user = response.data.user;
        setCurrentToken(token);
        setCurrentUser(user.username);
      })
      .catch(function (err) {});
  }

  function logOut() {
    setCurrentUser();
    setCurrentToken();
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
            uri: `${client.getUri()}/media/reload.png`,
          }}
          style={styles.reload}
        />
      </TouchableHighlight>
      <View style={styles.container}>
        <Image
          style={styles.image}
          source={{ uri: `${client.getUri()}/${currentUser.profile.image}` }}
        />
        <Text>{currentUser.username}</Text>
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
