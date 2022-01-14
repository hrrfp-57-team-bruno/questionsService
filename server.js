const express = require('express')
const db = require('./database.js')
const cors =require('cors');
const app = express()


app.use(cors({
  origin: true,
}));

app.listen(3333, () => {
  console.log('Listening on Port 3333')
})

app.get('/qa/questions', (req, res) => {
  console.log(req.query)
  let passedValue = req.query.product_id
  let limit = req.query.count
  db.query(`SELECT * from questions inner join answers on questions.question_main_id = answers.questionid left join answerphotos on answerphotos.photo_answerid = answers.answer_main_id where questions.productid = ${passedValue} LIMIT ${Number(limit)};`, (err, response) => {
    if (err) {
      console.log(err)
    } else {
      console.log(response.rows);
      let reviewCheck = [];
      let queryResults = {
        "product": passedValue,
        "results" : {},
      };
      response.rows.forEach((review, index) => {
        if (queryResults.results[review.questionid] !== undefined) {
          if (queryResults.results[review.questionid].answers[review.answer_main_id] !== undefined && review.photourl !== null) {
            // console.log('this is a defined answer and probably needs a photo')
            queryResults.results[review.questionid].answers[review.answer_main_id].photos.push(review.photourl)
          } else {
            // console.log('this isnt a defined answer')
            let answerPhotoArray = [];
            if (review.photourl !== null) {
              answerPhotoArray.push(review.photourl);
            }
            let anDate = new Date(Number(review.answer_datewritten));
            queryResults.results[review.questionid].answers[review.answer_main_id] = {
              'id': review.answer_main_id,
              'body': review.answer_body,
              'date' : anDate.toISOString(),
              'answerer_name': review.answerername,
              'helpfulness': review.answer_helpful,
              'photos' : answerPhotoArray
            }
          }
        } else {
          let br = {};
          let brDate = new Date(Number(review.question_datewritten))
          br.question_id = review.questionid;
          br.question_body = review.question_body;
          br.question_date = brDate.toISOString();
          br.asker_name = review.askername;
          br.question_helpfulness = review.helpful;
          if (review.reported === 0) {
            br.reported = false;
          } else {
            br.reported = true;
          }
          br.answers = {};
          if (review.answer_main_id === undefined || review.answer_main_id === null) {
            return;
          } else {
            let answerPhotoArray = [];
            if (review.photourl !== null) {
              answerPhotoArray.push(review.photourl);
            }
            let anDate = new Date(Number(review.answer_datewritten));
            br.answers[review.answer_main_id] = {
              'id': review.answer_main_id,
              'body': review.answer_body,
              'date' : anDate.toISOString(),
              'answerer_name': review.answerername,
              'helpfulness': review.answer_helpful,
              'photos' : answerPhotoArray
            }
          }
          reviewCheck.push(review.questionid);
          queryResults.results[review.questionid] = br;
        }
      })
      let convertResultsToArray = [];
      for (var key in queryResults.results) {
        convertResultsToArray.push(queryResults.results[key]);
      }
      queryResults.results = convertResultsToArray;
      res.send(queryResults);
    }
  })
})