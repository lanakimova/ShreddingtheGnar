function init() {
    d3.csv("resorts.csv").then(function(data)
        {
            console.log(data);

            prices = [];
            names = [];
            data.forEach(function(data) {
                data.price = +data.price
                prices.push(data.price)
                names.push(data.name)
            });

            console.log(prices)
            console.log(names)
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

init()

//d3.selectAll(".dropdown-item").on("change", filterdata);
var homeButton = d3.select("#homebutton")

homeButton.on("click", function() {
    dropdownid = "none";
    console.log(dropdownid)
})

function filterdata(dropdownid) {
    var filtereddata = []
    d3.csv("resorts.csv").then(function(data) {
        if (dropdownid === "price099") {
            filtereddata = data.filter(data => data.price < 100)
            console.log(filtereddata);
        }
        else if (dropdownid === "price199") {
            filtereddata = data.filter(data => (data.price >= 100) && (data.price < 200))
            console.log(filtereddata);
        }
        else if (dropdownid === "price299") {
            filtereddata = data.filter(data => data.price >= 200)
            console.log(filtereddata);
        }
        else if (dropdownid === "none") {
            filtereddata = data;
        }
        updateplotly(filtereddata)
    }
    )
}

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