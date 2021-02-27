const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'SkiResort',
  password: 'postgres',
  port: 5432,
})

const getStates = (request, response) => {
    pool.query('SELECT state FROM resorts_info WHERE state NOT IN ("Empty", "Unknown")', (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }

console.log(getStates)