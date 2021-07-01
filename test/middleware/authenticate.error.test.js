'use strict';

const chai = require('chai');
const authenticate = require('../../lib/middleware/authenticate.js');
const { Passport } = require('../../lib/index.js');


describe('middleware/authenticate', () => {
  describe('error', () => {
    class Strategy {
      authenticate() {
        this.error(new Error('something is wrong'));
      }
    }

    const passport = new Passport();
    passport.use('error', new Strategy());

    let request;
    let error;

    before((done) => {
      chai.connect.use(authenticate(passport, 'error'))
        .req((req) => {
          request = req;
        })
        .next((err) => {
          error = err;
          done();
        })
        .dispatch();
    });

    it('should error', () => {
      expect(error).to.be.an.instanceOf(Error);
      expect(error.message).to.equal('something is wrong');
    });

    it('should not set user', () => {
      expect(request.user).to.be.undefined;
    });
  });
});
