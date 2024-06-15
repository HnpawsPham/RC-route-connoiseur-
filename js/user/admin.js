import { getDatabase, ref, set, push, onValue, get, child, remove } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";
import "../firebaseFunctions.js";


export async function findData(){
    let dbref = ref(database,"/accountList");

    return get(dbref).then(function(snapshot) {
        if (snapshot.exists()) {
            return snapshot.val();
        } else {
            return [];
        }
    })
}


export function saveToStorage(name,pass,id,role){
    set(ref(database, "accountList/"+(quantity)),{
        username : name,
        pass : pass,
        id: id,
        role: role
    })
}

export function setAdmin(user,btn){
    btn.addEventListener("click", function(){
        if(user.role == 1){
            user.role = 0;
        }
        else{
            user.role = 1;
        } 
        saveToStorage(user.username, user.pass, user.id, user.role);
        location.reload();
    })
    
}

export function deleteUser(btn,user){
    btn.addEventListener("click",function(){
        accountList.splice(accountList.findIndex(elm => elm == user),1);
        
        remove(ref(database, "accountList/"+quantity))

        location.reload();
    })
}
