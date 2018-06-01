'use strict';

const express = require('express');
const QuestionMod = require('../models/question');
const User = require('../models/user')
const LinkedList = require('../linked-list/linked-list')
const passport = require('passport');
const router = express.Router();

const jwtAuth = passport.authenticate('jwt', {session:false});

let mainLinkedList = new LinkedList();
console.log('!!!!!!!!!!!!!!!!!!!!!!!', mainLinkedList);
function convertArrayQuestions(arr) {
  arr.forEach(item => {
    mainLinkedList.insertLast(item);
  });
  return mainLinkedList;
}

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

router.get('/question/:id', (req, res, next) => {
  const id = req.params.id;
  QuestionMod.findById(id)
    .exec() //done just find this item directing to .then
    .then( question => {
      res.json(question);
    }) 
    .catch(err=>next);
})


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

//**new head needs to end up on client
//**just switching new head for new question 

router.post('/question/update', jwtAuth, (req, res) => {
  const { input } = req.body;
  console.log(input);
  User.findOne({username:req.user.username})
  .then(user => {
  console.log('​before user---------', user.head);
 
        
      user.questions.map(question => mainLinkedList.insertLast(question) )
      
      console.log('the mainLinkedList​', mainLinkedList );
      const correctAnswer = mainLinkedList.head.value.answer
      user.head = user.questions[0].next
      const nextOne = user.questions[0].next
      console.log('after resetting head*********', user.questions[nextOne].answer)
      // console.log('​correctAnswer',correctAnswer);
      // console.log('​user', user);
      const {input} = req.body
      let userScore = user.score
      let wrongScore = user.wrongTally
       
      let MemryStrength = mainLinkedList.head.value.memoryStrength
      let currNode = mainLinkedList
      // console.log('currNode', currNode);

    //  console.log("the :",input)
        if (correctAnswer === input) {
            console.log('​correctAnswer2', correctAnswer);
            userScore++
            MemryStrength *= 2
            mainLinkedList.insertLast(currNode)

            // console.log('next', next,null,2);
            
            // console.log('mainLinkedList.head',mainLinkedList);
            // mainLinkedList.head.value.memoryStrength = mainLinkedList.head.value.memoryStrength * 2
        }
        else{
          // console.log('MemryStrength before', MemryStrength);
          mainLinkedList.insertAt(currNode, 2)
          console.log('&&&&&&&&&&&&&&&&&&', mainLinkedList);
          const next = mainLinkedList.head.next; 
          // console.log('mainLinkedList.next', mainLinkedList.head.next);
          
          
          // console.log('next', next);
          // const tempNext = mainLinkedList.next.next
          // mainLinkedList.next.next = mainLinkedList.head;
          // user.questions[currentQuestion].next = tempNext; 
          // mainLinkedList.insertAt(mainLinkedList.head,memoryStrength)
          wrongScore++
          MemryStrength = 1
          
        }
        
        
        // mainLinkedList.head.value.memoryStrength = MemryStrength
        user.wrongTally = wrongScore
        console.log('​wrongScore', wrongScore);
        user.score = userScore
        console.log("score!!",userScore)
//  Convert the mainLinkedList back into an Array 
    
       convertListToArray(mainLinkedList)
       
      return user.save()
        .then(()=> {
          return mainLinkedList
        } );
    })
    .then(mainLinkedList => {
      console.log('after user--------', mainLinkedList);
      
        // res.status(200).json(user);
    });
})

// router.post('/question/update', jwtAuth, (req, res) => {
//   const { input } = req.body;
//   console.log(input);
  
//   QuestionMod.findOne({img_url:input.question})
//     .then(answer => {
//       if(answer.answer === input.answer) {
//         User.findOne({username:req.user.username})
//         .then(user => {
//           let userScore = user.score; 
//           userScore++;
//           user.questions.memoryStrength *= 2;
//           res.send('Correct!')
//         })
//       } 
//       else {
//         User.findOne({username:req.user.username})
//         .then(user => {
//           let wrongScore = user.wrongTally;
//           wrongScore++;
//           res.send(`Incorrect. The name is ${answer.answer}`)
//         })

//       }
//     })
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
// })


module.exports = router;