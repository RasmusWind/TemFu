import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Dimensions, TextInput, TouchableWithoutFeedback } from 'react-native';
import { Video, ResizeMode } from 'expo-av'
import { useState, useEffect, useRef } from 'react'
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import axios from 'axios';
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['new NativeEventEmitter']);

const client = axios.create({
  baseURL: "http://192.168.1.72:8000"
});

//jawd
export default function App() {
  const [currentUser, setCurrentUser] = useState();
  const [currentToken, setCurrentToken] = useState();
  const [registrationToggle, setRegistrationToggle] = useState(false);
  const [username, setUsername] = useState("niller");
  const [password, setPassword] = useState("Pass1234!");
  const [bgcolor, setBgcolor] = useState("white");
  const [seed, setSeed] = useState(1);

  useEffect(() => {
    client.get("/get_user", {
      headers:{
        Authorization: `Token ${currentToken}`
      }
    })
    .then(function(res) {
      let token = response.data.token
      let user = response.data.user
      setCurrentToken(token)
      setCurrentUser(user)
    })
    .catch(function(error) {
      setCurrentUser();
      setCurrentToken();
    });
  }, []);

  function submitLogin(e){
    client.post("/login", {
      username:username,
      password:password,
    })
    .then(function(response){
      let token = response.data.token
      let user = response.data.user
      setCurrentToken(token)
      setCurrentUser(user)
    })
  }

  
  function onSwipe(gestureName, gestureState) {
    const {SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT} = swipeDirections;
    console.log(gestureName)
    switch (gestureName) {
      case SWIPE_UP:
        client.post("/setnewvideo", {}, {
          headers:{
            Authorization: `Token ${currentToken}`
          }
        }).then(function(res){
          setSeed(Math.random())
        })
        break;
      case SWIPE_DOWN:
        client.post("/setnewvideo", {}, {
          headers:{
            Authorization: `Token ${currentToken}`
          }
        }).then(function(res){
          setSeed(Math.random())
        })
        break;
      case SWIPE_LEFT:
        break;
      case SWIPE_RIGHT:
        break;
    }
  }

  const config = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 80
  };

  const video = useRef(null);
  const [status, setStatus] = useState({});
  var windowWidth = Dimensions.get('window').width;
  var windowHeight = Dimensions.get('window').height;
  

  if(currentUser){
    return (
      <GestureRecognizer
        onSwipe={(direction, state) => {
          onSwipe(direction, state)
        }}
        config={config}
        style={{
          flex: 1,
          backgroundColor: bgcolor
        }}
        >
          <View style={styles.container}>
            <TouchableWithoutFeedback onPress={()=>{
              status.isPlaying ? video.current.pauseAsync() : video.current.playAsync()
            }}>
              <Video
                key={seed}
                ref={video}
                style={{width: windowWidth, height: windowHeight}}
                source={{
                  uri: "http://192.168.1.72:8000/streamvideo",
                  headers:{
                    Authorization: `Token ${currentToken}`
                  },
                }}
                resizeMode={ResizeMode.CONTAIN}
                onPlaybackStatusUpdate={status => {
                    setStatus(() => status)
                  }
                }
                shouldPlay={true}
                isLooping={true}
              />
            </TouchableWithoutFeedback>
          </View>
      </GestureRecognizer>
    )
  }
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        onChangeText={setUsername}
        value={username}
      />
      <TextInput
        style={styles.input}
        onChangeText={setPassword}
        value={password}
        secureTextEntry={true}
      />
      <Button
        onPress={submitLogin}
        title="Log in"
        color="#841584"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 40,
    width: 200,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
//http://localhost:8000/api/video?path=media/video.mp4