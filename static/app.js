var prices = []
var names = []
var states = []

init();
initpie();
d3.select("body").on("load", init);
d3.select("body").on("load", initpie);

d3.json('static/node-api-postgres/resortinfo.json').then(function(data) {
    console.log(data)
})

d3.select("#button1").on("change", filterdata);
d3.select("#button2").on("change", filterdata);

function init() {
    d3.json('static/node-api-postgres/resortinfo.json').then(function(data)
        {

            console.log(data)
            

            data.forEach(function(data) {
                prices.push(data.price)
                names.push(data.name)

                states.push(data.state)
            })

            console.log(prices);
            console.log(names);
            console.log(states);

            uniqueStates = Array.from(new Set(states));
            sortedStates = uniqueStates.sort();
            allsortedStates = sortedStates.filter(function(x) {
                return ((x != null) && (x != 'Unknown'))
            })


            console.log(allsortedStates);

            var data2 = [{
                y: prices,
                x: names,
                type: 'bar'
              }];
            
            var layout = {
                height: 500,
                width: 500,
                title: "Prices of Ski Resorts",
                xaxis: {
                    title: "Resort",
                    automargin: true}
              };
            
            Plotly.newPlot("pie", data2, layout);
            
        }
    )
}

function initpie() {
    d3.json('static/node-api-postgres/resortinfo.json').then(function(data)
        {
            console.log(data)
            uniqueData = Array.from(new Set(data));
            
            var easy_list = []
            var intermediate_list = []
            var difficult_list = []
            uniqueData.forEach(function(data) {
                easy_list.push(+data.easy_len)
                intermediate_list.push(+data.intermediate_len)
                difficult_list.push(+data.difficult_len)
            })
                easy_total = 0
                intermediate_total = 0
                difficult_total = 0
                for (i = 0; i < easy_list.length; i++) {
                    easy_total = easy_total + easy_list[i];
                    intermediate_total = intermediate_total + intermediate_list[i];
                    difficult_total = difficult_total + difficult_list[i];
                }
                
                console.log(easy_total)

            var data4 = [{
                values: [easy_total, intermediate_total, difficult_total],
                labels: ['Easy', 'Intermediate', 'Difficult'],
                type: 'pie',
                title: "Length of Trail by Slope Difficulties"
              }];
            
            var layout4 = {
                height: 500,
                width: 500,
              };
            
            Plotly.newPlot("scatter", data4, layout4);
            
        }
    )
}


//d3.selectAll(".dropdown-item").on("change", filterdata);


function filterdata() {
    var button1 = d3.select("#button1").node().value;
    var button2 = d3.select("#button2").node().value;
    d3.json("static/node-api-postgres/resortinfo.json").then(function(data) {
        var filtereddata = []
        for (i = 0; i < allsortedStates.length; i++) {
            if (button2 === (i).toString()) {
                if (button1 === "price099") {
                    document.getElementById('button1').options[1].selected = true;
                    filtereddata = data.filter(data => (data.price < 100) && (data.state === allsortedStates[i]))
                    console.log(filtereddata);
                }
                else if (button1 === "price199") {
                    document.getElementById('button1').options[2].selected = true;
                    filtereddata = data.filter(data => (data.price >= 100) && (data.price < 200) && (data.state === allsortedStates[i]))
                    console.log(filtereddata);
                }
                else if (button1 === "price299") {
                    document.getElementById('button1').options[3].selected = true
                    filtereddata = data.filter(data => (data.price >= 200) && (data.state === allsortedStates[i]))
                    console.log(filtereddata);
                }
                else {
                    document.getElementById('button1').options[0].selected = true
                    filtereddata = data.filter(data => data.state === allsortedStates[i]);
                    console.log(filtereddata);
                    }
                }
            else if (button2 === "none") {
                if (button1 === "price099") {
                    document.getElementById('button1').options[1].selected = true;
                    filtereddata = data.filter(data => (data.price < 100))
                    console.log(filtereddata);
                }
                else if (button1 === "price199") {
                    document.getElementById('button1').options[2].selected = true;
                    filtereddata = data.filter(data => (data.price >= 100) && (data.price < 200))
                    console.log(filtereddata);
                }
                else if (button1 === "price299") {
                    document.getElementById('button1').options[3].selected = true
                    filtereddata = data.filter(data => (data.price >= 200))
                    console.log(filtereddata);
                }
                else {
                    document.getElementById('button1').options[0].selected = true
                    filtereddata = data
                    console.log(filtereddata);
                    }
            
            }
        }
        updateplotly(filtereddata)
    }

    )
}
var jsonData;
$.ajax({
  dataType: "json",
  url: "static/node-api-postgres/resortinfo.json",
  async: false,
  success: function(data){jsonData = data}
});

console.log(jsonData)
var features = ["temperature", "feels_like", "temp_min", "temp_max", "humidity", "cloudiness", "wind_speed", "daily_chance_snow", "hourly_chance_snow"]
var d3temps = []
var d3feelslike = []
var d3tempmin = []
var d3tempmax = []
var d3humidity = []
var d3cloudiness = []
var d3windspeed = []
var d3dailychancesnow = []
var d3hourlychancesnow = []
jsonData.forEach(function(data) {
    d3temps.push(+data.temperature)
    d3feelslike.push(+data.feels_like)
    d3tempmin.push(+data.temp_min)
    d3tempmax.push(+data.temp_min)
    d3humidity.push(+data.humidity)
    d3cloudiness.push(+data.cloudiness)
    d3windspeed.push(+data.wind_speed)
    d3dailychancesnow.push(+data.daily_chance_snow)
    d3hourlychancesnow.push(+data.hourly_chance_snow)
})
console.log(d3temps)

function piefilter() {
    if (document.getElementById('button3').options[0].selected === true) {
        initpie()
        d3tempsfilter = 0
        d3feelslikefilter = 0
        d3tempminfilter = 0
        d3tempmaxfilter = 0
        d3humidityfilter = 0
        d3cloudinessfilter = 0
        d3windspeedfilter = 0
        d3dailychancesnowfilter = 0
        d3hourlychancesnowfilter = 0;
    }
    else {
    var button3 = d3.select("#button3").node().value;
    console.log(button3)
    var piefilterdata = []
    d3.json("static/node-api-postgres/resortinfo.json").then(function(data) {
        var d3tempsfilter = 0
        var d3feelslikefilter = 0
        var d3tempminfilter = 0
        var d3tempmaxfilter = 0
        var d3humidityfilter = 0
        var d3cloudinessfilter = 0
        var d3windspeedfilter = 0
        var d3dailychancesnowfilter = 0
        var d3hourlychancesnowfilter = 0
        nodupsNames = data.map(x => x.name)
        sortednodupsNames = nodupsNames.sort();
        console.log(data[0])
        console.log(sortednodupsNames)
        console.log(button3)
        piefilterdata = data[parseInt(button3) - 50]
        d3tempsfilter = d3tempsfilter + d3temps[parseInt(button3) - 50]
        d3feelslikefilter = d3feelslikefilter + d3feelslike[parseInt(button3) - 50]
        d3tempminfilter = d3tempminfilter + d3tempmin[parseInt(button3) - 50]
        d3tempmaxfilter = d3tempmaxfilter + d3tempmax[parseInt(button3) - 50]
        d3humidityfilter = d3humidityfilter + d3humidity[parseInt(button3) - 50]
        d3cloudinessfilter = d3cloudinessfilter + d3cloudiness[parseInt(button3) - 50]
        d3windspeedfilter = d3windspeedfilter + d3windspeed[parseInt(button3) - 50]
        d3dailychancesnowfilter = d3dailychancesnowfilter + d3dailychancesnow[parseInt(button3) - 50]
        d3hourlychancesnowfilter = d3hourlychancesnowfilter + d3hourlychancesnow[parseInt(button3) - 50]
        console.log(d3feelslikefilter)
        finaltempdata = {"Temperature": Math.round(d3tempsfilter), "Feels Like": Math.round(d3feelslikefilter), "Min. Temp": Math.round(d3tempminfilter), "Max. Temp": Math.round(d3tempmaxfilter), "Humidity": Math.round(d3humidityfilter), "Cloudiness": Math.round(d3cloudinessfilter), "Wind Speed": Math.round(d3windspeedfilter), "Daily % Snow": Math.round(d3dailychancesnowfilter), "Hourly % Snow": Math.round(d3hourlychancesnowfilter)}

        updatepie(piefilterdata)
        updated3(finaltempdata)
        console.log(finaltempdata);

})
    }
}

function filterdata3() {
    var filtereddata2 = []
    console.log("button1", d3.select("#button1").node().value);
    console.log(d3.select("#button2").node().value);
    console.log(d3.select("#button3").node().value);
};



function updateplotly(newdata) {

    filtered_prices = []
    filtered_names = []

    newdata.forEach(function(data) {
        data.price = +data.price
        filtered_prices.push(data.price)
        filtered_names.push(data.name)
    })

    var newdata = [{
        y: filtered_prices,
        x: filtered_names,
        type: 'bar'
      }];
    var layout = {
    height: 500,
    width: 500,
    title: "Prices of Ski Resorts",
    xaxis: {
        title: "Resort",
        automargin: true}
    };
    Plotly.newPlot("pie", newdata, layout);
}

function updatepie(newdata) {

    easy_len = 0
    intermediate_len = 0
    difficult_len = 0

    easy_len = +newdata.easy_len
    intermediate_len = +newdata.intermediate_len
    difficult_len = +newdata.difficult_len

    var data5 = [{
        values: [easy_len, intermediate_len, difficult_len],
        labels: ['Easy', 'Intermediate', 'Difficult'],
        type: 'pie',
        title: "Length of Trail by Slope Difficulties"
      }];
      
    var layout5 = {
        height: 400,
        width: 500
      };
      
      Plotly.newPlot("scatter", data5, layout5);

      
}

function updated3(newdata2) {

    
    features = []

      Object.keys(newdata2).forEach(key => {
          features.push(key)
      })

d3.select("#d3stuff").select("svg").remove()

var svg = d3.select("#d3stuff").append("svg")
    .attr("width", 600)
    .attr("height", 600);

let radialScale = d3.scaleLinear()
    .domain([0,200])
    .range([0,250]);
let ticks = [30,60,90,120,150];

ticks.forEach(t =>
    svg.append("circle")
    .attr("cx", 300)
    .attr("cy", 300)
    .attr("fill", "none")
    .attr("stroke", "gray")
    .attr("r", radialScale(t))
);

ticks.forEach(t =>
    svg.append("text")
    .attr("x", 305)
    .attr("y", 300 - radialScale(t))
    .text(t.toString())
);

function angleToCoordinate(angle, value){
    let x = Math.cos(angle) * radialScale(value);
    let y = Math.sin(angle) * radialScale(value);
    return {"x": 300 + x, "y": 300 - y};
}

for (var i = 0; i < features.length; i++) {
    let ft_name = features[i];
    let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
    let line_coordinate = angleToCoordinate(angle, 190);
    let label_coordinate = angleToCoordinate(angle, 190.5);

    //draw axis line
    svg.append("line")
    .attr("x1", 300)
    .attr("y1", 300)
    .attr("x2", line_coordinate.x)
    .attr("y2", line_coordinate.y)
    .attr("stroke","black");

    //draw axis label
    svg.append("text")
    .attr("x", label_coordinate.x)
    .attr("y", label_coordinate.y)
    .text(ft_name);
}

let line = d3.line()
    .x(d => d.x)
    .y(d => d.y);
let colors = ["darkorange"];

function getPathCoordinates(data_point){
    let coordinates = [];
    for (var i = 0; i < features.length; i++){
        let ft_name = features[i];
        let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
        coordinates.push(angleToCoordinate(angle, data_point[ft_name]));
    }
    return coordinates;
}

for (var i = 0; i < features.length; i ++){
    let d = newdata2;
    let color = colors[i];
    let coordinates = getPathCoordinates(d);

    //draw the path element
    svg.append("path")
    .datum(coordinates)
    .attr("d",line)
    .attr("stroke-width", 3)
    .attr("stroke", color)
    .attr("fill", "yellow")
    .attr("stroke-opacity", 1)
    .attr("opacity", 0.5);
}

var $tbody = d3.select("tbody")
$tbody.html("")
var $trow = $tbody.append("tr")

Object.values(newdata2).forEach(value => {
    $trow.append("td").text(value)
    })
}

