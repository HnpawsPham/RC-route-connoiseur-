import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getDatabase,ref,set,push,onValue,get,child } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyDtFuuy_gci4W5fzYtRVc5SwYXmBJHrAtc",
    authDomain: "route-connoiseur.firebaseapp.com",
    databaseURL: "https://route-connoiseur-default-rtdb.firebaseio.com",
    projectId: "route-connoiseur",
    storageBucket: "route-connoiseur.appspot.com",
    messagingSenderId: "173035252714",
    appId: "1:173035252714:web:2a1ec64d0c6e6e21a86093",
    measurementId: "G-WG350BZQTF"
};

const firebase = initializeApp(firebaseConfig);
export const database = getDatabase(firebase);