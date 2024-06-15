
// ADD MORE INFORMATION OF CHOSEN DESTINATION
export function loadMoreInfo(data) {
    let div = document.createElement("div");
    div.classList.add("info-side")

    let distance = document.createElement("p");
    distance.innerHTML = "<b>Distance:&ensp; </b>" + data.routes[0].legs[0].distance.text;
    div.appendChild(distance);

    let duration = document.createElement("p");
    duration.innerHTML = "<b>Duration:&ensp; </b>" + data.routes[0].legs[0].duration.text + "<br><br>";
    div.appendChild(duration);

    let startPosition = document.createElement("p");
    startPosition.innerHTML = "<b>From:&ensp; </b>" + data.routes[0].legs[0].start_address;
    div.appendChild(startPosition);

    let endPosition = document.createElement("p");
    endPosition.innerHTML = "<b>To:&ensp; </b>" + data.routes[0].legs[0].end_address;
    div.appendChild(endPosition);

    container.appendChild(div);
}

// DRAW PATH ON MAP
export function drawPath(currentLat, currentLong, destinationLat, destinationLong, apiKey) {
    goongjs.accessToken = '1aENZtZAdTdT1nUJFd22EnaaRbgO2jCivZkzWmcU';

    var map = new goongjs.Map({
    container: 'container',
    style: 'https://tiles.goong.io/assets/goong_map_web.json',
    center: [currentLong, currentLat],
    zoom: 12
    });

    map.on('load', function () {
        let layers = map.getStyle().layers;

        // Find the index of the first symbol layer in the map style
        let firstSymbolId;

        for (var i = 0; i < layers.length; i++) {
            if (layers[i].type === 'symbol') {
                firstSymbolId = layers[i].id;
                break;
            }
        }

        // Initialize goongClient with an API KEY
        let goongClient = goongSdk({
            accessToken: apiKey
        });
        // Get Directions
        goongClient.directions
            .getDirections({
                origin: `${currentLat},${currentLong}`,
                destination: `${destinationLat},${destinationLong}`,
                vehicle: 'car'
            })
            .send()
            .then(function (response) {
                var directions = response.body;
                var route = directions.routes[0];

                var geometry_string = route.overview_polyline.points;
                var geoJSON = polyline.toGeoJSON(geometry_string);
                map.addSource('route', {
                    'type': 'geojson',
                    'data': geoJSON
                });
                // Add route layer below symbol layers
                map.addLayer(
                    {
                        'id': 'route',
                        'type': 'line',
                        'source': 'route',
                        'layout': {
                            'line-join': 'round',
                            'line-cap': 'round'
                        },
                        'paint': {
                            'line-color': '#1e88e5',
                            'line-width': 8
                        }
                    },
                    firstSymbolId
                );
            });
    });
}

export function getPlaceDetails(currentLat, currentLong, destinationLat, destinationLong, apiKey, token){
    const url = `https://rsapi.goong.io/Direction?origin=${currentLat},${currentLong}&destination=${destinationLat},${destinationLong}&vehicle=car&api_key=${apiKey}`;

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
            loadMoreInfo(data);
        })
}

