let myMap = L.map('map').setView([39.8283, -98.5795], 4);

let streetMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
        accessToken: API_KEY
      }).addTo(myMap);

// Create a drop down menu with states
const dropDownMenu = L.control({position: 'topright'});

dropDownMenu.onAdd = function () {
  const newDiv = L.DomUtil.create('div', 'state list');
  let select = document.createElement('select');
  select.setAttribute('id', 'statesDropDown');

  // add first option 'All States' to select
  let opt = document.createElement('option');
  opt.setAttribute('value', "All States");
  let firstNode = document.createTextNode("All States");
  opt.appendChild(firstNode);
  select.appendChild(opt);

  // add  all states to select
  fetch('/states').then(function(resp) {   
    return resp.json();
  })
  .then(function(txt) {  
    txt.forEach(stName => {
      let option = document.createElement('option');
      option.setAttribute('value', stName);
      let nod = document.createTextNode(stName);
      option.appendChild(nod);
      document.getElementById("statesDropDown").appendChild(option);
                
    });   
  
  });
  newDiv.appendChild(select);
  return newDiv;
  
}

dropDownMenu.addTo(myMap);

// call func to viz all resort on the map
showAllResorts();

//  event listener for selected option
document.getElementById('statesDropDown').addEventListener('change', updateMap);

function showAllResorts() {
    fetch('/getAllResorts').then(function(resp) {
        return resp.json();
      }).then(function(data) {
        data.forEach(resort => {
          let lat = resort.coordinates[0];
          let lng = resort.coordinates[1];
      
          let popupContent = "<b style='font-size: 16px'>" + resort.name + "</b><br><b>Total Slope Lenght:</b> " + resort.total_length
                                           + "<br><b> Lift Price:</b> $" + resort.price + "<br><b> Closest Town:</b> " + resort.closest_town;
          L.marker([lng, lat]).bindPopup(popupContent).addTo(myMap); 
        })
      })
};

function updateMap(){
    // get value from dropdown
    let sel = document.getElementById('statesDropDown');
    let opt = sel.options[sel.selectedIndex];
    let state = opt.text;

    //  remove previous layer with markers
    let stateMarkers = L.layerGroup();
    myMap.eachLayer(function(layer) { if (layer != streetMap) { myMap.removeLayer(layer) }});

    // Lana continue fron here 
    if (state != 'All States') {

        // hightlite given state and recenter the map
        fetch('/static/data/us_states.json').then(response => {
            return response.json();
        }).then(data => {
                let features = data.features;
            
                features.forEach(feature => {
                    if (feature.properties.name === state){
                        let statePoly = L.geoJSON(feature).addTo(myMap);
                        let poly = [];
                        if (feature.geometry.type === 'Polygon') { poly = feature.geometry.coordinates[0]; };
        
                        if (feature.geometry.type === 'MultiPolygon'){ poly = feature.geometry.coordinates[0][0]};

                        myMap.fitBounds(statePoly.getBounds());
                    }
                })
            })
        // add resorts markers to the map on given state
        fetch(`getStateResorts/${state}`).then(resp => {
            return resp.json();
        }).then(function(data) {
            data.forEach(resort => {
                let lat = resort.coordinates[0];
                let lng = resort.coordinates[1];
      
                let popupContent = "<b style='font-size: 16px'>" + resort.name + "</b><br><b>Total Slope Lenght:</b> " + resort.total_length
                                           + "<br><b> Lift Price:</b> $" + resort.price + "<br><b> Closest Town:</b> " + resort.closest_town;
                L.marker([lng, lat]).bindPopup(popupContent).addTo(myMap);
            })
        });
        
    }
    else { 
        showAllResorts();
        myMap.setView([39.8283, -98.5795], 4);
    }
      
}



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

