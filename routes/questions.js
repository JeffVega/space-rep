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
  console.log(req.user)

  User.findById(req.user.id)
  .then(user =>{
    console.log('this is here',results)
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

//**new head needs to end up on client
//**just switching new head for new question 

router.post('/question/update', jwtAuth, (req, res) => {
  const { input } = req.body;

  User.findOne({username:req.user.username})
  .then(user => {

 
      let mainLinkedList = new LinkedList();
      // user.questions
      console.log('​user.questions', user.questions);
      user.questions.map(question => mainLinkedList.insertLast(question) )
      console.log("the size is :",size(mainLinkedList))
      //debug here first
      console.log('the mainLinkedList',JSON.stringify( mainLinkedList,null,2));
      const correctAnswer = mainLinkedList.head.value.answer
      const sizeList = size(mainLinkedList)
      const {input} = req.body
      console.log("this is our user",user.questions[0].memoryStrength)
      let userScore = user.score
      let wrongScore = user.wrongTally
    //   questions: [
    //     {
    //         _id: mongoose.Schema.Types.ObjectId,
    //         questions: String,
    //         answer: String,
    //         img_url:String,
    //         memoryStrength: {type: Number, default:1},
    //         next: {type: String}
    //     }
    // ]
      let memoryStrength = mainLinkedList.head.value.memoryStrength
      let currNode = mainLinkedList
        if (correctAnswer === input) {
            console.log('correctAnswer2', correctAnswer);
            userScore++
            memoryStrength *= 2
            console.log('​memoryStrength before', memoryStrength);
        mainLinkedList.head.value.memoryStrength = memoryStrength
        console.log('​memoryStrength', memoryStrength);
            // mainLinkedList.insertLast(mainLinkedList.head.value)
            // displayAndRemove(currNode)
            // // console.log('​mainLinkedList.insertLast(currNode)', mainLinkedList.insertLast(currNode));
            
            console.log('​memoryStrength!!!!!', memoryStrength);
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
        console.log('​memoryStrength before', memoryStrength);
        mainLinkedList.head.value.memoryStrength = memoryStrength
        console.log('​memoryStrength', memoryStrength);
        
        console.log('user score before ​',wrongScore );
        user.wrongTally = wrongScore
        console.log('wrongScore', wrongScore);
        console.log('user score before ​',userScore );
        user.score = userScore
        console.log("score!!",userScore)
        
          console.log('​mainLinkedList before entering array',JSON.stringify( mainLinkedList,null,2));
          user.questions =  convertListToArray(mainLinkedList)
          console.log('​user.questions', user.questions);
           

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
      // console.log('after user--------', user);
      
        res.status(200).json(user);
    });
})



module.exports = router;