import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import Button from "../components/Button";
import { firebase } from "../firebase/config";
import { showMessage, hideMessage } from "react-native-flash-message";
import { Formik } from "formik";
import * as yup from "yup";

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
    height: 40,
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
    marginTop: 40,
  },
});

const validationSchema = yup.object().shape({
  name: yup
    .string()
    .min(2, "Note name too short")
    .max(10, "Note name too big")
    .required("Name is a required field"),
  description: yup.string().required("Description is a required field"),
});

const prirityOptions = ["low", "high"];

export default function Create({ route, navigation }) {
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(false);

  const userId = route.params.userId;
  const noteRef = firebase.firestore().collection("notes");

  const onSave = () => {
    if (note && note.length > 0) {
      //1 - make loading active
      setLoading(true);

      //2 - create a timestamp
      const timestamp = firebase.firestore.FieldValue.serverTimestamp();

      //3 - create the data object
      const data = {
        description: note,
        authorId: userId,
        createdAt: timestamp,
      };

      //4 - save to firestore
      return noteRef
        .add(data)
        .then((_doc) => {
          showMessage({
            message: "Successfully created!",
            type: "success",
          });
          setNote(null);
          setLoading(false);
          navigation.goBack();
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
        <Text style={styles.title}>Create note</Text>

        {/* <TextInput
          onChangeText={(text) => setNote(text)}
          placeholder="Write down your notes"
          style={styles.input}
          value={note}
        /> */}

        <Formik
          initialValues={{ name: "", description: "", priority: null }}
          onSubmit={(values, action) => {
            console.log("values ", values);
          }}
          validationSchema={validationSchema}
        >
          {(formikProps) => {
            console.log("errors ", formikProps.errors);
            return (
              <View>
                <TextInput
                  onChangeText={formikProps.handleChange("name")}
                  placeholder="Note name"
                  style={styles.input}
                  value={note}
                  onFocus={() => {
                    console.log("name on focus");
                  }}
                  onBlur={() => {
                    formikProps.setFieldTouched("name", true);
                  }}
                />

                {formikProps.errors.name && formikProps.touched.name ? (
                  <Text style={{ color: "red" }}>
                    {formikProps.errors.name}
                  </Text>
                ) : null}

                <TextInput
                  onChangeText={formikProps.handleChange("description")}
                  placeholder="Note description"
                  style={styles.input}
                  onBlur={() => {
                    formikProps.setFieldTouched("description", true);
                  }}
                />

                {formikProps.errors.description &&
                formikProps.touched.description ? (
                  <Text style={{ color: "red" }}>
                    {formikProps.errors.description}
                  </Text>
                ) : null}

                <View style={{ marginVertical: 30 }}>
                  <Text>Priority</Text>

                  <View style={{ marginVertical: 30 }}>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <TouchableOpacity
                        onPress={() =>
                          formikProps.setFieldValue("priority", "low")
                        }
                        style={{
                          height: 50,
                          width: 50,
                          borderRadius: 25,
                          backgroundColor: "blue",
                          marginRight: 15,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {formikProps.values["priority"] === "low" && (
                          <View
                            style={{
                              width: 30,
                              height: 30,
                              borderRadius: 15,
                              backgroundColor: "white",
                            }}
                          />
                        )}
                      </TouchableOpacity>
                      <Text>LOW</Text>
                    </View>

                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginTop: 20,
                      }}
                    >
                      <TouchableOpacity
                        onPress={() =>
                          formikProps.setFieldValue("priority", "high")
                        }
                        style={{
                          height: 50,
                          width: 50,
                          borderRadius: 25,
                          backgroundColor: "blue",
                          marginRight: 15,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {formikProps.values["priority"] === "high" && (
                          <View
                            style={{
                              width: 20,
                              height: 20,
                              borderRadius: 10,
                              backgroundColor: "white",
                            }}
                          />
                        )}
                      </TouchableOpacity>
                      <Text>High</Text>
                    </View>
                  </View>
                </View>

                {loading ? (
                  <ActivityIndicator style={{ marginTop: 25 }} />
                ) : (
                  <Button
                    title="SAVE"
                    backgroundColor="blue"
                    onPress={formikProps.handleSubmit}
                  />
                )}
              </View>
            );
          }}
        </Formik>

        {/* {loading ? (
          <ActivityIndicator style={{ marginTop: 25 }} />
        ) : (
          <Button title="SAVE" backgroundColor="blue" onPress={onSave} />
        )} */}
      </View>
    </View>
  );
}
