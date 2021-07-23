let myMap = L.map('map').setView([39.8283, -98.5795], 4);

let streetMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
        accessToken: API_KEY
      }).addTo(myMap);


// create a drop down menu on the map

const dropDownMenu = L.control({position: 'topright'});

dropDownMenu.onAdd = function () {
  const newDiv = L.DomUtil.create('div', 'state list');
  let select = document.createElement('select');
  select.setAttribute('id', 'statesDropDown');

  // add first option 'All States' to select
  let opt = document.createElement('option');
  opt.setAttribute('value', "All States");
  let firstNode = document.createTextNode("All States");
  console.log(firstNode);
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

// get state from dropdown

document.getElementById("statesDropDown").addEventListener("change", updateMapMarkers);

function updateMapMarkers() {
  let sel = document.getElementById("statesDropDown");
  let opt = sel.options[sel.selectedIndex].text;

  console.log("value", opt);
}

  
  

  