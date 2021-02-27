
// d3.select('body').on('load', initMap)

// function initMap() {
    d3.csv("static/data/test2.csv").then(function(data) {
        var mapStates = [
          'Alabama', 'Alaska', 'Arizona', 'California', 'Colorado', 'Connecticut', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Maine', 'Massachusetts', 'Michigan', 'Minnesota', 'Missouri', 'Montana', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Dakota', 'Tennessee', 'Utah', 'Vermont', 'Virgina', 'Washington', 'West Virgina', 'Wisconsin', 'Wyoming'
        ];
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
      };
    
      // // Create overlay object to hold our overlay layer
      var overlayMaps = {
        "All": resortLayer1,
        "<100": resortLayer2,
        "100-200": resortLayer3,
        "200+": resortLayer4,   
      };
    
    var myMap = L.map("map-id", {
        center:  [37.7749, -122.4194],
        zoom: 5,
        layers: [streetmap, resortLayer1]
      });
    
      // L.control.layers(baseMaps, overlayMaps, {
      //   collapsed: false
      // }).addTo(myMap);

      function applyMarkers() {  
        console.log('State were choosen');
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
      var controller = L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
      })
      var legend = L.control({position: 'bottomleft'});
      legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend');
        // div.innerHTML = '<select>';
        // <option>sike</option><option>y</option></select>';
        var stateString = "";
        mapStates.forEach( function(state) { 
          stateString += `<option>${state}</option>`;
        });
          // div.innerHTML += `<option>${state}</option>`;
          div.innerHTML = `<select>${stateString}</select>`;
        // div.firstChild.onmousedown = div.firstChild.ondblclick = L.DomEvent.stopPropagation;
        return div;};
      // controller.onAdd = function (map) {
      //       var div = L.DomUtil.create('div', 'info legend');
      //       div.innerHTML = '<select><option>1</option><option>2</option><option>3</option></select>';
      //       div.firstChild.onmousedown = div.firstChild.ondblclick = L.DomEvent.stopPropagation;
      //       return div;};
        controller.addTo(myMap);
        legend.addTo(myMap);
      //   $('select').change(function(){
      //     alert($( "select option:selected" ).text);
      // });
      $('select').on('change', function (e) {
        var optionSelected = $("option:selected", this);
        var valueSelected = this.value;
        // alert(valueSelected);
        makeMap(valueSelected);
    });
    var resortLayer = L.layerGroup();
    function makeMap(state) {
    console.log(state);
    //  d3.json(`/getResortsNameByState/${state}`).then(function(d) {
    // //       console.log(d);
    //   var stateResortNames = d ;
    //   console.log(d);
    // });
      stateResorts =  data.filter(function(resort) {
                return (resort.state === state)
            });
            console.log(data);
            console.log(stateResorts);
            resortLayer.clearLayers();
            resortLayer1.clearLayers();
            resortLayer2.clearLayers();
            resortLayer3.clearLayers();
            resortLayer4.clearLayers();
            stateResorts.forEach(resort=>{
                  resortLayer.addLayer(
                  L.marker([resort.lon, resort.lat])
                  .bindPopup("<h1>" + resort.name + "</h1>")
                )});
          resortLayer.addTo(myMap);
                  }
    });
    // };
    
    d3.select("#selectState").on("change", function() {
      showCheepInfo(),
      showExpenciveInfo()
    })
    // showCheepInfo)
    
    function showCheepInfo() {
      var dropDownState = d3.select('#selectState').node().value;
      d3.json(`/getCheepestResortInState/${dropDownState}`).then(function(data) {
        var cheepestResort = document.getElementById('cheepestResort');
        var cardBody = document.createElement('div');
        cardBody.setAttribute('class', 'card_info');
        cardBody.innerHTML = `<h5 class="card-title">Cheapest:<br><br>${data.name}</h5>                   
                              <h6 class="card-subtitle mb-2 text-muted">Town: ${data.closest_town}, ${data.zip}</h6>
                              <p class="card-text">
                              <b>Total slopes len (km):</b> ${data.total_len}</p>
                               <p id='easyLen'> Easy: ${data.easy_len}</p>
                               <p id='intLen'> Intermediate: ${data.inter_len}</br></p>
                               <p id='hardLen'> Hard: ${data.dif_len}</p>
                              <b>Weather:</b>  </br>
                              <p id='temp'>Temperature: ${Math.round(data.temp)} F</p>
                              <p id='feelsLike'>Feels Like: ${Math.round(data.feels_like)} F</p>
                              </p>
                              <a target="_blank" href="${data.website}" class="card-link">Resort Link</a>
                              `;
        cheepestResort.appendChild(cardBody);
      });
    };
    
    // d3.select("#selectState").on("change", showExpenciveInfo)
    function showExpenciveInfo() {
      var dropDownState = d3.select('#selectState').node().value;
      d3.json(`/getExpenciveResortInState/${dropDownState}`).then(function(data) {
        
        var cheepestResort = document.getElementById('expenciveResort');
        var cardBody = document.createElement('div');
        cardBody.innerHTML = `<h5 class="card-title">Most Expensive:<br><br>${data.name}</h5>
                              <h6 class="card-subtitle mb-2 text-muted">Town: ${data.closest_town}, ${data.zip}</h6>
                              <p class="card-text">
                              <b>Total slopes len (km):</b> ${data.total_len}</p>
                              <p id='easyLen'> Easy: ${data.easy_len}</p>
                              <p id='intLen'> Intermediate: ${data.inter_len}</br></p>
                              <p id='hardLen'> Hard: ${data.dif_len}</p>
                              <b>Weather:</b>  </br>
                              <p id='temp'>Temperature: ${Math.round(data.temp)} F</p>
                              <p id='feelsLike'>Feels Like: ${Math.round(data.feels_like)} F</p>
                              </p>
                              <a target="_blank" href="${data.website}" class="card-link">Resort Link</a>
                              `;
        cheepestResort.appendChild(cardBody);
      });
    };
