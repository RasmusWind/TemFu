import { useEffect } from "react";
import VideoComponent from "./VideoComponent";
import LoginComponent from "./LoginComponent";
import Upload from "./Upload";
import ProfileComponent from "./ProfileComponent";
import Swiper from "./Swiper";
import client from "../client";
import { useUserContext } from "../context/UserContext";
import { BackHandler } from "react-native";

function MainComponent() {
  const userContext = useUserContext();
  useEffect(() => {
    client
      .get("/get_user", userContext.token)
      .then(function (res) {
        let response_token = res.data.token;
        let response_user = res.data.user;
        userContext.setToken(response_token);
        userContext.setUser(response_user.username);
      })
      .catch(function (error) {
        userContext.setUser();
        userContext.setToken();
      });

    const handleBackButtonClick = () => {
      userContext.setUser();
      userContext.setToken();
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
