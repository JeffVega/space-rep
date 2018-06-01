'use strict';

const { app } = require('../index');
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { TEST_DATABASE_URL } = require('../config');
const { dbConnect, dbDisconnect } = require('../db-mongoose');
const User = require('../models/user');

const expect = chai.expect;
chai.use(chaiHttp);
process.env.NODE_ENV = 'test';

process.stdout.write('\x1Bc\n');

describe('Lookmark API - Users', function () {
    const fullname = 'Example User';
    const username = 'example';
    const password = 'password123';

    before(function () {
      return mongoose.connect(TEST_DATABASE_URL)
        .then(() => mongoose.connection.db.dropDatabase());
    });

    beforeEach(function () {
       User.ensureIndexes();
    });

    afterEach(function () {
        return mongoose.connection.db.dropDatabase();
    });

    after(function () {
        return mongoose.disconnect();
    });

})