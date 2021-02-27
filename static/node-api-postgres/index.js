const pg = require('pg');

const cs = 'postgres://postgres:postgres@localhost:5432/SkiResort';

const client = new pg.Client(cs);

client.connect();

var resortInfo = []

client.query("SELECT * FROM resorts_info").then(res => {

    const data = res.rows;

    data.forEach(row => console.log(row))
    data.forEach(row => resortInfo.push(row))
    //console.log(data)

    require('fs').writeFile(

        './resortinfo.json',
    
        JSON.stringify(resortInfo),
    
        function (err) {
            if (err) {
                console.error('Crap happens');
            }
        }
    );

}).catch(err => {
    console.log(err.stack);
}).finally(() => {
    client.end()
});

//console.log(resortInfo)


