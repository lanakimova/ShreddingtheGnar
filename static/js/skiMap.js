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
                'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];


let statesDropDown = L.control({position: 'topright'});
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

    fetch('/static/data/us_states.json').then(response => {
        return response.json();
    }).then(data => {
        let features = data.features;
    
        features.forEach(feature => {
            if (feature.properties.name === dropDownStates){
                let statePoly = L.geoJSON(feature).addTo(myMap);
                let poly = [];
                if (feature.geometry.type === 'Polygon') {
                    poly = feature.geometry.coordinates[0];
                };

                if (feature.geometry.type === 'MultiPolygon'){
                    poly = feature.geometry.coordinates[0][0]
                };
                myMap.fitBounds(statePoly.getBounds());
                
                d3.csv("/static/data/complete_resorts_info.csv").then(function(data) {
                    data.forEach(resort => {
                        if (resort.lon) {
                            let lon = Number(resort.lon),
                                lat = Number(resort.lat);
                            let marker = L.marker([lon, lat]);
                            if (isMarkerInsidePolygon(marker, poly)) {
                                let resortName = resort.name,
                                    totalSlopeLen = resort.total_len,
                                    closestTown = resort.closest_town,
                                    liftTicket = resort.price;

                                let popupContent = "<b style='font-size: 16px'>" + resortName + "</b><br><b>Total Slope Lenght:</b> " + totalSlopeLen
                                                    + "<br><b> Lift Price:</b> $" + liftTicket + "<br><b> Closest Town:</b> " + closestTown;
                                marker.addTo(myMap).bindPopup(popupContent);
                            };
                        };
                    });
                });
            }; 
        });
    });   
};
    

function isMarkerInsidePolygon(marker, poly) {
    var inside = false;

    var x = marker.getLatLng().lat, y = marker.getLatLng().lng;

    for (let i=0; i < poly.length-1; i++){
        let xi = poly[i][1], yi = poly[i][0];
        let xj = poly[i+1][1], yj = poly[i+1][0];
        var intersect = ((yi > y) != (yj > y))
                && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
    }
    return inside;
};