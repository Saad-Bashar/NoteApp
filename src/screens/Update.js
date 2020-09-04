import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ActivityIndicator,
} from "react-native";
import Button from "../components/Button";
import { firebase } from "../firebase/config";

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    margin: 25,
  },

  titleWrapper: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
  },

  input: {
    height: 60,
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
    marginTop: 40,
  },
});

export default function Update({ route, navigation }) {
  const userId = route.params.userId;
  const item = route.params.item;
  const noteRef = firebase.firestore().collection("notes");

  const [note, setNote] = useState(item.description);
  const [loading, setLoading] = useState(false);

  const onUpdate = () => {
    if (note && note.length > 0) {
      //1 - make loading active
      setLoading(true);

      return noteRef
        .doc(item.id)
        .update({ description: note })
        .then(() => {
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }

    return alert("Note is empty");
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.wrapper}>
        <Text style={styles.title}>Edit note</Text>

        <TextInput
          onChangeText={(text) => setNote(text)}
          placeholder="Write down your notes"
          style={styles.input}
          value={note}
        />

        {loading ? (
          <ActivityIndicator style={{ marginTop: 25 }} />
        ) : (
          <Button title="UPDATE" backgroundColor="blue" onPress={onUpdate} />
        )}
      </View>
    </View>
  );
}
