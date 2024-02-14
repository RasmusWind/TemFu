import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import { Video, ResizeMode } from "expo-av";
import { useState, useRef } from "react";
import GestureRecognizer, {
  swipeDirections,
} from "react-native-swipe-gestures";
import { LogBox } from "react-native";
import client from "../client";
LogBox.ignoreLogs(["new NativeEventEmitter"]);

//jawd
export default function VideoComponent({ currentToken }) {
  const [videoUrl, setVideoUrl] = useState();
  const [seed, setSeed] = useState(1);
  const [status, setStatus] = useState({});
  const video = useRef(null);
  var windowWidth = Dimensions.get("window").width;
  var windowHeight = Dimensions.get("window").height;

  const config = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 80,
  };

  function video_swipe() {
    client
      .post(
        "/setnewvideo",
        {},
        {
          headers: {
            Authorization: `Token ${currentToken}`,
          },
        }
      )
      .then(function (res) {
        setVideoUrl(res.data.video);
        setSeed(Math.random());
      });
  }

  return (
    <GestureRecognizer
      onSwipeDown={video_swipe}
      onSwipeUp={video_swipe}
      config={config}
      style={{
        flex: 1,
      }}
    >
      <View style={styles.container}>
        <TouchableWithoutFeedback
          onPress={() => {
            status.isPlaying
              ? video.current.pauseAsync()
              : video.current.playAsync();
          }}
        >
          <Video
            key={seed}
            ref={video}
            style={{ width: windowWidth, height: windowHeight }}
            source={{
              // uri: `${client.getUri()}/media/video_uploads/${videoUrl}`,
              uri: `${client.getUri()}/streamvideo`,
              headers: {
                Authorization: `Token ${currentToken}`,
              },
            }}
            resizeMode={ResizeMode.CONTAIN}
            onPlaybackStatusUpdate={(status) => {
              setStatus(() => status);
            }}
            shouldPlay={false}
            isLooping={false}
            onError={() => {
              video_swipe();
            }}
          />
        </TouchableWithoutFeedback>
      </View>
    </GestureRecognizer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
