/* global describe, it, expect, before */
/* jshint expr: true */

/* eslint-disable camelcase, no-proto, no-shadow */

const chai = require('chai');
const authenticate = require('../../lib/middleware/authenticate');
const Passport = require('../..').Passport;


describe('middleware/authenticate', () => {
  describe('success with info', () => {
    function Strategy() {
    }
    Strategy.prototype.authenticate = function authenticate() {
      const user = { id: '1', username: 'jaredhanson' };
      this.success(user, { clientId: '123', scope: 'read' });
    };

    const passport = new Passport();
    passport.use('success', new Strategy());

    let request;
    let error;

    before((done) => {
      chai.connect.use(authenticate(passport, 'success'))
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

    it('should not error', () => {
      // eslint-disable-next-line no-unused-expressions
      expect(error).to.be.undefined;
    });

    it('should set user', () => {
      expect(request.user).to.be.an('object');
      expect(request.user.id).to.equal('1');
      expect(request.user.username).to.equal('jaredhanson');
    });

    it('should set authInfo', () => {
      expect(request.authInfo).to.be.an('object');
      expect(Object.keys(request.authInfo)).to.have.length(2);
      expect(request.authInfo.clientId).to.equal('123');
      expect(request.authInfo.scope).to.equal('read');
    });
  });

  describe('success with info that is transformed', () => {
    function Strategy() {
    }
    Strategy.prototype.authenticate = function authenticate() {
      const user = { id: '1', username: 'jaredhanson' };
      this.success(user, { clientId: '123', scope: 'read' });
    };

    const passport = new Passport();
    passport.use('success', new Strategy());
    passport.transformAuthInfo((info, done) => {
      done(null, { clientId: info.clientId, client: { name: 'Foo' }, scope: info.scope });
    });

    let request;
    let error;

    before((done) => {
      chai.connect.use(authenticate(passport, 'success'))
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

    it('should not error', () => {
      // eslint-disable-next-line no-unused-expressions
      expect(error).to.be.undefined;
    });

    it('should set user', () => {
      expect(request.user).to.be.an('object');
      expect(request.user.id).to.equal('1');
      expect(request.user.username).to.equal('jaredhanson');
    });

    it('should set authInfo', () => {
      expect(request.authInfo).to.be.an('object');
      expect(Object.keys(request.authInfo)).to.have.length(3);
      expect(request.authInfo.clientId).to.equal('123');
      expect(request.authInfo.client.name).to.equal('Foo');
      expect(request.authInfo.scope).to.equal('read');
    });
  });

  describe('success with info, but transform that encounters an error', () => {
    function Strategy() {
    }
    Strategy.prototype.authenticate = function authenticate() {
      const user = { id: '1', username: 'jaredhanson' };
      this.success(user, { clientId: '123', scope: 'read' });
    };

    const passport = new Passport();
    passport.use('success', new Strategy());
    passport.transformAuthInfo((info, done) => {
      done(new Error('something went wrong'));
    });

    let request;
    let error;

    before((done) => {
      chai.connect.use(authenticate(passport, 'success'))
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
      expect(error.message).to.equal('something went wrong');
    });

    it('should set user', () => {
      expect(request.user).to.be.an('object');
      expect(request.user.id).to.equal('1');
      expect(request.user.username).to.equal('jaredhanson');
    });

    it('should not set authInfo', () => {
      // eslint-disable-next-line no-unused-expressions
      expect(request.authInfo).to.be.undefined;
    });
  });

  describe('success with info, but option that disables info', () => {
    function Strategy() {
    }
    Strategy.prototype.authenticate = function authenticate() {
      const user = { id: '1', username: 'jaredhanson' };
      this.success(user, { clientId: '123', scope: 'read' });
    };

    const passport = new Passport();
    passport.use('success', new Strategy());

    let request;
    let error;

    before((done) => {
      chai.connect.use(authenticate(passport, 'success', { authInfo: false }))
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

    it('should not error', () => {
      // eslint-disable-next-line no-unused-expressions
      expect(error).to.be.undefined;
    });

    it('should set user', () => {
      expect(request.user).to.be.an('object');
      expect(request.user.id).to.equal('1');
      expect(request.user.username).to.equal('jaredhanson');
    });

    it('should not set authInfo', () => {
      // eslint-disable-next-line no-unused-expressions
      expect(request.authInfo).to.be.undefined;
    });
  });
});
