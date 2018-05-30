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
  User.findOne({username:req.user.username})
    const result = req.body
      .then(user => {
        if (req.body.boolean === true || req.body.boolean === false) {
            user.head += 1;
        }
        if (user.head > user.questions.length - 1) {
            user.head = 0;
        }
        return user.save();
      })
      .then(user => {
          res.status(200).json(user);
      });
  // console.log("post endpointtttttt", req.body);

  //inside array points at another element until null
    //update question array
    //send back next question
    //change next value to point to index(next)
    //get info client to server(postman)
    //

})

module.exports = router;