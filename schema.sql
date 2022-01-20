CREATE TABLE IF NOT EXISTS questions (
  question_main_id SERIAL PRIMARY KEY,
  productid INT NOT NULL,
  question_body VARCHAR(1000) NOT NULL,
  question_datewritten BIGINT NOT NULL,
  askername VARCHAR(60) NOT NULL,
  askeremail VARCHAR(60) NOT NULL,
  reported INT,
  helpful INT
);

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
);

CREATE TABLE IF NOT EXISTS answerphotos (
  photo_main_id SERIAL PRIMARY KEY,
  photo_answerid INT,
  photourl VARCHAR(384) NOT NULL,
  FOREIGN KEY(photo_answerid) REFERENCES answers(answer_main_id)
);

/*
  To get data into database

  copy questions(id, productId, body, dateWritten, askerName, askerEmail, reported, helpful)
  from '/XXX/questions.csv'
  DELIMITER ','
  CSV HEADER;

  THESE ARE SUPER IMPORTANT FOR PERFORMANCE -- PLEASE BAKE INTO SCHEMA

  //used to alter sequence after importing csv data

    // use to find number to start seq  SELECT * FROM table ORDER BY id DESC LIMIT 1;

  alter sequence SEQUENCE NAME restart with LASTINDEXINCOL#+1;
    names: questions_question_main_id_seq || answers_answer_main_id_seq  || answerphotos_photo_main_id_seq



  //used to create index and make database super duper fast
  create index idx_product_id on questions(productid);

  create index idx_question_id on answers(questionid);

  create index idx_photo_answerid on answerphotos(photo_answerid);





  select * from questions left join answers on answers.questionid = questions.question_main_id left join answerphotos on answerphotos.photo_answerid = questions.question_main_id where productid = 40355 limit 50;

  select * from questions inner join answers on questions.question_main_id = answers.questionid left join answerphotos on answerphotos.photo_answerid = answers.answer_main_id where questions.productid = ${passedValue} LIMIT ${limit};


*/