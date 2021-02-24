// var myMap = L.map("map-id", { center: [37.0902, -95.7129], zoom: 3});
// L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//     attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
//     tileSize: 512,
//     maxZoom: 18,
//     zoomOffset: -1,
//     id: "mapbox/streets-v11",
//     accessToken: API_KEY
// }).addTo(myMap);

d3.json("/getCoordinates").then(function(d) {
    console.log(d);
})
