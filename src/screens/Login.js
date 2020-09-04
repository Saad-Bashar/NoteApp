import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import Button from "../components/Button";
import { firebase } from "../firebase/config.js";

const styles = StyleSheet.create({
  form: {
    marginHorizontal: 25,
    marginTop: 60,
  },

  input: {
    height: 40,
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
    marginBottom: 30,
  },

  signupView: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
});

export default function Login({ navigation }) {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = () => {
    if (!email || !password) {
      return Alert.alert("Error", "You need to fill in all the inputs", [
        { text: "OK", onPress: () => {} },
      ]);
    }

    setLoading(true);
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((res) => {
        console.log("res ", res);
        setLoading(false);
      })
      .catch((error) => {
        console.log("err ", error);
        alert(error);
        setLoading(false);
      });
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ alignSelf: "center", marginTop: 120 }}>
        <Image source={require("../../assets/favicon.png")} />
      </View>

      <View style={styles.form}>
        <TextInput
          onChangeText={(text) => setEmail(text)}
          placeholder="Email"
          style={styles.input}
          autoCapitalize="none"
        />
        <TextInput
          onChangeText={(text) => setPassword(text)}
          placeholder="Password"
          style={styles.input}
          secureTextEntry={true}
        />
        {loading ? (
          <ActivityIndicator />
        ) : (
          <Button onPress={login} title="LOGIN" backgroundColor="blue" />
        )}
      </View>

      <View style={styles.signupView}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Signup")}
          style={{ padding: 20 }}
        >
          <Text style={{ fontSize: 16 }}>
            Don't have an account?{" "}
            <Text style={{ color: "blue", fontWeight: "bold" }}>Sign up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
