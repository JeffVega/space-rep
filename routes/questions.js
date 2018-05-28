'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const Question = require('../models/question');

const router = express.Router();
const jsonParser = bodyParser.json();

router.get('/:id', (req, res) => {
    Question.findById(req.params.id)
      .then(question => {
          res.sendFile('image/' + question.image);
      })
      .catch(error => {
          console.log(error);
      })
})