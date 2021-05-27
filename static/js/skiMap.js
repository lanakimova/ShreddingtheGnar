let myMap = L.map('map').setView([39.8283, -98.5795], 4);

let streetMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
        accessToken: API_KEY
      }).addTo(myMap);

let allResortsLayerGroup = L.layerGroup().addTo(myMap);

d3.csv("/static/data/complete_resorts_info.csv").then(function(data) {
    data.forEach(resort => {
            
        if (resort.lon) {
            let lon = Number(resort.lon),
                lat = Number(resort.lat),
                resortName = resort.name,
                totalSlopeLen = resort.total_len,
                closestTown = resort.closestTown,
                liftTicket = resort.price;

            let popupContent = "<b style='font-size: 16px'>" + resortName + "</b><br><b>Total Slope Lenght:</b> " + totalSlopeLen
                                 + "<br><b> Lift Price:</b> $" + liftTicket + "<br><b> Closest Town:</b> " + closestTown;
            let marker = L.marker([lon, lat]).bindPopup(popupContent); 
            allResortsLayerGroup.addLayer(marker);     
        }
    });
});

let overlay = {'All Resorts': allResortsLayerGroup};
L.control.layers(null, overlay).addTo(myMap);

// create a drop down menu with all available states

let states = ['Alabama', 'Alaska', 'Arizona', 'California', 'Colorado', 'Connecticut', 'Idaho', 'Illinois', 'Indiana'
                , 'Iowa', 'Maine', 'Massachusetts', 'Michigan', 'Minnesota', 'Missouri', 'Montana', 'Nevada'
                , 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio'
                , 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Dakota', 'Tennessee', 'Utah', 'Vermont', 'Virgina'
                , 'Washington', 'West Virgina', 'Wisconsin', 'Wyoming'];

let statesDropDown = L.control({position: 'bottomleft'});
statesDropDown.onAdd = function() {
    let div = L.DomUtil.create('div', 'info legend');
    let stateString = "";
    states.forEach( function(state) { 
          stateString += `<option>${state}</option>`;
    });
    div.innerHTML = `<select id='statesMenu'>${stateString}</select>`;
    return div;
};
statesDropDown.addTo(myMap);

// get selected option
d3.select('#statesMenu').on('change', updateMap);

function updateMap(){
    let dropDownStates = d3.select('#statesMenu').node().value;
    
    d3.csv("/static/data/complete_resorts_info.csv").then(function(data) {
        data.forEach(resort => {
            if (resort.region .toLowerCase() === dropDownStates.toLowerCase() & resort.lon) {
                let lon = Number(resort.lon),
                lat = Number(resort.lat),
                resortName = resort.name,
                totalSlopeLen = resort.total_len,
                closestTown = resort.closestTown,
                liftTicket = resort.price;
                
                let popupContent = "<b style='font-size: 16px'>" + resortName + "</b><br><b>Total Slope Lenght:</b> " + totalSlopeLen
                                 + "<br><b> Lift Price:</b> $" + liftTicket + "<br><b> Closest Town:</b> " + closestTown;
                let marker = L.marker([lon, lat]).bindPopup(popupContent); 
                marker.addTo(myMap);

            }
        })
    });
}