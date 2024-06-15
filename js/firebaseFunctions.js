
// ------------------------------------------------------------------------------------------------

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js"

export const firebaseConfig = {
    apiKey: "AIzaSyDtFuuy_gci4W5fzYtRVc5SwYXmBJHrAtc",
    authDomain: "route-connoiseur.firebaseapp.com",
    databaseURL: "https://route-connoiseur-default-rtdb.firebaseio.com",
    projectId: "route-connoiseur",
    storageBucket: "route-connoiseur.appspot.com",
    messagingSenderId: "173035252714",
    appId: "1:173035252714:web:2a1ec64d0c6e6e21a86093",
    measurementId: "G-WG350BZQTF"
};

export const app = initializeApp(firebaseConfig);