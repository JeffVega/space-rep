'use strict';

const express = require('express');
const QuestionMod = require('../models/question');
const User = require('../models/user')
const Question  = require('../db/seed/questions.json')
const LinkedList = require('../linked-list/linked-list')

const router = express.Router();

router.get('/questions', (req, res) => {

  QuestionMod.find()
    .then(questions => 
      res.json(questions.map(question => question.serialize())))
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});

module.exports = router;