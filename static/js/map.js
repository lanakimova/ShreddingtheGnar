
// d3.select('body').on('load', initMap)

// function initMap() {
    d3.csv("static/data/complete_resorts_info.csv").then(function(data) {

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
    
      L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
      }).addTo(myMap);
    
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
        cardBody.innerHTML = `<h5 class="card-title">${data.name}</h5>                   
                              <h6 class="card-subtitle mb-2 text-muted">Town: ${data.zip} ${data.closest_town}</h6>
                              <p class="card-text">
                              <b>Total slopes len:</b> ${data.total_len}</br>
                                Easy: ${data.easy_len}</br>
                                Intermedium: ${data.inter_len}</br> 
                                Hard: ${data.dif_len}</br>
                              <b>Weather:</b>  </br>
                                Temperature: ${data.temp}
                                Feels Like: ${data.feels_like}
                              </p>
                              <a href="#" class="card-link">${data.website}</a>
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
        cardBody.innerHTML = `<h5 class="card-title">${data.name}</h5>
                              <h6 class="card-subtitle mb-2 text-muted">Town: ${data.zip} ${data.closest_town}</h6>
                              <p class="card-text">
                              <b>Total slopes len:</b> ${data.total_len}</br>
                                Easy: ${data.easy_len}</br>
                                Intermedium: ${data.inter_len}</br> 
                                Hard: ${data.dif_len}</br>
                              <b>Weather:</b>  </br>
                                Temperature: ${data.temp}
                                Feels Like: ${data.feels_like}
                              </p>
                              <a href="#" class="card-link">${data.website}</a>
                              `;
        cheepestResort.appendChild(cardBody);
      });
    };
    
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