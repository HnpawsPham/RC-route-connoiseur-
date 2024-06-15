// OUTSIDE VALUES, FUNCTIONS
import { apiKey, token } from "../app.js";
import { destinationLat, destinationLong, data } from "./review.js";
import { getPlaceDetails, drawPath, loadMoreInfo } from "./direct.js";
import { getPlaceTips } from "./installComments.js";
import { checkLiked, saveLikedToStorage } from "./save_viewed_&_liked.js";

// CUSTOM HTML ELEMENTS-------------------------------------------------------------------
const optionTab = document.getElementById("option");
const choices = optionTab.querySelectorAll("li");

const container = document.getElementById("container");

choices[0].classList.add("is-choosing");

for (let choice of choices) {
    choice.addEventListener("click", function () {
        setChoosing(choice);
    })
}

// set choosing
function setChoosing(pressed) {
    for (let choice of choices) {
        try {
            choice.classList.remove("is-choosing");
        }
        catch {
        }
    }

    pressed.classList.add("is-choosing");

    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(pos => {
            const currentLat = pos.coords.latitude;
            const currentLong = pos.coords.longitude;

            if (pressed.id == "directmap") {
                loadReviewItempMap(data, currentLat, currentLong)
            }
            else if (pressed.id == "info") {
                loadInfo(data);
                getPlaceDetails(currentLat, currentLong, destinationLat, destinationLong, apiKey, token);
            }
            else if (pressed.id == "reviews") {
                getPlaceTips(data.fsq_id);
            }
        })
    }
}


// LOAD CHOSEN DESTINATION INFORMATION
function loadInfo(res) {
    container.replaceChildren();

    let infoSide = document.createElement("div");
    infoSide.classList.add("info-side");

    let name = document.createElement("p");
    name.innerHTML = "<b>Name:&ensp; </b>" + res.name;
    infoSide.appendChild(name);

    // connect types together
    let typestring = [];
    for (let type of res.categories) {
        typestring.push(type.name);
    }

    let types = document.createElement("p");
    types.innerHTML = "<b>Types:&ensp; </b>" + typestring;
    infoSide.appendChild(types);

    let location = document.createElement("p");
    location.innerHTML = "<b>Location:&ensp; </b>" + res.location.formatted_address;
    infoSide.appendChild(location);

    let iconContainer = document.createElement("div");
    iconContainer.classList.add("icon-container");

    for (let category of res.categories) {
        let icon = document.createElement("img");
        icon.src = category.icon.prefix + 64 + category.icon.suffix;

        iconContainer.appendChild(icon);
    }
    infoSide.appendChild(iconContainer);

    // COPY LINK TO SHARE ------------------------------
    let copyID = document.createElement("form");
    copyID.classList.add("copy-id");

    let copybtn = document.createElement('input');
    copybtn.type = "button"
    copybtn.value = "Copy ID";

    let idfield = document.createElement("input");
    idfield.value = data.fsq_id;

    copybtn.onclick = function(){
        copyToClipboard(idfield);
    }

    copyID.appendChild(copybtn);
    copyID.appendChild(idfield);

    infoSide.appendChild(copyID);
    // -------------------------------------------------

    let heart = document.createElement("span");
    heart.innerHTML = "favorite";
    heart.classList.add("favorite-btn", "material-symbols-outlined");
    
    checkLiked(res.fsq_id,heart);

    heart.onclick = function(){
        heart.classList.add("fill-heart");
        saveLikedToStorage(res.fsq_id);
    }
    infoSide.appendChild(heart);

    container.appendChild(infoSide);
}

// LOAD MAP OF CHOSEN DESTINATION

function loadReviewItempMap(res, currentLat, currentLong) {
    container.replaceChildren();

    drawPath(currentLat, currentLong, destinationLat, destinationLong, apiKey);
}


// INSTALL HTML ELEMENTS-------------------------------------------------------------------
loadInfo(data);

// GET INFO IF USER LOCATION IS TURNED ON
if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(pos => {
        const currentLat = pos.coords.latitude;
        const currentLong = pos.coords.longitude;

        getPlaceDetails(currentLat, currentLong, destinationLat, destinationLong, apiKey, token);
    })
}

// COPY TO CLIPBOARD
function copyToClipboard(elm){
    elm.select();
    elm.setSelectionRange(0,99999);

    navigator.clipboard.writeText(elm.value);
    alert("Copied!");
}