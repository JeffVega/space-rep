# What Do You Meme?

```
Main Endpoints: 

Create a new user:
  POST: /api/users

Get a question: 
  GET: /api/question
 
Answer a question:
  POST: /api/question
    Requires
      { img_url, answer } in req.body;

Update list: 
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
         
```
