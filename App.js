import { StyleSheet, View, LogBox, Text } from "react-native";
import { useState, useEffect } from "react";
import VideoComponent from "./components/VideoComponent";
import LoginComponent from "./components/LoginComponent";
import Upload from "./components/Upload";
import ProfileComponent from "./components/ProfileComponent";
import Swiper from "./components/Swiper";
import client from "./client";
LogBox.ignoreLogs(["new NativeEventEmitter"]);

export default function App() {
  const [currentUser, setCurrentUser] = useState();
  const [currentToken, setCurrentToken] = useState();

  useEffect(() => {
    client
      .get("/get_user", {
        headers: {
          Authorization: `Token ${currentToken}`,
        },
      })
      .then(function (res) {
        let token = res.data.token;
        let user = res.data.user;
        setCurrentToken(token);
        setCurrentUser(user.username);
      })
      .catch(function (error) {
        setCurrentUser();
        setCurrentToken();
      });
  }, []);

  const swiper_screens = [
    {
      label: "Upload",
      component: Upload,
      props: {
        currentUser: currentUser,
        currentToken: currentToken,
      },
    },
    {
      label: "VideoComponent",
      component: VideoComponent,
      props: {
        currentToken: currentToken,
      },
    },
    {
      label: "ProfileComponent",
      component: ProfileComponent,
      props: {
        currentUser: currentUser,
        setCurrentUser: setCurrentUser,
        currentToken: currentToken,
        setCurrentToken: setCurrentToken,
      },
    },
  ];
  if (!currentUser) {
    return (
      <LoginComponent
        setCurrentUser={setCurrentUser}
        setCurrentToken={setCurrentToken}
      />
    );
  }
  return (
    <Swiper
      screens={swiper_screens}
      defaultScreenIndex={1}
      looping={false}
    ></Swiper>
  );
}
