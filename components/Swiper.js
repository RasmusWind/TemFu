import { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import GestureRecognizer from "react-native-swipe-gestures";
import SwiperNavigation from "./SwiperNavigation";

export default function Swiper({
  screens,
  defaultScreenIndex = 0,
  looping = false,
}) {
  if (screens.length == 0) {
    return;
  }
  const [screenIndex, setScreenIndex] = useState(defaultScreenIndex);
  const [labels, setLabels] = useState(screens.map((scr) => scr.label));

  const config = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 50,
  };

  function swipeRight() {
    if (screenIndex - 1 < 0) {
      if (looping) {
        let maxIndex = screens.length - 1;
        setScreenIndex(maxIndex);
      }
    } else {
      setScreenIndex(screenIndex - 1);
    }
  }
  function swipeLeft() {
    if (screenIndex + 1 == screens.length) {
      if (looping) {
        setScreenIndex(0);
      }
    } else {
      setScreenIndex(screenIndex + 1);
    }
  }
  let screen = screens[screenIndex];
  return (
    <View style={styles.container}>
      <GestureRecognizer
        style={styles.gesturecontainer}
        onSwipeLeft={swipeLeft}
        onSwipeRight={swipeRight}
        config={config}
      >
        <screen.component {...screen.props} />
      </GestureRecognizer>
      <SwiperNavigation
        labels={labels}
        activeLabelIndex={screenIndex}
        setScreenIndex={setScreenIndex}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
  },
  gesturecontainer: {
    flex: 1,
  },
  swiperstyle: {
    height: "200px",
    backgroundColor: "red",
  },
  flexrow: {
    flexDirection: "row",
  },
});
