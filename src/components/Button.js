import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    marginTop: 30,
  },

  btnText: {
    fontSize: 16,
    fontWeight: "500",
    color: "white",
  },
});

export default function Button({ icon, title, backgroundColor, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.container, { backgroundColor }]}
    >
      <Image source={icon} />
      <Text style={styles.btnText}>{title}</Text>
    </TouchableOpacity>
  );
}
