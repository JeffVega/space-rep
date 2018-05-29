'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    fullname: {type: String},
    username: {type: String, required:true, unique:true},
    password: {type: String, required:true},
    question: [{
        question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true
    },
        prev: Number,
        next: Number
    }]
});
 

userSchema.set('toObject', {
transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.password;
}
});

userSchema.methods.validatePassword = function (password) {
return bcrypt.compare(password, this.password);
};

userSchema.statics.hashPassword = function (password) {
    return bcrypt.hash(password, 10);
};
  
module.exports = mongoose.model('User', userSchema);