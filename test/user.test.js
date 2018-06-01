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

describe('WHAT DO YOU MEME API - Users', function () {
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

    describe('/api/users', function () {
        describe('POST', function () {
            it.only('should reject users with a missing username', function () {
                const user = { password };
                return chai.request(app)
                .post('/api/users')
                .send(user)
                .catch(err => err.response)
                .then(res => {
                    expect(res).to.have.status(422);
                    expect(res.body.message).to.equal('Missing username in request body');
                });
            });
    
            it('should reject users with a missing password', function() {
                const user = { username, fullname };
                return chai.request(app)
                .post('/api/users')
                .send(user)
                .catch(err => err.response)
                .then(res => {
                    expect(res).to.have.status(422);
                    expect(res.body.message).to.equal('Missing password in request body');
                });
            });
    
            it('Should reject users with non-trimmed password', function () {
                return chai
                  .request(app)
                  .post('/api/users')
                  .send({ username, password: ` ${password}`, fullname })
                  .catch(err => err.response)
                  .then(res => {
                    expect(res).to.have.status(422);
                    expect(res.body.message).to.equal('Field: \'password\' cannot start or end with whitespace');
                  });
              });
        })
    });

})