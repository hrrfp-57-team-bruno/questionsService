const express = require('express')
const sql = require('./database.js')
const app = express()

app.listen(3333)

app.get('/', (req, res) => {
  res.send('YOU HIT IT')
})