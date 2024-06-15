
import { database } from "./realtimedb.js";
import { getDatabase, ref, set, push, onValue, get, child } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

// FIREBASE ACTIONS


// search
export async function findData(name) {
    let dbref = ref(database, "/" + name);

    return get(dbref).then(function (snapshot) {
        if (snapshot.exists()) {
            return snapshot.val();
        } else {
            return [];
        }
    })
}

export const heartLibrary = await findData("heartLibrary") || [];

export async function saveLikedToLibrary(heartLibrary) {
    if (JSON.parse(sessionStorage.getItem("isLoggedIn"))) {
        // SAVE TO FIREBASE
        set(ref(database, `heartLibrary/`), heartLibrary)
    }
}
