import { token, getTopicImageSrc, moveToReview } from "../app.js";
import { destinationLat, destinationLong, data } from "./review.js";

const relevances = document.getElementById("relevances");

// visible them on html page
function createHTMLelements(data, container) {
    container.replaceChildren();

    if (data.results.length < 1) {
        let text = document.createElement("h1");
        text.innerHTML = "No result.";
        container.appendChild(text);

        return;
    }

    while(data.results.length > 0){
        // create random
        let randomIndex = Math.floor(Math.random() * data.results.length);
        let res = data.results[randomIndex];
        data.results.splice(randomIndex,1);

        // append in html
        let div = document.createElement("div");
        div.classList.add("item-container");
        div.onclick = function () {
            moveToReview(res.fsq_id, res.distance);
        }

        let image = document.createElement("img");
        getTopicImageSrc(res.fsq_id, image);
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
        location.innerHTML = "<b>Location: </b>" + res.location.formatted_address;
        infoSide.appendChild(location);

        div.appendChild(infoSide);
        container.appendChild(div);
    }   
}

// search according to type in the select form
async function placeSearchToType(type, container) {
    let param = new URLSearchParams({
        query: type,
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

placeSearchToType(data.categories[0].name, relevances)