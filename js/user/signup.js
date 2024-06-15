import { database } from "../realtimedb.js";
import { usersList } from "../review_page/save_viewed_&_liked.js";
import { getDatabase, ref, set, push, onValue, get, child } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";
import { loginMessage } from "./loginMessage.js";

// -------------------------------------------------------------------------------------------

// RETURN HOME

const returnHomeBtn = document.getElementById("return-home");
returnHomeBtn.addEventListener("click", function () {
    window.location.href = "../../index.html"
})

// -------------------------------------------------------------------------------------------


// -------------------------------------------------------------------------------------------

const form = document.getElementById("form");

// get form values
const passwordInput = document.getElementById("password");
const emailInput = document.getElementById("email");
const confirmPassword = document.getElementById("confirm");

// create a new account
async function createAccount() {
    // check if password is valid
    if (passwordInput.value.length < 6) {     //requirement of firebase
        loginMessage("Password must be at least 6 characters", "error");
    }

    // check password and confirm password
    if (confirmPassword.value == passwordInput.value) {
       let isDuplicated = false;

       for(let i in usersList){
            if(usersList[i].email == emailInput.value){
                loginMessage("This email is used!","error");
                isDuplicated = true;
            } 
       }

        if (!isDuplicated) {
            // CREATE UID
            let uid = function(){
                return Date.now().toString(36) + Math.random().toString(36).substring(2);
            }

            // SAVE TO FIREBASE
            set(ref(database, "accountsList/" + usersList.length), {
                email: emailInput.value,
                password: passwordInput.value,
                uid: uid(),
                index: usersList.length
            })
            sessionStorage.setItem("uid", uid());
        
            window.location.href = "../../pages/login.html";
        }
        else{
            loginMessage("Your account is exist! Please click 'Have an account?'", "error");
        }

    }
    else {
        loginMessage("Your password and confirm password is not match! Please try again!", "error");
    }

}

form.addEventListener("submit", function (e) {
    e.preventDefault();
    createAccount();
})