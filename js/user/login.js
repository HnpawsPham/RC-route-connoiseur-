import "./loginMessage.js";
import "../firebaseFunctions.js";

import { loginMessage } from "./loginMessage.js";
import { usersList } from "../review_page/save_viewed_&_liked.js";

// ------------------------------------------------------------------------------------------

// RETURN HOME

const returnHomeBtn = document.getElementById("return-home");
returnHomeBtn.addEventListener("click",function(){
    window.location.href = "../../index.html"
})

// -------------------------------------------------------------------------------------------

const form = document.getElementById("form");

// get form values
const passwordInput = document.getElementById("password");
const emailInput = document.getElementById("email");


// check if user info is correct
async function checkAccount() {
    let isExist = false;
    let index;

    for(let i in usersList){
        if(usersList[i].email == emailInput.value){
            isExist = true;
            index = usersList[i].index;
        } 
    }

    if(isExist){
        sessionStorage.setItem("isLoggedIn",true);
        sessionStorage.setItem("userIndex", index);
        
        window.location.href = "../../index.html";
    }
    else{
        loginMessage("Wrong information!", "error");
        
    }
}


// CHECK ACCOUNT AFTER SUBMIT THE FORM 
form.addEventListener("submit", function (e) {
    e.preventDefault();
    checkAccount()
})
