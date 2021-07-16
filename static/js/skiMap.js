let myMap = L.map('map').setView([39.8283, -98.5795], 4);

let streetMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
        accessToken: API_KEY
      }).addTo(myMap);


function showAllResorts() {
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
                let marker = L.marker([lon, lat]).bindPopup(popupContent).addTo(myMap);      
            }
        });
    });
};

// create a drop down menu with all available states

let states =  ['All States', 'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia',
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

// lisener for selected option
d3.select('#statesMenu').on('change', updateMap);

function updateMap(){
    // get value from dropdown
    let dropDownStates = d3.select('#statesMenu').node().value;

    //  remove previous layer with markers
    let stateMarkers = L.layerGroup();
    myMap.eachLayer(function(layer) { if (layer != streetMap) { myMap.removeLayer(layer) }});

    if (dropDownStates != 'All States') {
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
                        let markers = [];
                        let resortNames = [],
                            liftPrice = [],
                            slopesLen = [];
    
                        data.forEach(resort => {
                            if (resort.lon) {
                                let lon = Number(resort.lon),
                                    lat = Number(resort.lat);
                                let marker = L.marker([lon, lat]).addEventListener('click', markerOnClick);
                                if (isMarkerInsidePolygon(marker, poly)) {
    
                                    let rName = resort.name,
                                        totalSlopeLen = resort.total_len,
                                        closestTown = resort.closest_town,
                                        liftTicket = resort.price;
    
                                    if (liftTicket) {
                                        resortNames.push(rName);
                                        liftPrice.push(liftTicket);
                                        slopesLen.push(totalSlopeLen);
                                    }
    
                                    let popupContent = "<b style='font-size: 16px'>" + rName + "</b><br><b>Total Slope Lenght:</b> " + totalSlopeLen
                                                        + "<br><b> Lift Price:</b> $" + liftTicket + "<br><b> Closest Town:</b> " + closestTown;
                                    
                                    markers.push(marker.bindPopup(popupContent));
                                    stateMarkers = L.layerGroup(markers).addTo(myMap);                           
                                };
                            };
                        });
    
                        if (markers.length > 0) {
                            if (document.getElementById('priceChart')) {
                                document.getElementById('priceChart').remove();
                            };
    
                            if (document.getElementById('slopeChart')) {
                                document.getElementById('slopeChart').remove();
                            };
                            document.getElementById('price').insertAdjacentHTML('afterend', 
                                        `<div id='priceChart'></div>`);
                            
                            document.getElementById('slope').insertAdjacentHTML('afterend',
                                        `<div id='slopeChart'></div>`);
    
                            comparePrice(resortNames, liftPrice);
                            compareSlopesLen(resortNames, slopesLen);
                        }
                        else {
                            if (document.getElementById('priceChart')) {
                                document.getElementById('priceChart').remove();
                            };
    
                            if (document.getElementById('slopeChart')) {
                                document.getElementById('slopeChart').remove();
                            };                           
                        };                       
                    });
                }; 
            });
        }); 
    }
    else { 
        showAllResorts();
        myMap.setView([39.8283, -98.5795], 4);
        document.getElementById('priceChart').remove();
        document.getElementById('slopeChart').remove();
    };
      
};

function isMarkerInsidePolygon(marker, poly) {
    var inside = false;

    var x = marker.getLatLng().lat, y = marker.getLatLng().lng;
    console.log("isMARKER FUNC", x, y );

    for (let i=0; i < poly.length-1; i++){
        let xi = poly[i][1], yi = poly[i][0];
        let xj = poly[i+1][1], yj = poly[i+1][0];
        var intersect = ((yi > y) != (yj > y))
                && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
    }
    return inside;
};

function comparePrice(resortNames, liftPrice) {
    let trace = {
        x: resortNames,
        y: liftPrice,
        type: 'bar',
        transforms: [{
            type: 'sort',
            target: 'y',
            order: 'ascending'}],

    };

    let layout = {
        title: "Compare Price",
        showlegend: false,
        xaxis: {
            type: 'category',
            showticklabels: true,
            tickangle: 45,
            tickfont: {
                family: 'Old Standard TT, serif',
                size: 8,
                color: 'black'
              }
            },
        yaxis: {
            title: "Price $",
            showticklabels: true,
            tickangle: 'auto'}
    };

    let data = [trace];

    Plotly.newPlot('priceChart', data, layout);
};

function compareSlopesLen(resortNames, slopesLen) {
    let trace = {
        x: resortNames,
        y: slopesLen,
        type: 'bar',
        transforms: [{
            type: 'sort',
            target: 'y',
            order: 'ascending'}],
 
    };

    let layout = {
        title: "Compare Slopes Length",
        showlegend: false,
        xaxis: {
            type: 'category',
            showticklabels: true,
            tickangle: 45,
            tickfont: {
                family: 'Old Standard TT, serif',
                size: 8,
                color: 'black'
              }
            },
        yaxis: {
            title: "Slope length (miles)",
            showticklabels: true,
            tickangle: 'auto'}
    };

    let data = [trace];

    Plotly.newPlot('slopeChart', data, layout);
};

let markerOnClick = function(e){
    const parser = new DOMParser();
    let popupContent = e.target.getPopup().getContent();
    let htmlContent = parser.parseFromString(popupContent, "text/html");
    let resortName = htmlContent.body.firstChild.textContent;

    d3.csv("/static/data/complete_resorts_info.csv").then(function(data) {
        data.forEach(resort => {
            if (resort.name === resortName) {
                if (document.getElementById("info")) {
                    document.getElementById("info").remove();
                }

                document.getElementById("resortInfo").insertAdjacentHTML('afterend',
                         `<div id="info"> <br><b style="font-size: 18px">${resort.name}</b><br><br>
                            <b style="font-size: 12px">Closest Town:</b> ${resort.closest_town} <br><br>
                            <b style="font-size: 12px">Lift Price:</b> $${resort.price} <br><br>
                            <b style="font-size: 12px">Total Slopes Length:</b> ${resort.total_len} miles<br>
                            <b style="font-size: 12px">Easy Slopes Length:</b> ${resort.easy_len} miles<br>
                            <b style="font-size: 12px">Intermediate Slopes Length:</b> ${resort.intermediate_len} miles<br>
                            <b style="font-size: 12px">Difficult Slopes Length:</b> ${resort.difficult_len} miles<br>
                          </div>`);
            };
        });
    });
   
};

