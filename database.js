const { Pool ,Client } = require('pg')

const client = new Client({
  user: 'graysteptestig',
  database: 'sdc',
  port: 5432
})

client.connect()

client.query(`
CREATE TABLE IF NOT EXISTS questions (
  id SERIAL PRIMARY KEY,
  productid INT NOT NULL,
  body TEXT NOT NULL,
  datewritten TEXT NOT NULL,
  askername TEXT NOT NULL,
  askeremail TEXT NOT NULL,
  reported INT,
  helpful INT
  );`
  , (err, res) => {
  if (err) {
    console.log(err)
  } else {
    console.log(res);
  }
})

client.query(`
  CREATE TABLE IF NOT EXISTS answers (
  id SERIAL PRIMARY KEY,
  questionid INT,
  body TEXT NOT NULL,
  datewritten TEXT NOT NULL,
  answerername TEXT NOT NULL,
  answereremail TEXT NOT NULL,
  reported INT,
  helpful INT,
  FOREIGN KEY(questionid) REFERENCES questions(id)
  );`
  , (err, res) => {
  if (err) {
    console.log(err)
  } else {
    console.log(res);
  }
})

client.query(`
  CREATE TABLE IF NOT EXISTS answerphotos (
  id SERIAL PRIMARY KEY,
  answerid INT,
  photourl TEXT NOT NULL,
  FOREIGN KEY(answerid) REFERENCES answers(id)
  );`
  , (err, res) => {
  if (err) {
    console.log(err)
  } else {
    console.log(res);
  }
})






module.exports = client