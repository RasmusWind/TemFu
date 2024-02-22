import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TextInput,
  Button,
  Image,
  TouchableHighlight,
} from "react-native";
import { useState, useEffect } from "react";
import { useUserContext } from "../context/UserContext";
import { client, session_client } from "../client";
function CommentSection({ comments, currentVideo }) {
  const userContext = useUserContext();
  const [newCommentText, setNewCommentText] = useState();
  const [allComments, setAllComments] = useState([]);

  useEffect(() => {
    if (allComments.length == 0) {
      setAllComments(comments);
    }
  }, []);

  var width = 0;
  const onLayout = (event) => {
    let dimen = event.nativeEvent.layout;
    width = dimen.width;
  };

  function replyToComment(comment) {
    userContext.ws.send(
      JSON.stringify({
        receiver: comment.user.username,
        message: "Reply to: " + comment.user.username,
      })
    );
  }

  function showLinkedComments(comments) {
    console.log(comments);
  }

  function postComment() {
    let newComment = {
      video: currentVideo.id,
      user: userContext.user.id,
      text: newCommentText,
    };

    client
      .post("/createcomment", userContext.token, newComment)
      .then(function (res) {
        setAllComments([res.data.comment, ...allComments]);
        setNewCommentText();
        userContext.ws.send(
          JSON.stringify({
            receiver: currentVideo.user.username,
            message: userContext.user.username + " commented on your video.",
          })
        );
      });
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.comments}>
        {allComments.map((comment) => (
          <View onLayout={onLayout} key={comment.id} style={styles.comment}>
            <View style={styles.commentHeader}>
              <Image
                source={{
                  uri: `${session_client.baseURL}/${comment.user.profile.image}`,
                }}
                style={styles.profilepicture}
              />
              <Text style={{ ...styles.commentHead, ...styles.textColor }}>
                {comment.user.username}
              </Text>
            </View>
            <View style={{ ...styles.commentBody, width: width - 45 }}>
              <Text style={styles.textColor}>{comment.text}</Text>
            </View>
            <View style={{ ...styles.commentFooter, width: width - 45 }}>
              <TouchableHighlight
                onPress={() => showLinkedComments(comment.comments)}
              >
                <Text style={styles.textColor}>
                  comments({comment.comments.length})
                </Text>
              </TouchableHighlight>
              <TouchableHighlight onPress={() => replyToComment(comment)}>
                <Text style={styles.textColor}>reply</Text>
              </TouchableHighlight>
            </View>
          </View>
        ))}
      </ScrollView>
      <View style={styles.newcomment}>
        <TextInput
          style={styles.newcommentinput}
          value={newCommentText}
          onChangeText={setNewCommentText}
          placeholder="..."
          placeholderTextColor="white"
        />
        <Button
          style={styles.newcommentbutton}
          title="Send"
          onPress={postComment}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 5,
    position: "absolute",
    backgroundColor: "#222",
    opacity: 0.95,
    bottom: 40,
    height: "60%",
    width: "95%",
  },
  comments: {
    flex: 1,
    overflow: "scroll",
  },
  comment: {
    maxHeight: "33%",
    overflow: "hidden",
    marginBottom: 3,
    borderBottomWidth: 1,
    borderBottomColor: "#AAA",
  },
  commentHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  commentHead: {
    marginLeft: 5,
  },
  commentBody: {
    marginLeft: 45,
    borderBottomWidth: 1,
    borderBottomColor: "#AAA",
  },
  commentFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    // marginLeft: 45,
  },
  profilepicture: {
    width: 30,
    height: 30,
    borderRadius: 20,
  },
  textColor: {
    color: "white",
  },
  newcomment: {
    height: "15%",
    bottom: 0,
    flexDirection: "row",
  },
  newcommentinput: {
    flex: 1,
    color: "white",
    borderWidth: 1,
    borderColor: "white",
    textAlignVertical: "top",
    padding: 5,
  },
  newcommentbutton: {},
});

export default CommentSection;
