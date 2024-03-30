import { token } from "./app.js";
import { container } from "./direct.js";

// GET DATA FROM API
export function getPlaceTips(id){
    const url = `https://api.foursquare.com/v3/places/${id}/tips`;

    fetch(url,{
        method : 'GET',
        headers: {
            'Authorization': token,
            'accept' : 'application/json'
        }
    }).then(res => {
        return res.json();
    })
    .then(data => {
        loadComments(data)
    })
}

// LOAD HTML ELEMENTS
function loadComments(data){
    container.replaceChildren();

    for(let res of data){
        let div = document.createElement("div");
        div.classList.add("comment-container");

        let text = document.createElement("p");
        text.innerHTML = res.text;
        div.appendChild(text);

        let time = document.createElement("i");
        time.innerHTML = res.created_at.slice(0,10);
        div.appendChild(time);

        container.appendChild(div);
    }
}
