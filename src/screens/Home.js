import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import Button from "../components/Button";
import { firebase } from "../firebase/config";
import { AntDesign, Feather } from "@expo/vector-icons";
import Card from "../components/Card";

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
});

export default function Home({ navigation, extraData }) {
  const [notes, setNotes] = useState(null);
  const userId = extraData.uid;
  const noteRef = firebase.firestore().collection("notes");

  console.log("notes ", notes);

  useEffect(() => {
    // on snapshot is our subsciption
    const subscriber = noteRef
      .orderBy("createdAt", "desc")
      .where("authorId", "==", userId)
      .onSnapshot((querySnapshot) => {
        const newNotes = []; // create this arry to set  our main notes
        querySnapshot.forEach((doc) => {
          // creating note obj
          const note = doc.data();
          note.id = doc.id;
          newNotes.push(note);
        });

        // setting it here...
        setNotes(newNotes);
      });

    return subscriber;
  }, []);

  const onDelete = (id) => {
    return noteRef.doc(id).delete();
  };

  const renderNote = ({ item, index }) => {
    return (
      <Card customStyle={{ padding: 20, marginBottom: 15 }}>
        <View style={[styles.titleWrapper, { flex: 1 }]}>
          <View style={{ flexDirection: "row", flex: 1, flexWrap: "wrap" }}>
            <Text>{`Note #${index + 1} - `}</Text>
            <Text>{item.description}</Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              onPress={() => navigation.navigate("Update", { item })}
            >
              <Feather name="edit" size={24} color="black" />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => onDelete(item.id)}>
              <AntDesign
                name="delete"
                size={24}
                style={{ marginLeft: 15 }}
                color="black"
              />
            </TouchableOpacity>
          </View>
        </View>
      </Card>
    );
  };

  if (!notes || (notes && notes.length === 0)) {
    return (
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <View style={styles.wrapper}>
          <View style={styles.titleWrapper}>
            <Text style={styles.title}>My notes</Text>

            <TouchableOpacity
              onPress={() => navigation.navigate("Create", { userId })}
            >
              <AntDesign name="pluscircleo" size={24} color="black" />
            </TouchableOpacity>
          </View>

          <View>
            <Image
              style={{ height: 300, width: "100%", marginTop: 100 }}
              resizeMode="contain"
              source={require("../../assets/empty.png")}
            />
            <Text style={{ textAlign: "center", paddingTop: 20, fontSize: 18 }}>
              No notes, please add new notes
            </Text>
          </View>

          <View style={{ flex: 1, justifyContent: "flex-end" }}>
            <Button
              title="LOGOUT"
              backgroundColor="blue"
              onPress={() => {
                firebase.auth().signOut();
              }}
            />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View style={styles.wrapper}>
        <View style={styles.titleWrapper}>
          <Text style={styles.title}>My notes</Text>

          <TouchableOpacity
            onPress={() => navigation.navigate("Create", { userId })}
          >
            <AntDesign name="pluscircleo" size={24} color="black" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={notes}
          renderItem={renderNote}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ paddingVertical: 30 }}
        />

        <View style={{ flex: 1, justifyContent: "flex-end" }}>
          <Button
            title="LOGOUT"
            backgroundColor="blue"
            onPress={() => {
              firebase.auth().signOut();
            }}
          />
        </View>
      </View>
    </View>
  );
}
