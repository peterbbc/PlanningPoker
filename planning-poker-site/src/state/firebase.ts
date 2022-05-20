import firebase from 'firebase/compat/app';

const firebaseConfig = {
    apiKey: "AIzaSyBifCryvnhD_pkmimbwyn5VSpZp5yR_xMQ",
    authDomain: "planning-poker-429a4.firebaseapp.com",
    databaseURL: "https://planning-poker-429a4.firebaseio.com",
    projectId: "planning-poker-429a4",
    storageBucket: "planning-poker-429a4.appspot.com",
    messagingSenderId: "733595773818",
    appId: "1:733595773818:web:9741dd87f5c8ac86a984c3",
    measurementId: "G-M7BW7N48DG"
};

export const initializeFirebase = () => {
    firebase.initializeApp(firebaseConfig);
}