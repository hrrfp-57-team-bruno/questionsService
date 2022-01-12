const express = require('express')
const db = require('./database.js')
const cors =require('cors');
const app = express()


app.use(cors({
  origin: '*',
}));

app.listen(3333, () => {
  console.log('Listening on Port 3333')
})

app.get('/', (req, res) => {
  db.query('SELECT * from questions where productid=40433', (err, response) => {
    if (err) {
      console.log(err)
    } else {
      console.log(response.rows);
      res.send(response.rows);
    }
  })
})