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
import client from "../client";

export default function Upload({ currentUser, currentToken }) {
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
      .post("/uploadvideo", form, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Token ${currentToken}`,
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
          console.log(assets);
          if (!canceled && assets.length > 0) {
            let selected_file = assets[0];
            setFile(selected_file);
          }
        }}
      >
        <Image
          source={{
            uri: `${client.getUri()}/media/upload-icon.png`,
          }}
          style={styles.upload}
        />
      </TouchableOpacity>
      <Text>{file.name}</Text>
      <TextInput
        style={styles.input}
        onChangeText={setName}
        value={name}
        placeholder="Video name"
      />
      <TextInput
        style={styles.longinput}
        onChangeText={setDesc}
        value={desc}
        numberOfLines={3}
        multiline={true}
        placeholder="Description"
      />
      {file.name ? (
        <Button style={styles.button} onPress={uploadFile} title="submit" />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  upload: {
    width: 50,
    height: 50,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    height: 40,
    width: 200,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  longinput: {
    height: 120,
    width: 400,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    textAlignVertical: "top",
  },
});
