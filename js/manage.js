import { database } from "./realtimedb.js";
import { userIndex } from "./review_page/save_viewed_&_liked.js";
import { getDatabase, ref, set, push, onValue, get, child } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";
import { findData } from "./review_page/save_viewed_&_liked.js";

const userList = await findData("accountsList");
const table = document.getElementById("table");

// CHANGE USER ROLE
function changeRole(elm, index){

    if(!elm.checked){
        elm.checked = false;
        alert("remove admin");
        userList[index]["role"] = 0;
    }
    else{
        elm.checked = true;
        alert("set admin");
        userList[index]["role"] = 1;
    }

    // SAVE TO FIREBASE
    set(ref(database, `accountsList/`), userList);

    if(userList[userIndex].role == 0){
        window.location.href = "../index.html";
    }
}

let cnt = 0;
for(let user of userList){
    let tr = document.createElement("tr");

    let index = document.createElement("td");
    index.innerHTML = cnt;
    cnt++;
    tr.appendChild(index);

    let email = document.createElement("td");
    email.innerHTML = user.email;
    tr.appendChild(email);

    let password = document.createElement("td");
    password.innerHTML = user.password;
    tr.appendChild(password);

    let uid = document.createElement("td");
    uid.innerHTML = user.uid;
    tr.appendChild(uid);

    let role = document.createElement("td");

    let roleChange = document.createElement("input");
    roleChange.setAttribute("type", "checkbox");

    if(user.role == 1){
        roleChange.checked = true;
    }

    roleChange.onclick = function(){
        changeRole(roleChange, (cnt-1));
    }

    role.appendChild(roleChange)
    tr.appendChild(role);

    table.appendChild(tr);
}
