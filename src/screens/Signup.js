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

export default function Signup({ navigation }) {
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [loading, setLoading] = useState(false);

  const signup = () => {
    if (!email || !password || !name || !confirmPassword) {
      return Alert.alert("Error", "You need to fill in all the inputs", [
        { text: "OK", onPress: () => {} },
      ]);
    }

    if (password !== confirmPassword) {
      return Alert.alert(
        "Error",
        "Confirm password should be same as password",
        [{ text: "OK", onPress: () => {} }]
      );
    }

    setLoading(true);
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((response) => {
        setLoading(false);

        //first step -> get user id
        const uid = response.user.uid;

        // second step -> create the user profile date
        const userProfileDate = {
          id: uid,
          email: email,
          name: name,
        };

        // third step => create user collections
        const userRef = firebase.firestore().collection("users");

        // fourth step => save it to cloud
        userRef.doc(uid).set(userProfileDate);
      })
      .catch((error) => {
        console.log("errr", error);
        setLoading(false);
        alert(error);
      });
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ alignSelf: "center", marginTop: 120 }}>
        <Image source={require("../../assets/favicon.png")} />
      </View>

      <View style={styles.form}>
        <TextInput
          onChangeText={(text) => setName(text)}
          placeholder="Name"
          style={styles.input}
          autoCapitalize="words"
        />

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

        <TextInput
          onChangeText={(text) => setConfirmPassword(text)}
          placeholder="Confirm password"
          style={styles.input}
          secureTextEntry={true}
        />

        {loading ? (
          <ActivityIndicator />
        ) : (
          <Button onPress={signup} title="Sign up" backgroundColor="blue" />
        )}
      </View>

      <View style={styles.signupView}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ padding: 20 }}
        >
          <Text style={{ fontSize: 16 }}>
            Already have an account?{" "}
            <Text style={{ color: "blue", fontWeight: "bold" }}>Sign in</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
