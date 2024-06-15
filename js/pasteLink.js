import { moveToReview } from "./app.js";

const pasteField = document.getElementById("pastefield");
const pasteForm = document.getElementById("share");

pasteForm.addEventListener("submit",function(e){
    e.preventDefault();

    if(pasteField.value.length > 0){
        moveToReview(pasteField.value);
    }
})