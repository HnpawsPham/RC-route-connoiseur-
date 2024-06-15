// FROM DATABASE (USERS POSTED) ---------------------------------------------------------------------------

import { commentsList } from "./post_comment.js";

// --------------------------------------------------------------------------------------------------------


// API (AVAILABLE COMMENTS)--------------------------------------------------------------------------------

import { token } from "../app.js";

const container = document.getElementById("container");

// GET COMMENTS DATA FROM API
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
        loadComments(data);
    })
}

// LOAD HTML ELEMENTS
export function loadComments(data){
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

    let moreComments = commentsList[sessionStorage.getItem("reviewItemID")];

    for(let i in moreComments){
        console.log(moreComments[i])
        let div = document.createElement("div");
        div.classList.add("comment-container");

        let text = document.createElement("p");
        text.innerHTML = moreComments[i].content;
        div.appendChild(text);

        let time = document.createElement("i");
        time.innerHTML = moreComments[i].date;
        div.appendChild(time);

        container.appendChild(div);
    }
}

// --------------------------------------------------------------------------------------------------------