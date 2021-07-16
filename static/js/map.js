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
let statesDropDown = L.control({position: 'topright'});

statesDropDown.onAdd = function() {
    let div = L.DomUtil.create('div', 'dropdown menu');
    let stateString = '<option>All State</option>';

    fetch('/states').then(function(resp) {
        return resp.json();
    }).then(function(text) {
      text.forEach(function(state) {
          stateString += `<option>${state}</option>`;  
                  
      });
      console.log(stateString);
      div.innerHTML = `<select id='stateMenu'>${stateString}</select>`;
    });

    return div;
};

statesDropDown.addTo(myMap);


