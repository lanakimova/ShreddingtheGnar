

var allPrice = []; 
d3.json(`/getCoordinates/${'All States'}`).then(function(coord) {
    for (i=0; i < coord['lat'].length; i++) {
        var mrk = L.marker([coord['lon'][i], coord['lat'][i]]);
        allPrice.push(mrk);
    }; 
    // return allPrice;
});

// price between $0 - $100
var priceMinRange = [];
d3.json(`/getResortByPriceRange/${0}/${100}`).then(function(coord) { 
    for (i=0; i < coord['lat'].length; i++) {
        var mrk = L.marker([coord['lon'][i], coord['lat'][i]]);
        priceMinRange.push(mrk);
    };
});


var priceMediumRange = [] 
d3.json(`/getResortByPriceRange/${100}/${200}`).then(function(coord) {
    for (i=0; i < coord['lat'].length; i++) {
        var mrk = L.marker([coord['lon'][i], coord['lat'][i]]);
        priceMediumRange.push(mrk);
    }; 
});

var priceHighRange = [];
d3.json(`/getResortByPriceRange/${200}/${1000}`).then(function(coord) {
    for (i=0; i < coord['lat'].length; i++) {
        var mrk = L.marker([coord['lon'][i], coord['lat'][i]]);
        priceHighRange.push(mrk);
    }; 
});

var resLayer1 = L.layerGroup(allPrice);
var resLayer2 = L.layerGroup(priceMinRange);
var resLayer3 = L.layerGroup(priceMediumRange);
var resLayer4 = L.layerGroup(priceHighRange);

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
    "All": resLayer1,
    "<100": resLayer2,
    "100-200": resLayer3,
    "200+": resLayer4,
  };   

  var myMap = L.map("map-id", {
    center:  [37.7749, -122.4194],
    zoom: 5,
    layers: [streetmap, resLayer1]
  });

  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);


d3.select("#selectState").on("change", applyMarkers);

function applyMarkers() {  
    let showAll = 'All States';
    let dropDownState = d3.select('#selectState').node().value;

    if (dropDownState === showAll) {

    }
    else {
        d3.json(`/getResortsNameByState/${dropDownState}`).then(function(d) {
            d.forEach(element => {
                geo = d3.json(`/getCoordinates/${element}`).then(function(data) {
                    L.marker([data['lon'], data['lat']]).addTo(myMap)

                });
            });
            
        });
    };

}
// d3.json('/getCoordinates/Vail').then(function(data) {
    
//     console.log(data)

