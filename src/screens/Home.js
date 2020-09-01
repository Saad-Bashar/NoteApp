import React from "react";
import { View, Text } from "react-native";
import Button from "../components/Button";
import { firebase } from "../firebase/config";

export default function Home() {
  return (
    <View>
      <Text>Home</Text>
      <Button
        title="LOGOUT"
        backgroundColor="blue"
        onPress={() => {
          firebase.auth().signOut();
        }}
      />
    </View>
  );
}
