const express = require('express')
const db = require('./database.js')
const cors =require('cors');
const app = express()


app.use(cors({
  origin: true,
}));

app.use(express.json());

app.listen(3333, () => {
  console.log('Listening on Port 3333')
})

app.get('/qa/questions', (req, res) => {
  // console.log(req.query)
  let passedValue = req.query.product_id
  let limit = Number(req.query.count) || null
  db.query(`select * from questions inner join answers on answers.questionid = questions.question_main_id left join answerphotos on answerphotos.photo_answerid = questions.question_main_id where productid = ${passedValue} limit ${limit};`, (err, response) => {
    if (err) {
      console.log(err)
    } else {
      // console.log(response.rows);
      let reviewCheck = [];
      let queryResults = {
        "product": passedValue,
        "results" : {},
      };
      response.rows.forEach((review, index) => {
        if (queryResults.results[review.questionid] !== undefined) {
          if (Object.keys(queryResults.results[review.question_main_id].answers).length !== 0 && review.photourl !== null) {
            // console.log('this is a defined answer and probably needs a photo')
            // console.log( queryResults.results[review.question_main_id].answers[review.answer_main_id])
            if (Object.keys(queryResults.results[review.question_main_id].answers).length !== 0) {
              // console.log('WTF:::', review)
              // console.log('WTF in QUERY RESULTS', queryResults.results[review.question_main_id])
              // queryResults.results[review.question_main_id].answers[answer_main_id] = {

              // }
            } else {
              // console.log('THIS IS RUNNING')
              queryResults.results[review.question_main_id].answers[review.answer_main_id].photos.push(review.photourl)
            }
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
          br.question_id = review.question_main_id;
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
            // console.log(br)
            reviewCheck.push(review.question_main_id);
            queryResults.results[review.question_main_id] = br;
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
          reviewCheck.push(review.question_main_id);
          queryResults.results[review.question_main_id] = br;
        }
      })
      let convertResultsToArray = [];
      for (var key in queryResults.results) {
        convertResultsToArray.push(queryResults.results[key]);
      }
      queryResults.results = convertResultsToArray;
      res.status(200).send(queryResults);
    }
  })
})

// app.get('/qa/questions', (req, res) => {
//   // console.log(req.query)
//   let passedValue = req.query.product_id
//   let limit = Number(req.query.count) || null
//   db.query(`select * from questions inner join answers on answers.questionid = questions.question_main_id left join answerphotos on answerphotos.photo_answerid = questions.question_main_id where productid = ${passedValue} limit ${limit};`, (err, response) => {
//     if (err) {
//       console.log(err)
//     } else {
//       // console.log(response.rows);
//       res.status(200).send(response.rows);
//     }
//   })
// })

app.get('/qa/questions/:question_id/answers', (req, res) => {
  let questionId = req.params.question_id;
  let answerResultsArray = [];
  // console.log(questionId);
   db.query(`SELECT * from answers left join answerphotos on answerphotos.photo_answerid = answers.answer_main_id where answers.questionid = ${questionId}` , (err, response) => {
    if (err) {
      console.log(err)
    } else {
      // console.log(response.rows)
      let qRes = {
        question: questionId,
        count: 0,
        results: {}
      };
      response.rows.forEach(a => {
        if (qRes.results[a.answer_main_id] !== undefined) {
          let photoObj = {};
            photoObj.id = a.photo_main_id;
            photoObj.url = a.photourl;
            qRes.results[a.answer_main_id].photos.push(photoObj);
            return;
        } else {
          let an = {};
          let anDate = new Date(Number(a.answer_datewritten));
          let anPhotos = [];
          if (a.photourl !== null) {
            let photoObj = {};
            photoObj.id = a.photo_main_id;
            photoObj.url = a.photourl;
            anPhotos.push(photoObj);
          };
          an.answer_id = a.answer_main_id,
          an.body = a.answer_body,
          an.date = anDate.toISOString(),
          an.answerer_name = a.answerername,
          an.helpfulness = a.answer_helpful,
          an.photos = anPhotos
          qRes.results[a.answer_main_id] = an;
        }
      })
      let convertResultsToArray = [];
      for (var key in qRes.results) {
        convertResultsToArray.push(qRes.results[key]);
      };
      qRes.results = convertResultsToArray;
      qRes.count = convertResultsToArray.length;
      res.status(200).send(qRes);
    }
  })
})

app.post('/qa/questions', (req, res) => {
  // console.log(req.body);
  let productId = Number(req.body.product_id);
  let qBody = req.body.body;
  let qDate = Date.now();
  let qName = req.body.name;
  let qEmail = req.body.email;
  let qRep = 0;
  let qHelp = 0;
  db.query(`insert into questions(question_main_id, productid, question_body, question_datewritten, askername, askeremail, reported, helpful) values(DEFAULT, ${productId}, '${qBody}', ${qDate}, '${qName}', '${qEmail}', ${qRep}, ${qHelp});`, (err, response) => {
    if (err) {
      console.log(err);
    } else {
      res.status(201).send('Good Game');
    }
  })
})

app.post('/qa/questions/:question_id/answers', (req, res) => {
  let questionId = Number(req.params.question_id);
  let aBody = req.body.body;
  let aDate = Date.now();
  let aName = req.body.name;
  let aEmail = req.body.email;
  let aRep = 0;
  let aHelp = 0;
  let photos = req.body.photos;
  db.query(`INSERT INTO answers(answer_main_id, questionid, answer_body, answer_datewritten, answerername, answereremail, answer_reported, answer_helpful) VALUES (DEFAULT, ${questionId}, '${aBody}', ${aDate}, '${aName}', '${aEmail}', ${aRep}, ${aHelp} ) returning * ;`, (err, response) => {
    if (err) {
      console.log(err);
    } else {
      if (photos.length > 0) {
        let answerId = response.rows[0].answer_main_id;
        photos.forEach((url, index) => {
          db.query(`insert into answerphotos(photo_main_id, photo_answerid, photourl) VALUES(DEFAULT, ${answerId}, '${url}') returning *`, (err, response) => {
            if (err) {
              console.log(err);
            } else {
              if (index === photos.length - 1) {
                res.status(201).send('Good Game');
              }
            }
          })
        })
      } else {
        res.status(201).send('Good Game');
        return;
      }
    }
  })
})

app.put('/qa/questions/:question_id/helpful', (req, res) => {
  //needs question_id
  let questionId = req.params.question_id;
  db.query(`update questions set helpful = helpful + 1 where question_main_id = ${questionId};`, (err, response) => {
    if (err) {
      console.log(err);
    } else {
      res.status(204).send('Good Game');
    }
  })
});

app.put('/qa/questions/:question_id/report', (req, res) => {
  //needs question_id
  let questionId = req.params.question_id;
  db.query(`update questions set reported = reported + 1 where question_main_id = ${questionId};`, (err, response) => {
    if (err) {
      console.log(err);
    } else {
      res.status(204).send('Good Game');
    }
  })
});

app.put('/qa/answers/:answer_id/helpful', (req, res) => {
  //needs answer_id
  let answerId = req.params.answer_id;
  db.query(`update answers set answer_helpful = answer_helpful + 1 where answer_main_id = ${answerId};`, (err, response) => {
    if (err) {
      console.log(err);
    } else {
      res.status(204).send('Good Game');
    }
  })
});

app.put('/qa/answers/:answer_id/report', (req, res) => {
  //needs answer_id
  let answerId = req.params.answer_id;
  db.query(`update answers set answer_reported = answer_reported + 1 where answer_main_id = ${answerId};`, (err, response) => {
    if (err) {
      console.log(err);
    } else {
      res.status(204).send('Good Game');
    }
  })
});



