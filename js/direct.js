const returnHomeBtn = document.getElementById("return-home");

returnHomeBtn.addEventListener("click",function(){
    window.location.href = "../index.html";
})

import { getImageSrc, apiKey, maptileKey, token } from "./app.js";
import { getPlaceTips } from "./installComments.js";

const reviewImage = document.getElementById("review-img");
export const container = document.getElementById("container");

const reviewItemID= sessionStorage.getItem("reviewItemID");

// GET API---------------------------------------------------------------------------------
const url = `https://api.foursquare.com/v3/places/${reviewItemID}`;

let data = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': token,
            'accept' : 'application/json'
        }
        }).then(res => {
            return res.json();
        })
        .then(data => {
            return data;
        })

console.log(data);

// CUSTOM HTML ELEMENTS-------------------------------------------------------------------
const optionTab = document.getElementById("option");
const choices = optionTab.querySelectorAll("li");

choices[0].classList.add("is-choosing");

for(let choice of choices){
    choice.addEventListener("click",function(){
        setChoosing(choice);
    })
}

// set choosing
function setChoosing(pressed){
    for(let choice of choices){
        try{
            choice.classList.remove("is-choosing");
        }
        catch{
        }
    }

    pressed.classList.add("is-choosing");

    if(pressed.id == "directmap"){
        loadReviewItempMap(data);
    }
    else if(pressed.id == "info"){
        loadInfo(data);
    }
    else if(pressed.id == "reviews"){
        getPlaceTips(data.fsq_id);
    }
}

// INSTALL HTML ELEMENTS-------------------------------------------------------------------
loadInfo(data);

// LOAD IMAGE OF CHOSEN DESTINATION
getImageSrc(data.fsq_id,reviewImage);

// LOAD CHOSEN DESTINATION INFORMATION
function loadInfo(res){
    container.replaceChildren();

    let infoSide = document.createElement("div");
    infoSide.classList.add("info-side");

    let name = document.createElement("p");
    name.innerHTML = "<b>Name: </b>" + res.name;
    infoSide.appendChild(name);

    // connect types together
    let typestring = [];
    for(let type of res.categories){
        typestring.push(type.name);
    }

    let types = document.createElement("p");
    types.innerHTML = "<b>Types: </b>" + typestring;
    infoSide.appendChild(types);

    let distance = document.createElement("p");
    distance.innerHTML = "<b>Distance: </b>" + parseInt(sessionStorage.getItem("distance"))/1000 + " km";
    infoSide.appendChild(distance);

    let location = document.createElement("p");
    location.innerHTML = "<b>Location: </b>" + res.location.formatted_address;
    infoSide.appendChild(location);

    let iconContainer = document.createElement("div");
    iconContainer.classList.add("icon-container");
    
    for(let category of res.categories){
        let icon = document.createElement("img");
        icon.src = category.icon.prefix + 64 + category.icon.suffix;

        iconContainer.appendChild(icon);
    }
   
    infoSide.appendChild(iconContainer);

    container.appendChild(infoSide);

 
}

// LOAD MAP OF CHOSEN DESTINATION
function loadReviewItempMap(res){
    container.replaceChildren();

    let mapContainer = document.createElement("div");
    mapContainer.id = res.fsq_id;
    mapContainer.classList.add("map-container");
    container.appendChild(mapContainer)


   // create map
   goongjs.accessToken = '1aENZtZAdTdT1nUJFd22EnaaRbgO2jCivZkzWmcU';

   let map = new goongjs.Map({
       container: res.fsq_id,
       style: 'https://tiles.goong.io/assets/goong_map_web.json',
       center: [res.geocodes.main.longitude, res.geocodes.main.latitude],
       zoom: 13,
       maxPitch: 60,
       maxZoom: 22
   });

   let marker = new goongjs.Marker()
       .setLngLat([res.geocodes.main.longitude, res.geocodes.main.latitude])
       .addTo(map);
}

// MAIN-------------------------------------------------------------------------------------------
if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(pos => {
        const currentLat = pos.coords.latitude;
        const currentLong = pos.coords.longitude;
    })
}