'use strict';

const chai = require('chai');
const authenticate = require('../../lib/middleware/authenticate');
const { Passport } = require('../..');


describe('middleware/authenticate', () => {
  describe('success with callback', () => {
    class Strategy {
      authenticate() {
        const user = { id: '1', username: 'jaredhanson' };
        this.success(user, { message: 'Hello' });
      }
    }

    const passport = new Passport();
    passport.use('success', new Strategy());

    let request;
    let error;
    let user;
    let info;

    before((done) => {
      function callback(e, u, i) {
        error = e;
        user = u;
        info = i;
        done();
      }

      chai.connect.use(authenticate(passport, 'success', callback))
        .req((req) => {
          request = req;
        })
        .dispatch();
    });

    it('should not error', () => {
      // eslint-disable-next-line no-unused-expressions
      expect(error).to.be.null;
    });

    it('should pass user to callback', () => {
      expect(user).to.be.an('object');
      expect(user.id).to.equal('1');
      expect(user.username).to.equal('jaredhanson');
    });

    it('should pass info to callback', () => {
      expect(info).to.be.an('object');
      expect(info.message).to.equal('Hello');
    });

    it('should not set user on request', () => {
      // eslint-disable-next-line no-unused-expressions
      expect(request.user).to.be.undefined;
    });

    it('should not set authInfo on request', () => {
      // eslint-disable-next-line no-unused-expressions
      expect(request.authInfo).to.be.undefined;
    });
  });

  describe('success with callback and options passed to middleware', () => {
    class Strategy {
      authenticate() {
        const user = { id: '1', username: 'jaredhanson' };
        this.success(user, { message: 'Hello' });
      }
    }

    const passport = new Passport();
    passport.use('success', new Strategy());

    let request;
    let error;
    let user;
    let info;

    before((done) => {
      function callback(e, u, i) {
        error = e;
        user = u;
        info = i;
        done();
      }

      chai.connect.use(authenticate(passport, 'success', { foo: 'bar' }, callback))
        .req((req) => {
          request = req;
        })
        .dispatch();
    });

    it('should not error', () => {
      // eslint-disable-next-line no-unused-expressions
      expect(error).to.be.null;
    });

    it('should pass user to callback', () => {
      expect(user).to.be.an('object');
      expect(user.id).to.equal('1');
      expect(user.username).to.equal('jaredhanson');
    });

    it('should pass info to callback', () => {
      expect(info).to.be.an('object');
      expect(info.message).to.equal('Hello');
    });

    it('should not set user on request', () => {
      // eslint-disable-next-line no-unused-expressions
      expect(request.user).to.be.undefined;
    });

    it('should not set authInfo on request', () => {
      // eslint-disable-next-line no-unused-expressions
      expect(request.authInfo).to.be.undefined;
    });
  });
});
