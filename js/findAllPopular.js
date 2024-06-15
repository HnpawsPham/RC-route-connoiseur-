import { token,createHTMLelements, moveToReview } from "./app.js";

// DISPLAY HTML ELEMENTS
const container = document.getElementById("popular-places");

// TRACK USER LOCATION
if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(pos => {
        const currentLat = pos.coords.latitude;
        const currentLong = pos.coords.longitude;

        const param = new URLSearchParams({
            sort: 'DISTANCE',
            ll: `${currentLat},${currentLong}`
        })

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
                createHTMLelements(data,container);
            })
    })
}

