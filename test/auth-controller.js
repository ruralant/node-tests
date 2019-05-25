const expect = require('chai').expect;
const sinon = require('sinon');
const mongoose = require('mongoose');

const User = require('../models/user');
const AuthController = require('../controllers/auth');

describe('Auth Controller', function() {
  before(function(done) {
    mongoose.connect(process.env.MONGODB_TEST_URI).then(() => {
      const user = new User({
        _id: '537eed02ed345b2e039652d2',
        email: 'test@node.com',
        password: 'password',
        name: 'Test',
        posts: []
      });
      return user.save();
    }).then(() => done());
  });

  it('should throw an error in fails to interact with the database', function(done) {
    sinon.stub(User, 'findOne');
    User.findOne.throws();

    const req = {
      body: {
        email: 'test@node.com',
        password: 'password'
      }
    };

    AuthController.login(req, {}, () => {}).then(result => {
      expect(result).to.be.an('error')
      expect(result).to.have.property('statusCode', 500);
      done();
    })

    User.findOne.restore();
  });

  it('should send a response with a valid user status if found on the database', function(done) {
    const req = {userId: '537eed02ed345b2e039652d2'};
    const res = {
      statusCode: 500,
      userStatus: null,
      status: function(code) {
        this.statusCode = code;
        return this;
      },
      json: function(data) {
        this.userStatus = data.status;
      }
    };
    AuthController.getUserStatus(req, res, () => {}).then(() => {
      expect(res.statusCode).to.be.equal(200);
      expect(res.userStatus).to.be.equal('New User');
      done();
    });
  });

  after(function(done) {
    User.deleteMany({}).then(() => mongoose.disconnect().then(() => done()));
  });
});