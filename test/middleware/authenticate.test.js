/* eslint-disable no-shadow */

const chai = require('chai');
const authenticate = require('../../lib/middleware/authenticate');
const { Passport } = require('../..');


describe('middleware/authenticate', () => {
  it('should be named authenticate', () => {
    expect(authenticate().name).to.equal('authenticate');
  });

  describe('with unknown strategy', () => {
    const passport = new Passport();

    let request;
    let error;

    before((done) => {
      chai.connect.use(authenticate(passport, 'foo'))
        .req((req) => {
          request = req;

          req.logIn = function logIn(user, options, done) {
            this.user = user;
            done();
          };
        })
        .next((err) => {
          error = err;
          done();
        })
        .dispatch();
    });

    it('should error', () => {
      expect(error).to.be.an.instanceOf(Error);
      expect(error.message).to.equal('Unknown authentication strategy "foo"');
    });

    it('should not set user', () => {
      // eslint-disable-next-line no-unused-expressions
      expect(request.user).to.be.undefined;
    });

    it('should not set authInfo', () => {
      // eslint-disable-next-line no-unused-expressions
      expect(request.authInfo).to.be.undefined;
    });
  });
});
