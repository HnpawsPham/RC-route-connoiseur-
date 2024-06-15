import { getTopicImageSrc, apiKey, maptileKey, token } from "../app.js";

// CONTAINER VARIABLES
const reviewImage = document.getElementById("review-img");
const container = document.getElementById("container");
const previewImg = document.getElementById("preview-img");

const reviewItemID = sessionStorage.getItem("reviewItemID");

// RETURN HOME BUTTON FOR DIRECT.HTML

const returnHomeBtn = document.getElementById("return-home");

returnHomeBtn.addEventListener("click", function () {
    window.location.href = "../index.html";
})

// ----------------------------------------------------------------------------------------------------------

// GET API---------------------------------------------------------------------------------------------------
const url = `https://api.foursquare.com/v3/places/${reviewItemID}`;

export const data = await fetch(url, {
    method: 'GET',
    headers: {
        'Authorization': token,
        'accept': 'application/json'
    }
}).then(res => {
    return res.json();
})
.then(data => {
    return data;
})


// get destination lat and long
export const destinationLat = data.geocodes.main.latitude;
export const destinationLong = data.geocodes.main.longitude;

// LOAD IMAGE OF CHOSEN DESTINATION

function getImagesSrc(id) {
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

            for (let i = 0; i < data.length; i++) {

                try {

                    let img = document.createElement("img");
                    img.src = data[i].prefix + "original" + data[i].suffix;

                    img.onclick = function(){
                        reviewImage.src = img.src;
                    }

                    previewImg.appendChild(img);

                    sessionStorage.setItem("imgSrc", img.src);
                }
                catch (err) {
                    img.src = "https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg?w=360";
                }
            }
        })
}

// ----------------------------------------------------------------------------------------------------------

getTopicImageSrc(data.fsq_id, reviewImage)
getImagesSrc(data.fsq_id);



