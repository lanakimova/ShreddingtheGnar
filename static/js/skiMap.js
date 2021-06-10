let myMap = L.map('map').setView([39.8283, -98.5795], 4);

let streetMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
        accessToken: API_KEY
      }).addTo(myMap);

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
            // allResortsLayerGroup.addLayer(marker);     
        }
    });
});

// create a drop down menu with all available states

let states =  ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia',
                'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 
                'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
                'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 
                'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming']


let statesDropDown = L.control({position: 'topright'});
statesDropDown.onAdd = function() {
    
    let div = L.DomUtil.create('div', 'info legend');
    let stateString = "";
    
    states.forEach( function(state) { 
          stateString += `<option>${state}</option>`;
    });
    div.innerHTML = `<select id='statesMenu'>${stateString}</select>`;
    console.log(div);
    return div;
    
};
statesDropDown.addTo(myMap);

// get selected option
d3.select('#statesMenu').on('change', updateMap);

function updateMap(){
    let dropDownStates = d3.select('#statesMenu').node().value;

    let stateCoordinates = [];

    d3.json('/static/data/us_states.json').then(function(d) {
        let features = d.features;
        features.forEach(feature => {
            if (feature.properties.name === dropDownStates) {
                coordinates = feature.geometry.coordinates;
                for (let i=0; i < coordinates[0].length; i++) {
                    let lat = coordinates[0][i][1];
                    let lng = coordinates[0][i][0];
                    stateCoordinates.push([lat, lng]);
                };               
            };
        });
    });
    console.log(stateCoordinates);
    let polygon = L.polygon(stateCoordinates, {color: 'red'});
    polygon.addTo(myMap);
    // myMap.fitBounds(polygon.getBounds());
    
    d3.csv("/static/data/complete_resorts_info.csv").then(function(data) {
        data.forEach(resort => {
            if (resort.region.toLowerCase() === dropDownStates.toLowerCase() & resort.lon) {
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
        });
    });
}