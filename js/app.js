
const communeInput = document.getElementById("commune");
const districtInput = document.getElementById("district");
const provinceInput = document.getElementById("province");

const categoryContainer = document.getElementById("places");

export const apiKey = "JshXcNsFQxZQZ1zSm1A4Bgb6WBJAHo7duRPWnMwx";
export const maptileKey = "1aENZtZAdTdT1nUJFd22EnaaRbgO2jCivZkzWmcU";
export const token = "fsq3rSkSrgNY+LexFJZzIyH2wy77c0HiEz2FsnACaYFbvxc=";


// GET USER CURRENT CITY NAME
function getCurrentCityName(lat,long){
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

// move to review tab
function moveToReview(id, distance){
    sessionStorage.setItem("reviewItemID", id);
    sessionStorage.setItem("distance", distance);
    window.location.href = "../pages/direct.html";
}


// get image of location
export function getImageSrc(id,img){
    const url = `https://api.foursquare.com/v3/places/${id}/photos`;

    fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': token,
            'accept' : 'application/json'
        }
    })
    .then(res => {
        return res.json();
    })
    .then(data => {
        img.src = data[0].prefix + "original" + data[0].suffix;
    })
}

// visible them on html page
function createHTMLelements(data) {
    categoryContainer.replaceChildren();
    
    for (let res of data.results) {
        
        let div = document.createElement("div");
        div.classList.add("item-container");
        div.onclick = function(){
            moveToReview(res.fsq_id, res.distance);
        }

        let image = document.createElement("img");
        getImageSrc(res.fsq_id, image);
        div.appendChild(image);

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
        distance.innerHTML = "<b>Distance: </b>" + res.distance/1000 + " km";
        infoSide.appendChild(distance);

        let location = document.createElement("p");
        location.innerHTML = "<b>Location: </b>" + res.location.formatted_address;
        infoSide.appendChild(location);

        div.appendChild(infoSide);
        categoryContainer.appendChild(div);
    }
}

// --------------------------------------
//             MAIN API
// --------------------------------------

// search according to type in the select form
async function placeSearchToType(currentLat, currentLong, type) {
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
            console.log(data);
            createHTMLelements(data);
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
        getCurrentCityName(currentLat,currentLong);


        // CHOOSE A TYPE TAB
        const selectForm = document.getElementById("select");
        placeSearchToType(currentLat, currentLong, "coffee");

        selectForm.addEventListener("change", function () {
            placeSearchToType(currentLat, currentLong, selectForm.value);
        })
    })
}