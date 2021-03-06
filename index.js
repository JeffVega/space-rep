'use strict';
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const passport = require('passport');
const localStrategy = require('./passport/local');
const jwtStrategy = require('./passport/jwt');

const { PORT, CLIENT_ORIGIN } = require('./config');
const { dbConnect } = require('./db-mongoose');
// const {dbConnect} = require('./db-knex');

const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const questionRouter = require('./routes/questions');

const app = express();
passport.use(jwtStrategy);
passport.use(localStrategy);

app.use(
  morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
    skip: (req, res) => process.env.NODE_ENV === 'test'
  })
);


app.use(express.json());

app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
);

app.use('/api', usersRouter);

app.use('/api', authRouter);

app.use('/api', questionRouter);

app.use(passport.authenticate('jwt', { session: false, failWithError: true }));
function runServer(port = PORT) {
  const server = app
    .listen(port, () => {
      console.info(`App listening on port ${server.address().port}`);
    })
    .on('error', err => {
      console.error('Express failed to start');
      console.error(err);
    });
}

if (require.main === module) {
  dbConnect();
  runServer();
}

module.exports = { app };
