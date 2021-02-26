// var myMap = L.map("map-id", { center: [37.0902, -95.7129], zoom: 3});
// L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//     attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
//     tileSize: 512,
//     maxZoom: 18,
//     zoomOffset: -1,
//     id: "mapbox/streets-v11",
//     accessToken: API_KEY
// }).addTo(myMap);

// d3.json("/getCoordinates").then(function(d) {
//     console.log(d);
// });


// THIS SECTION WORKS FOR EVENT LISTENING UPDATING MAP

//     var API_KEY = "pk.eyJ1Ijoid29vb3Q2NjYiLCJhIjoiY2trdTIwc2c4MG92MzJvbjB4Zmlza3ZoZiJ9.xqc3Hp7hUOiqdeQkzXhFLQ";

//   var myMap = L.map("map-id", { center: [37.0902, -95.7129], zoom: 3});
//     L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", { 
//         attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
//         tileSize: 512,
//         maxZoom: 18,
//         zoomOffset: -1,
//         id: "mapbox/streets-v11",
//         accessToken: API_KEY
//     }).addTo(myMap);



// makeMap(0, 500);

// // d3.select('#button2').on("change", function() {
// //     var value = d3.select(this).attr("value");
//     function filterdata(value) {
//         console.log(value);
// console.log(highPrice);
//     if (value === 'price099') {var lowPrice = 0; var highPrice = 100;}
//     else if (value === 'price199') {var lowPrice = 100; var highPrice = 200;}
//     else if (value === 'price299') {var lowPrice = 299; var highPrice = 10000};

//     console.log(highPrice);
//     console.log(lowPrice);
//     makeMap(lowPrice, highPrice);
//     };
// // });

// var resortLayer = L.layerGroup();
// function makeMap(thing1, thing2) {
// d3.csv("../projectSetUp/complete_resorts_info.csv").then(function(data) {
    
//     // d3.select('map-id').innerHTML = "<div id='map' style='width: 100%; height: 100%;'></div>";
//     // myMap.off();
//     console.log(data);
//     console.log('hi');
//     var marvelHeroes =  data.filter(function(resort) {
//         return ((resort.price < thing2) && (resort.price > thing1))
//     });
//     console.log(marvelHeroes)
//     resortLayer.clearLayers();
//     var resortMarkers = [];
//     marvelHeroes.forEach(resort=>{
//     // resortMarkers.push
//     resortLayer.addLayer(
//     L.marker([resort.lon, resort.lat])
//     .bindPopup("<h1>" + resort.name + "</h1>")
//   )
// //   var resortLayer = L.layerGroup(resortMarkers);
  
//   resortLayer.addTo(myMap);
 
// });

// });
// };



d3.csv("../projectSetUp/complete_resorts_info.csv").then(function(data) {

    var all_resorts = data
    var price100 =  data.filter(function(resort) {
                return ((resort.price < 100) && (resort.price > 0))
            });
     var price200 =  data.filter(function(resort) {
                return ((resort.price < 200) && (resort.price > 100))
            });    
    var price300 =  data.filter(function(resort) {
                return ((resort.price < 1000) && (resort.price > 300))
            });      
    var allMarkers = [];
        data.forEach(resort=>{
            allMarkers.push (L.marker([resort.lon, resort.lat])
        .bindPopup("<h1>" + resort.name + "</h1>"));
       
        });
        var lowMarkers = [];
        price100.forEach(resort=>{
            lowMarkers.push (L.marker([resort.lon, resort.lat])
        .bindPopup("<h1>" + resort.name + "</h1>"));
       
        });
        var medMarkers = [];
        price200.forEach(resort=>{
            medMarkers.push (L.marker([resort.lon, resort.lat])
        .bindPopup("<h1>" + resort.name + "</h1>"));
       
        });
        var highMarkers = [];
        price300.forEach(resort=>{
            highMarkers.push (L.marker([resort.lon, resort.lat])
        .bindPopup("<h1>" + resort.name + "</h1>"));
       
        });

        
        var resortLayer1 = L.layerGroup(allMarkers);
        var resortLayer2 = L.layerGroup(lowMarkers);
        var resortLayer3 = L.layerGroup(medMarkers);
        var resortLayer4 = L.layerGroup(highMarkers);


var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      tileSize: 512,
      maxZoom: 18,
      zoomOffset: -1,
      id: "mapbox/streets-v11",
      accessToken: API_KEY
    });
  

//     // Define a baseMaps object to hold our base layers
var baseMaps = {
    "Street Map": streetmap,
  //   "Dark Map": darkmap,
    // "Light Map": light
  };

  // // Create overlay object to hold our overlay layer
  var overlayMaps = {
    "All": resortLayer1,
    "<100": resortLayer2,
    "100-200": resortLayer3,
    "200+": resortLayer4,


    // "Earthquakes": earthquakeLayer
    
  };

var myMap = L.map("map-id", {
    center:  [37.7749, -122.4194],
    zoom: 5,
    layers: [streetmap, resortLayer1]
  });

  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);


});