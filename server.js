const express = require('express')
const db = require('./database.js')
const cors =require('cors');
const app = express()


app.use(cors({
  origin: 'http://localhost:3000',
}));

app.listen(3333, () => {
  console.log('Listening on Port 3333')
})

app.get('/qa/questions', (req, res) => {
  console.log(req.query)
  // db.query('SELECT * from questions where productid=5', (err, response) => {
  //   if (err) {
  //     console.log(err)
  //   } else {
  //     console.log(response.rows);
  //     res.send(response.rows);
  //   }
  // })
})