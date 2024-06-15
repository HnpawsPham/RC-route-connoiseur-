import { database } from "../realtimedb.js";
import { getDatabase,ref,set,push,onValue,get,child } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

const input = document.getElementById("comment-input");
const form = document.getElementById("post-comment");
const commentContent = document.getElementById("comment-content");
const commentDate = document.getElementById("comment-date");

// FIREBASE ACTIONS

// search
async function findData(){
    let dbref = ref(database,"/comments");

    return get(dbref).then(function(snapshot) {
        if (snapshot.exists()) {
            return snapshot.val();
        } else {
            return [];
        }
    })
}
export let commentsList = await findData();

// comment index
let index;
try{
    index = Object.keys(commentsList[sessionStorage.getItem("reviewItemID")]).length;
}
catch{
    index = 0;
}

// save
function saveToStorage(content, date, id){
    set(ref(database, "comments/"+(id)+"/" + index),{
        content: content,
        date: date
    })
}


// PREVIEW COMMENT

// add date to preview comment
let date = new Date().toISOString().substring(0, 10);

try{
    commentDate.innerHTML = date;

    input.addEventListener("keypress",function(){
    commentContent.innerHTML = input.value;
})

// POST COMMENT ACTIONS

form.addEventListener("submit",function(e){
    e.preventDefault();

    index++

    saveToStorage(input.value, date, sessionStorage.getItem("reviewItemID"));

    input.value = "";
    commentContent.innerHTML = "";

    location.reload();
})
}
catch{}


