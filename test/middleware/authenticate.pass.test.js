const chai = require('chai');
const authenticate = require('../../lib/middleware/authenticate');
const { Passport } = require('../..');


describe('middleware/authenticate', () => {
  describe('pass', () => {
    class Strategy {
      authenticate() {
        this.pass();
      }
    }

    const passport = new Passport();
    passport.use('pass', new Strategy());

    let request;
    let error;

    before((done) => {
      chai.connect.use(authenticate(passport, 'pass'))
        .req((req) => {
          request = req;
        })
        .next((err) => {
          error = err;
          done();
        })
        .dispatch();
    });

    it('should not error', () => {
      // eslint-disable-next-line no-unused-expressions
      expect(error).to.be.undefined;
    });

    it('should not set user', () => {
      // eslint-disable-next-line no-unused-expressions
      expect(request.user).to.be.undefined;
    });
  });
});
