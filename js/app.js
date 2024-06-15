import "./firebaseFunctions.js";
import { database } from "./realtimedb.js";
import { loginMessage } from "./user/loginMessage.js";
import { saveViewedToStorage, saveLikedToStorage, checkLiked, usersList } from "./review_page/save_viewed_&_liked.js";
import { getDatabase, ref, set, push, onValue, get, child } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";
import { heartLibrary, saveLikedToLibrary } from "./heartShow.js";

// ---------------------------------------------------------------------------------------------

// CHECK USER ----------------------------------------------------------------------------------
let isLoggedIn = JSON.parse(sessionStorage.getItem("isLoggedIn")) || false;
let userIndex = JSON.parse(sessionStorage.getItem("userIndex"));


if (isLoggedIn) {
    try {
        loginMessage("Welcome back, " + usersList[userIndex].email ,"success");
        const accountBtn = document.getElementById("account");
        accountBtn.innerHTML = `<a href="../pages/profile.html" ><span class="material-symbols-outlined">person</span></a>`;
    
        if(usersList[userIndex].role == 1){
            const manageTab = document.getElementById("manage-tab");
            manageTab.classList.remove("need-permission");
            document.querySelector("ul").style.width = "55%";
        }
    }
    catch (err) { }
}
// ---------------------------------------------------------------------------------------------
const communeInput = document.getElementById("commune");
const districtInput = document.getElementById("district");
const provinceInput = document.getElementById("province");

const categoryContainer = document.getElementById("places");

export const apiKey = "JshXcNsFQxZQZ1zSm1A4Bgb6WBJAHo7duRPWnMwx";
export const maptileKey = "1aENZtZAdTdT1nUJFd22EnaaRbgO2jCivZkzWmcU";
export const token = "fsq3rSkSrgNY+LexFJZzIyH2wy77c0HiEz2FsnACaYFbvxc=";


// GET USER CURRENT CITY NAME
function getCurrentCityName(lat, long) {
    const url = `https://rsapi.goong.io/Geocode?latlng=${lat},${long}&api_key=${apiKey}`

    fetch(url).then(res => {
        return res.json();
    })
        .then(data => {
            getCurrentLocationCompounds(data);
        })
}

function getCurrentLocationCompounds(data) {
    communeInput.value = data.results[0].compound.commune;
    districtInput.value = data.results[0].compound.district;
    provinceInput.value = data.results[0].compound.province;
}

// DISPLAY HTML ELEMENTS

// MOVE TO REVIEW --------------------------------  
export function moveToReview(id) {
    sessionStorage.setItem("reviewItemID", id);
    saveViewedToStorage(id);
    window.location.href = "../pages/direct.html";
}
// ------------------------------------------------  



// get image of location
export function getTopicImageSrc(id, img) {
    const url = `https://api.foursquare.com/v3/places/${id}/photos`;

    fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': token,
            'accept': 'application/json'
        }
    })
        .then(res => {
            return res.json();
        })
        .then(data => {
            try {
                img.src = data[0].prefix + "original" + data[0].suffix;
            }
            catch (err) {
                img.src = "https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg?w=360";
            }
        })
}


// visible them on html page
export function createHTMLelements(data, container) {
    container.replaceChildren();

    if (data.results.length < 1) {
        let text = document.createElement("h1");
        text.innerHTML = "No result.";
        container.appendChild(text);

        return;
    }

    for (let res of data.results) {

        let div = document.createElement("div");
        div.classList.add("item-container");

        let image = document.createElement("img");
        getTopicImageSrc(res.fsq_id, image);

        image.onclick = function () {
            moveToReview(res.fsq_id, res.distance);
        }

        div.appendChild(image);

        let infoSide = document.createElement("div");
        infoSide.classList.add("info-side");

        let name = document.createElement("p");
        name.innerHTML = "<b>Name: </b>" + res.name;
        infoSide.appendChild(name);

        // connect types together
        let typestring = [];
        for (let type of res.categories) {
            typestring.push(type.name);
        }

        let types = document.createElement("p");
        types.innerHTML = "<b>Types: </b>" + typestring;
        infoSide.appendChild(types);

        let distance = document.createElement("p");
        distance.innerHTML = "<b>Distance: </b>" + res.distance / 1000 + " km";
        infoSide.appendChild(distance);

        let location = document.createElement("p");

        if (res.location.formatted_address.length <= 50) {
            location.innerHTML = "<b>Location: </b>" + res.location.formatted_address;
        }
        else {
            location.innerHTML = "<b>Location: </b>" + res.location.formatted_address.substring(0, 50) + "...";
        }

        infoSide.appendChild(location);

        // add heart quantity to database
        heartLibrary[`${res.fsq_id}`] = heartLibrary[`${res.fsq_id}`] || 0;
        set(ref(database, `heartLibrary/`), heartLibrary)
 

        let heart = document.createElement("span");
        heart.innerHTML = "favorite";
        heart.classList.add("material-symbols-outlined", "favorite-btn");
        checkLiked(res.fsq_id, heart);

        let numberofhearts = document.createElement("span");
        numberofhearts.innerHTML = heartLibrary[`${res.fsq_id}`];
        numberofhearts.classList.add("number-of-hearts");

        heart.onclick = function () {
            if(!heart.classList.contains("fill-heart")){
                heart.classList.add("fill-heart");
                saveLikedToStorage(res.fsq_id);
    
                heartLibrary[`${res.fsq_id}`]+=1;
                saveLikedToLibrary(heartLibrary);
                numberofhearts.innerHTML = heartLibrary[`${res.fsq_id}`];
            }
            else{
                heart.classList.remove("fill-heart");
                // remove from user liked list
                for(let i in usersList[userIndex].likedList){
                    if(usersList[userIndex].likedList[i] == res.fsq_id){
                        usersList[userIndex].likedList.splice(i,1);
                        set(ref(database, `accountsList/`), usersList);
                        break;
                    }
                }

                // remove like from database
                if(heartLibrary[`${res.fsq_id}`] > 0){
                    heartLibrary[`${res.fsq_id}`]-=1;
                }
                
                saveLikedToLibrary(heartLibrary);
                numberofhearts.innerHTML = heartLibrary[`${res.fsq_id}`];
            }
        }

        infoSide.appendChild(heart);
        infoSide.appendChild(numberofhearts);

        div.appendChild(infoSide);
        container.appendChild(div);
    }
}

// --------------------------------------
//             MAIN API
// --------------------------------------

// search according to type in the select form
export async function placeSearchToType(currentLat, currentLong, type, container) {
    let param = new URLSearchParams({
        query: type,
        ll: `${currentLat},${currentLong}`,
        open_now: 'true',
        sort: 'DISTANCE'
    });

    fetch(`https://api.foursquare.com/v3/places/search?${param}`, {
        method: 'GET',
        headers: {
            'Authorization': token,
        }
    })
        .then(res => {
            return res.json();
        })
        .then(data => {
            createHTMLelements(data, container);
        })
}

// --------------------------------------

// TRACK USER LOCATION
if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(pos => {
        const currentLat = pos.coords.latitude;
        const currentLong = pos.coords.longitude;


        // SET MAP
        goongjs.accessToken = '1aENZtZAdTdT1nUJFd22EnaaRbgO2jCivZkzWmcU';
        try {
            let map = new goongjs.Map({
                container: 'map',
                style: 'https://tiles.goong.io/assets/goong_map_web.json',
                center: [currentLong, currentLat],
                zoom: 13,
                maxPitch: 60,
                maxZoom: 22
            });

            // SET USER MARKER
            let marker = new goongjs.Marker()
                .setLngLat([currentLong, currentLat])
                .addTo(map);

            // MOST POPULAR DESTINATIONS AROUND TAB
            getCurrentCityName(currentLat, currentLong);


            // CHOOSE A TYPE TAB
            const selectForm = document.getElementById("select");
            placeSearchToType(currentLat, currentLong, "coffee", categoryContainer);

            selectForm.addEventListener("change", function () {
                placeSearchToType(currentLat, currentLong, selectForm.value, categoryContainer);
            })
        }
        catch { }
    })
}
