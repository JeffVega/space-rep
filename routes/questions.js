'use strict';

const express = require('express');
const QuestionMod = require('../models/question');
const User = require('../models/user')
const LinkedList = require('../linked-list/linked-list')
const passport = require('passport');
const router = express.Router();

const jwtAuth = passport.authenticate('jwt', {session:false});

router.get('/question',(req,res) =>{
  QuestionMod.find({})
  .then(results =>{
    res.json(results)
  })
  .catch(err => {
    next(err)
  })
});

router.post('/question', (req, res) => {
  const {img_url,answer} = req.body;
  // const userId =req.user.id;
  const newQues = { img_url,answer};

  /***** Never trust users - validate input *****/
  if (!QuestionMod) {
    const err = new Error('Missing `QuestionMod` in request body');
    err.status = 400;
    return next(err);
  }

  QuestionMod.create(newQues)
    .then(result => {
      res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
    })
    .catch(err => {
      if (err.code === 11000) {
        err = new Error('That QuestionMod already exists');
        err.status = 400;
      }
      next(err);
    });   

});

router.post('/question/update', jwtAuth, (req, res) => {
  const { input } = req.body;
  console.log(input);
  
  QuestionMod.findOne({img_url:input.question})
    .then(answer => {
      if(answer.answer === input.answer) {
        User.findOne({username:req.user.username})
        .then(user => {
          let  userScore = user.score 
          userScore++;
          user.questions.memoryStrength *= 2;
          res.send('Correct!')
        })
      } 
      else {
        res.send(`Incorrect. The name is ${answer}`)
      }
    })
    // User.findOne({username:req.user.username})
    //   .then(user => {
    //     const currentQuestion = user.questions[head]
    //     //get current question head value & compare answer to input
    //     if(response.input !== currentQuestion.answer) {
    //       const next = currentQuestion.next; 

    //         user.head = next;
    //         const tempNext = user.questions[next].next;
    //         user.questions[next].next = currentQuestion;
    //         user.questions[currentQuestion].next = tempNext; 
    //     } else {
    //       //moved a couple spots back depending on memeoryStrength
    //       //multiply right memoryStrength x 2
    //       //change next value of question that is certain spots away  
    //       //currentQuestion.memoryStrength * 2
    //       //traverse array to know where to insert
    //       //start at head, head.next = 1 traversal, head.next.next = 2 etc. 
    //       //once it's moved 4 nexts, will move question there

    //     }
    //   })
        // return user.save();
})


module.exports = router;