import { viewedList, likedList } from "../review_page/save_viewed_&_liked.js";
import { moveToReview, token } from "../app.js";

const history = document.getElementById("history");
const liked = document.getElementById("liked");

async function createHTMLelements(list, parent) {
    parent.replaceChildren();
    for (let id of list) {
        // get image -----------------------------------------------------
        let imgURL = `https://api.foursquare.com/v3/places/${id}/photos`;

        let source = await fetch(imgURL, {
            method: 'GET',
            headers: {
                'Authorization': token,
                'accept': 'application/json'
            }
        }).then(res => {
            return res.json();
        })
            .then(data => {
                return data[0].prefix + "original" + data[0].suffix;
            })
        // ----------------------------------------------------------------

        // get details ----------------------------------------------------
        let detailURL = `https://api.foursquare.com/v3/places/${id}`;

        let data = await fetch(detailURL, {
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
        // ----------------------------------------------------------------

        // get types -------------------------------------------------------

        // connect types together
        let typestring = [];
        for (let type of data.categories) {
            typestring.push(type.name);
        }

        let types = "" + typestring;

        // ----------------------------------------------------------------
        
        // HMTL
        let div = document.createElement("div");
        div.classList.add("container");
        div.onclick = function () {
            moveToReview(id)
        }

        let img = document.createElement("img");
        img.src = source;
        div.appendChild(img);

        let text = document.createElement("div");
        text.classList.add("text");

        let name = document.createElement("p");
        name.innerHTML = data.name;
        text.appendChild(name);

        let typesText = document.createElement("u");
        typesText.innerHTML = types;
        text.appendChild(typesText);

        div.appendChild(text);

        parent.appendChild(div);
    }

    let br = document.createElement("br");
    parent.appendChild(br);
}

createHTMLelements(viewedList.reverse(), history);
createHTMLelements(likedList.reverse(), liked);



