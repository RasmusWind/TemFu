import {
  StyleSheet,
  Text,
  Button,
  View,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import { Video, ResizeMode } from "expo-av";
import { useState, useRef, useEffect } from "react";
import GestureRecognizer, {
  swipeDirections,
} from "react-native-swipe-gestures";
import { LogBox } from "react-native";
import { session_client } from "../client";
import CommentSection from "./CommentSection";
import { useUserContext } from "../context/UserContext";
LogBox.ignoreLogs(["new NativeEventEmitter"]);

//jawd
export default function VideoComponent() {
  const userContext = useUserContext();
  const [currentVideo, setCurrentVideo] = useState();
  const [currentVideoComments, setCurrentVideoComments] = useState();
  const [seed, setSeed] = useState(1);
  const [status, setStatus] = useState({});
  const [showComments, setShowComments] = useState(false);
  const video = useRef(null);
  var windowWidth = Dimensions.get("window").width;
  var windowHeight = Dimensions.get("window").height;

  useEffect(() => {
    session_client.get("/get_new_video").then(function (res) {
      setCurrentVideo(res.data.video);
    });
  }, []);

  const config = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 80,
  };

  function video_swipe() {
    console.log("Calling video swipe");
    session_client.get("/get_new_video").then(function (res) {
      setCurrentVideo(res.data.video);
      setSeed(Math.random());
    });
  }

  function displayComments() {
    if (showComments) {
      setShowComments(false);
    } else {
      session_client
        .get(`/get_videocomments/${currentVideo.id}`)
        .then(function (res) {
          setCurrentVideoComments(res.data.comments);
          setShowComments(true);
        })
        .catch(function (err) {});
    }
  }

  return (
    <View style={styles.container}>
      {currentVideo ? (
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
                  // uri: `${client.baseURL}/media/video_uploads/${videoUrl}`,
                  uri: `${session_client.baseURL}/streamvideo`,
                }}
                resizeMode={ResizeMode.CONTAIN}
                onPlaybackStatusUpdate={(status) => {
                  setStatus(() => status);
                }}
                shouldPlay={false}
                isLooping={false}
                onError={() => {}}
              />
            </TouchableWithoutFeedback>
          </View>
        </GestureRecognizer>
      ) : null}
      <View style={styles.videoMenu}>
        <Button
          style={styles.videoButtons}
          onPress={displayComments}
          title="Comments"
        />
      </View>
      {showComments ? (
        <CommentSection
          comments={currentVideoComments}
          currentVideo={currentVideo}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
    alignItems: "center",
    justifyContent: "center",
  },
  videoMenu: {
    flexDirection: "row",
    justifyContent: "flex-end",
    width: "100%",
    marginBottom: 2,
    paddingLeft: 2,
    paddingRight: 2,
  },
  videoButtons: {
    // width: "60px",
  },
  commentsOverlay: {
    display: "none",
    width: "95%",
    height: "60%",
  },
});
