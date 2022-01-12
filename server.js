const express = require('express')
const db = require('./database.js')
const app = express()

app.listen(3333, () => {
  console.log('Listening on Port 3333')
})

app.get('/', (req, res) => {
  db.query('SELECT *', (err, response) => {
    if (err) {
      console.log(err)
    } else {
      console.log(response);
    }
  })
  res.send('YOU HIT IT')
})