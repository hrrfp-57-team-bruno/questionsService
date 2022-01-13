const { Pool ,Client } = require('pg')

const client = new Client({
  user: 'graysteptestig',
  database: 'sdc',
  port: 5432
})

client.connect()

client.query(`
  CREATE TABLE IF NOT EXISTS questions (
  question_main_id SERIAL PRIMARY KEY,
  productid INT NOT NULL,
  question_body VARCHAR(1000) NOT NULL,
  question_datewritten BIGINT NOT NULL,
  askername VARCHAR(60) NOT NULL,
  askeremail VARCHAR(60) NOT NULL,
  reported INT,
  helpful INT
  );`
  , (err, res) => {
  if (err) {
    console.log(err)
  } else {
    // console.log(res);
  }
})

client.query(`
  CREATE TABLE IF NOT EXISTS answers (
  answer_main_id SERIAL PRIMARY KEY,
  questionid INT,
  answer_body VARCHAR(1000) NOT NULL,
  answer_datewritten BIGINT NOT NULL,
  answerername VARCHAR(60) NOT NULL,
  answereremail VARCHAR(60) NOT NULL,
  answer_reported INT,
  answer_helpful INT,
  FOREIGN KEY(questionid) REFERENCES questions(question_main_id)
  );`
  , (err, res) => {
  if (err) {
    console.log(err)
  } else {
    // console.log(res);
  }
})

client.query(`
  CREATE TABLE IF NOT EXISTS answerphotos (
  photo_main_id SERIAL PRIMARY KEY,
  photo_answerid INT,
  photourl VARCHAR(384) NOT NULL,
  FOREIGN KEY(photo_answerid) REFERENCES answers(answer_main_id)
  );`
  , (err, res) => {
  if (err) {
    console.log(err)
  } else {
    // console.log(res);
  }
})






module.exports = client