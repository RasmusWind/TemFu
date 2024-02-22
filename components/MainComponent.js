import { useEffect } from "react";
import VideoComponent from "./VideoComponent";
import LoginComponent from "./LoginComponent";
import Upload from "./Upload";
import ProfileComponent from "./ProfileComponent";
import Swiper from "./Swiper";
import { session_client } from "../client";
import { useUserContext } from "../context/UserContext";
import { BackHandler, LogBox, ToastAndroid, AsyncStorage } from "react-native";

// import { useToast } from "react-native-toast-notifications";
// import { WebSocket } from "react-native-websocket";
LogBox.ignoreLogs(["new NativeEventEmitter"]);

function MainComponent() {
  const userContext = useUserContext();
  useEffect(() => {
    session_client
      .get("/session_user")
      .then(function (res) {
        userContext.setUser(res.data.user);
        userContext.setToken(res.data.token);
        userContext.ws.onmessage = function (e) {
          let data = JSON.parse(e.data);
          let sender = data.sender;
          let message = data.message;
          ToastAndroid.showWithGravity(
            `${sender.username} sent the message: ${message}`,
            ToastAndroid.SHORT,
            ToastAndroid.TOP
          );
        };
        let newComment = {
          video: 6,
          user: 6,
          text: "newCommentText",
        };

        client.post("/createcomment", newComment).then(function (res) {
          console.log(res.data);
        });
      })
      .catch(function (error) {
        userContext.setUser();
      });

    const handleBackButtonClick = () => {
      userContext.setUser();
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

  const swiper_screens = [
    {
      label: "Upload",
      component: Upload,
    },
    {
      label: "VideoComponent",
      component: VideoComponent,
    },
    {
      label: "ProfileComponent",
      component: ProfileComponent,
    },
  ];
  if (!userContext.user) {
    return <LoginComponent />;
  }
  return (
    <Swiper
      screens={swiper_screens}
      defaultScreenIndex={1}
      looping={false}
    ></Swiper>
  );
}

export default MainComponent;
