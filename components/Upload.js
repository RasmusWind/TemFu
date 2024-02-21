import { useState } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Image,
  Button,
  TextInput,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import Icon from "react-native-vector-icons/FontAwesome";
import client from "../client";
import { useUserContext } from "../context/UserContext";

export default function Upload() {
  const userContext = useUserContext();
  const [file, setFile] = useState({ name: "" });
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  async function uploadFile() {
    let form = new FormData();
    form.append("file", {
      uri: file.uri,
      type: file.mimeType,
      name: file.name,
    });
    form.append("name", name);
    form.append("description", desc);

    client
      .post("/uploadvideo", userContext.token, form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(function (res) {
        setDesc();
        setName();
        setFile({ name: "" });
        // Maybe go to video component with newly uploaded video
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={async () => {
          const { assets, canceled } = await DocumentPicker.getDocumentAsync({
            base64: true,
          });
          if (!canceled && assets.length > 0) {
            let selected_file = assets[0];
            setFile(selected_file);
          }
        }}
      >
        <Icon name="upload" size={50} color="#ddd" />
      </TouchableOpacity>
      <Text styles={{ color: "white" }}>{file.name}</Text>
      <TextInput
        style={styles.input}
        onChangeText={setName}
        value={name}
        placeholder="Video name"
        placeholderTextColor="white"
      />
      <TextInput
        style={styles.longinput}
        onChangeText={setDesc}
        value={desc}
        numberOfLines={3}
        multiline={true}
        placeholder="Description"
        placeholderTextColor="white"
      />
      {file.name ? (
        <Button style={styles.button} onPress={uploadFile} title="submit" />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  upload: {
    color: "white",
    width: 50,
    height: 50,
  },
  container: {
    flex: 1,
    backgroundColor: "#111",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    borderColor: "white",
    color: "white",
    height: 40,
    width: 200,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  longinput: {
    borderColor: "white",
    color: "white",
    height: 120,
    width: "90%",
    margin: 12,
    borderWidth: 1,
    padding: 10,
    textAlignVertical: "top",
  },
});
