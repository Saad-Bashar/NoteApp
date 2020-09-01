import * as firebase from "firebase";
import "@firebase/auth";
import "@firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBF00DTY6Ja2oaxrnM0o4rz3rt6qDNvQDg",
  authDomain: "noteapp-c25f4.firebaseapp.com",
  databaseURL: "https://noteapp-c25f4.firebaseio.com",
  projectId: "noteapp-c25f4",
  storageBucket: "noteapp-c25f4.appspot.com",
  messagingSenderId: "882033483172",
  appId: "1:882033483172:web:c959d1f6b73761c70eb531",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { firebase };
