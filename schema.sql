CREATE TABLE IF NOT EXISTS questions (
  id SERIAL PRIMARY KEY,
  productid INT NOT NULL,
  body TEXT NOT NULL,
  datewritten TEXT NOT NULL,
  askername TEXT NOT NULL,
  askeremail TEXT NOT NULL,
  reported INT,
  helpful INT
);

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
);

CREATE TABLE IF NOT EXISTS answerphotos (
  id SERIAL PRIMARY KEY,
  answerid INT,
  photourl TEXT NOT NULL,
  FOREIGN KEY(answerid) REFERENCES answers(id)
);

/*
  To get data into database

  copy questions(id, productId, body, dateWritten, askerName, askerEmail, reported, helpful)
  from '/XXX/questions.csv'
  DELIMITER ','
  CSV HEADER;
*/