const expect = require('chai').expect;
const jwt = require('jsonwebtoken');
const sinon = require('sinon');

const authMiddleware = require('../middleware/is-auth');

describe('Auth middleware', function() {
  it('should throw an error if no auth header is present', function() {
    const req = {
      get: function(headerName) {
        return null;
      }
    };
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw('Not authenticated.');
  });
  
  it('should throw an error if the authorization header is only a single string', function() {
    const req = {
      get: function(headerName) {
        return 'gfqdtzviudtvzoq78wt';
      }
    };
    expect(authMiddleware.bind(this, req, {}, () => {})).throw();
  });

  it('should return a userId after decoding the token', function() {
    const req = {
      get: function(headerName) {
        return 'Bearer gfqdtzviudtv';
      }
    };
    sinon.stub(jwt, 'verify');
    jwt.verify.returns({userId: '1a2b3c'});
    authMiddleware(req, {}, () => {});
    expect(req).to.have.property('userId');
    expect(req).to.have.property('userId', '1a2b3c');
    expect(jwt.verify.called).to.be.true;
    jwt.verify.restore();
  });

  it('should throw an error if the token can not be verified', function() {
    const req = {
      get: function(headerName) {
        return 'Bearer gfqdtzviudtvzoq78wt';
      }
    };
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
  });
});
