'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const { DATABASE_URL } = require('./config');

function dbConnect(url = DATABASE_URL) {
  return mongoose.connect(url)
    .then(instance => {
      const conn = instance.connections[0];
      console.info(`Connected to: mongodb://dev:dev@ds233500.mlab.com:33500/space-rep`);
    })
    .catch(err => {
      console.error('Mongoose failed to connect')
      console.error(err)
      
    });
}

function dbDisconnect() {
  return mongoose.disconnect();
}

function dbGet() {
  return mongoose;
}

module.exports = {
  dbConnect,
  dbDisconnect,
  dbGet
};
