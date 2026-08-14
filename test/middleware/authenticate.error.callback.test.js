'use strict';

const chai = require('chai');
const { Passport } = require('../../lib/index.js');
const authenticate = require('../../lib/middleware/authenticate.js');

describe('middleware/authenticate', () => {
  describe('error with callback', () => {
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
      function callback(e) {
        error = e;
        done();
      }

      chai.connect.use(authenticate(passport, 'error', callback))
        .req((req) => {
          request = req;
        })
        .dispatch();
    });

    it('should pass error to callback', () => {
      expect(error).to.be.an.instanceOf(Error);
      expect(error.message).to.equal('something is wrong');
    });

    it('should pass user as undefined to callback', () => {
      expect(request.user).to.be.undefined;
    });

    it('should not set user on request', () => {
      expect(request.user).to.be.undefined;
    });
  });

  describe('error with callback and options passed to middleware', () => {
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
      function callback(e) {
        error = e;
        done();
      }

      chai.connect.use(authenticate(passport, 'error', { foo: 'bar' }, callback))
        .req((req) => {
          request = req;
        })
        .dispatch();
    });

    it('should pass error to callback', () => {
      expect(error).to.be.an.instanceOf(Error);
      expect(error.message).to.equal('something is wrong');
    });

    it('should pass user as undefined to callback', () => {
      expect(request.user).to.be.undefined;
    });

    it('should not set user on request', () => {
      expect(request.user).to.be.undefined;
    });
  });
});
