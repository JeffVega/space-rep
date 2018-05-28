'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionSchema = new Schema({
  image: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    required: true
  }
});

questionSchema.set('toObject', {
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;