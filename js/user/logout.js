const logOutBtn = document.getElementById("log-out");
const returnHomeBtn = document.getElementById("return-home");

// LOG OUT
logOutBtn.addEventListener("click",function(){
    sessionStorage.setItem("isLoggedIn",false);
    window.location.href = "../../index.html";
})


// RETURN HOME
returnHomeBtn.addEventListener("click",function(){
    window.location.href = "../../index.html";
})
   