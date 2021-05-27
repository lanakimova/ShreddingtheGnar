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
                totalSlopeLen = resort.total_len;
            let popupContent = "<b>" + resortName + "</b><br>Total Slope Lenght: " + totalSlopeLen;
            let marker = L.marker([lon, lat]).bindPopup(popupContent); 
            allResortsLayerGroup.addLayer(marker);     
        }
    });
});

let overlay = {'All Resorts': allResortsLayerGroup};
L.control.layers(null, overlay).addTo(myMap);

