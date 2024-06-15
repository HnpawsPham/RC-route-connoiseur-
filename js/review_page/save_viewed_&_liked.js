
import { database } from "../realtimedb.js";
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
export const usersList = await findData("accountsList") || [];
export const userIndex = sessionStorage.getItem("userIndex");


export let viewedList = [];
export let likedList = [];


if(JSON.parse(sessionStorage.getItem("isLoggedIn"))){
    viewedList = usersList[userIndex].viewedList;
    likedList = usersList[userIndex].likedList;
}


// save
export async function saveViewedToStorage(id) {
    if (JSON.parse(sessionStorage.getItem("isLoggedIn"))) {
        
        if(!usersList[userIndex].viewedList){
            usersList[userIndex]["viewedList"]=[];
        }
        
        usersList[userIndex].viewedList.push(id);

        // SAVE TO FIREBASE
        set(ref(database, `accountsList/`), usersList)
    }
}

export async function saveLikedToStorage(id) {
    if (JSON.parse(sessionStorage.getItem("isLoggedIn"))) {

        if(!usersList[userIndex].likedList){
            usersList[userIndex]["likedList"]=[];
        }
        
        usersList[userIndex].likedList.push(id);

        // SAVE TO FIREBASE
        set(ref(database, "accountsList/"), usersList)
    }
}


// CHECK LIKED WHILE LOADING
export function checkLiked(id, elm) {
    if(JSON.parse(sessionStorage.getItem("isLoggedIn"))){
        for (let i in likedList) {
            if (likedList[i] == id) {
                elm.classList.add("fill-heart");
            }
        }
    }
}