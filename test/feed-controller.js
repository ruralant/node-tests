const expect = require('chai').expect;
const sinon = require('sinon');
const mongoose = require('mongoose');

const User = require('../models/user');
const Post = require('../models/post');
const FeedController = require('../controllers/feed');

describe('Feed Controller', function() {
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

  it('should add a new created post to the post array of the creator', function(done) {
    const req = {
      body: {
        title: 'Test Post',
        content: 'This is a test post'
      },
      file: {
        path: 'http://test'
      },
      userId: '537eed02ed345b2e039652d2'
    };
    const res = { status: function() {
      return this;
    }, json: function() {}};

    FeedController.createPost(req, res, () => {}).then(user => {
      expect(user).to.have.property('posts');
      expect(user.posts).to.have.length(1);
      done();
    });
  });

  after(function(done) {
    User.deleteMany({}).then(() => mongoose.disconnect().then(() => done()));
  });
});