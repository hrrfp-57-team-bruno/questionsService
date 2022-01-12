const { Pool ,Client } = require('pg')

const client = new Client({
  user: 'graysteptestig',
  database: 'sdc',
  port: 5432
})

client.connect()




module.exports = client