'use strict';

const express = require('express');
const QuestionMod = require('../models/question');
const User = require('../models/user')
const {LinkedList,size,displayAndRemove,displayFirstQuestion} = require('../linked-list/linked-list')
const passport = require('passport');
const router = express.Router();
const jwtAuth = passport.authenticate('jwt', {session:false});


function convertListToArray(list) {
  const arr = [];
  let currentNode = list.head;
  while (currentNode.next !== null) {
    arr.push(currentNode.value);
    currentNode = currentNode.next;
  }
  arr.push(currentNode.value);
  return arr;
}

router.get('/question',(req,res) =>{

  QuestionMod.find({})
  .then(results =>{
    res.json(results)
  })
  .catch(err => {
    next(err)
  })
});

router.get('/question/:id',jwtAuth,(req, res, next) => {
  User.findById(req.user.id)
  .then(user =>{
      res.json(user.questions);
    }) 
    .catch(err=>next);
})


router.post('/question', (req, res) => {
  const {img_url,answer} = req.body;
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

  User.findOne({username:req.user.username})
  .then(user => {
      let mainLinkedList = new LinkedList();
      user.questions.map(question => mainLinkedList.insertLast(question) )
      const correctAnswer = mainLinkedList.head.value.answer
      const sizeList = size(mainLinkedList)
      const {input} = req.body
      let userScore = user.score
      let wrongScore = user.wrongTally
      let memoryStrength = mainLinkedList.head.value.memoryStrength
      let currNode = mainLinkedList
        if (correctAnswer === input) {
            userScore++
            memoryStrength *= 2
        mainLinkedList.head.value.memoryStrength = memoryStrength
            if(sizeList <= memoryStrength){
              memoryStrength =  sizeList
              const mainLinkedListM = mainLinkedList.head.value
              mainLinkedList.insertLast(mainLinkedListM)
              displayAndRemove(currNode)
            }
            else{
              const mainLinkedListM = mainLinkedList.head.value
              mainLinkedList.insertLast(mainLinkedListM)
              displayAndRemove(currNode)
              
            }
          
        }
        else{
           wrongScore++
           memoryStrength = 1
          const MSM = mainLinkedList.head.value
          mainLinkedList.insertAt(MSM,memoryStrength + 1 )
          displayAndRemove(currNode)
        }
        // mainLinkedList.head.value.memoryStrength = memoryStrength
        user.wrongTally = wrongScore
        user.score = userScore
          user.questions =  convertListToArray(mainLinkedList)     

      return User.updateOne({username:req.user.username},{
        $set:{
          questions:user.questions,
          score:user.score,
          wrongTally:user.wrongTally
        }
      })
        .then(()=> {
          return User.findOne({username:req.user.username});
        } );
    })
    .then(user => {
        res.status(200).json(user);
    });
})



module.exports = router;