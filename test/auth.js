const expect = require('chai').expect;

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
  
  it('should throw and error if the authorization header is only a single string', function () {
    const req = {
      get: function(headerName) {
        return 'gfqdtzviudtvzoq78wt';
      }
    };
    expect(authMiddleware.bind(this, req, {}, () => {})).throw();
  });
});
