'use strict';

const http = require('http');
const { Passport } = require('../..');
const initialize = require('../../lib/middleware/initialize');

function setupPassport() {
  const passport = new Passport();
  const req = new http.IncomingMessage();
  const middleware = initialize(passport);
  middleware(req, {}, () => {});
  return { passport, req };
}

describe('http.ServerRequest', () => {
  describe('prototoype', () => {
    const { req } = setupPassport();
    it('should be extended with login', () => {
      expect(req.login).to.be.an('function');
      expect(req.login).to.equal(req.logIn);
    });

    it('should be extended with logout', () => {
      expect(req.logout).to.be.an('function');
      expect(req.logout).to.equal(req.logOut);
    });

    it('should be extended with isAuthenticated', () => {
      expect(req.isAuthenticated).to.be.an('function');
    });

    it('should be extended with isUnauthenticated', () => {
      expect(req.isUnauthenticated).to.be.an('function');
    });
  });

  describe('#login', () => {
    describe('passport not in use', () => {
      const { req } = setupPassport();
      const user = { id: '1', username: 'root' };
      delete req._passport;
      it('should throw an exception', () => {
        expect(() => {
          req.logIn(user, () => {});
        }).to.throw(Error, 'passport.initialize() middleware not in use');
      });
    });

    describe('not establishing a session', () => {
      const { req } = setupPassport();
      req._passport.session = {};
      let error;

      before(async () => {
        const user = { id: '1', username: 'root' };

        try {
          await req.login(user, { session: false });
        } catch (err) {
          error = err;
        }
      });

      it('should not error', () => {
        // eslint-disable-next-line no-unused-expressions
        expect(error).to.be.undefined;
      });

      it('should be authenticated', () => {
        // eslint-disable-next-line no-unused-expressions
        expect(req.isAuthenticated()).to.be.true;
        // eslint-disable-next-line no-unused-expressions
        expect(req.isUnauthenticated()).to.be.false;
      });

      it('should set user', () => {
        expect(req.user).to.be.an('object');
        expect(req.user.id).to.equal('1');
        expect(req.user.username).to.equal('root');
      });

      it('should not serialize user', () => {
        // eslint-disable-next-line no-unused-expressions
        expect(req._passport.session.user).to.be.undefined;
      });
    });

    describe('not establishing a session (with done callback)', () => {
      const { req } = setupPassport();
      req._passport.session = {};
      let error;
      let callbackRan;

      before(async () => {
        const user = { id: '1', username: 'root' };

        try {
          await req.login(user, { session: false }, () => {
            callbackRan = true;
          });
        } catch (err) {
          error = err;
        }
      });

      it('should not error', () => {
        // eslint-disable-next-line no-unused-expressions
        expect(error).to.be.undefined;
      });

      it('should be authenticated', () => {
        // eslint-disable-next-line no-unused-expressions
        expect(req.isAuthenticated()).to.be.true;
        // eslint-disable-next-line no-unused-expressions
        expect(req.isUnauthenticated()).to.be.false;
      });

      it('should set user', () => {
        expect(req.user).to.be.an('object');
        expect(req.user.id).to.equal('1');
        expect(req.user.username).to.equal('root');
      });

      it('should not serialize user', () => {
        // eslint-disable-next-line no-unused-expressions
        expect(req._passport.session.user).to.be.undefined;
      });

      it('should run callback', () => {
        // eslint-disable-next-line no-unused-expressions
        expect(callbackRan).to.be.true;
      });
    });

    describe('not establishing a session and setting custom user property', () => {
      const { req, passport } = setupPassport();
      req._passport.session = {};
      passport._userProperty = 'currentUser';
      let error;

      before(async () => {
        const user = { id: '1', username: 'root' };

        try {
          await req.login(user, { session: false });
        } catch (err) {
          error = err;
        }
      });

      it('should not error', () => {
        // eslint-disable-next-line no-unused-expressions
        expect(error).to.be.undefined;
      });

      it('should be authenticated', () => {
        // eslint-disable-next-line no-unused-expressions
        expect(req.isAuthenticated()).to.be.true;
        // eslint-disable-next-line no-unused-expressions
        expect(req.isUnauthenticated()).to.be.false;
      });

      it('should not set user', () => {
        // eslint-disable-next-line no-unused-expressions
        expect(req.user).to.be.undefined;
      });

      it('should set custom user', () => {
        expect(req.currentUser).to.be.an('object');
        expect(req.currentUser.id).to.equal('1');
        expect(req.currentUser.username).to.equal('root');
      });

      it('should not serialize user', () => {
        // eslint-disable-next-line no-unused-expressions
        expect(req._passport.session.user).to.be.undefined;
      });
    });

    describe('not establishing a session and invoked without a callback', async () => {
      const { req } = setupPassport();
      req._passport.session = {};

      const user = { id: '1', username: 'root' };
      await req.login(user, { session: false });

      it('should be authenticated', () => {
        // eslint-disable-next-line no-unused-expressions
        expect(req.isAuthenticated()).to.be.true;
        // eslint-disable-next-line no-unused-expressions
        expect(req.isUnauthenticated()).to.be.false;
      });

      it('should set user', () => {
        expect(req.user).to.be.an('object');
        expect(req.user.id).to.equal('1');
        expect(req.user.username).to.equal('root');
      });

      it('should not serialize user', () => {
        // eslint-disable-next-line no-unused-expressions
        expect(req._passport.session.user).to.be.undefined;
      });
    });

    describe('not establishing a session, without passport.initialize() middleware', () => {
      const { req } = setupPassport();
      let error;

      before(async () => {
        const user = { id: '1', username: 'root' };

        try {
          await req.login(user, { session: false });
        } catch (err) {
          error = err;
        }
      });

      it('should not error', () => {
        // eslint-disable-next-line no-unused-expressions
        expect(error).to.be.undefined;
      });

      it('should be authenticated', () => {
        // eslint-disable-next-line no-unused-expressions
        expect(req.isAuthenticated()).to.be.true;
        // eslint-disable-next-line no-unused-expressions
        expect(req.isUnauthenticated()).to.be.false;
      });

      it('should set user', () => {
        expect(req.user).to.be.an('object');
        expect(req.user.id).to.equal('1');
        expect(req.user.username).to.equal('root');
      });
    });

    describe('establishing a session', () => {
      const { req, passport } = setupPassport();
      passport.serializeUser((rq, user, done) => {
        done(null, user.id);
      });
      let error;

      before(async () => {
        const user = { id: '1', username: 'root' };

        try {
          await req.login(user);
        } catch (err) {
          error = err;
        }
      });

      it('should not error', () => {
        // eslint-disable-next-line no-unused-expressions
        expect(error).to.be.undefined;
      });

      it('should be authenticated', () => {
        // eslint-disable-next-line no-unused-expressions
        expect(req.isAuthenticated()).to.be.true;
        // eslint-disable-next-line no-unused-expressions
        expect(req.isUnauthenticated()).to.be.false;
      });

      it('should set user', () => {
        expect(req.user).to.be.an('object');
        expect(req.user.id).to.equal('1');
        expect(req.user.username).to.equal('root');
      });

      it('should serialize user', () => {
        expect(req._passport.session.user).to.equal('1');
      });
    });

    describe('establishing a session with a done callback', () => {
      const { req, passport } = setupPassport();
      passport.serializeUser((rq, user, done) => {
        done(null, user.id);
      });
      let error;

      before(async () => {
        const user = { id: '1', username: 'root' };

        let invokedDone = false;
        try {
          await req.login(user, function doneCallback() {
            invokedDone = true;
          });
          if (!invokedDone) {
            throw new Error('Did not invoke `done` callback');
          }
        } catch (err) {
          error = err;
        }
      });

      it('should not error', () => {
        // eslint-disable-next-line no-unused-expressions
        expect(error).to.be.undefined;
      });

      it('should be authenticated', () => {
        // eslint-disable-next-line no-unused-expressions
        expect(req.isAuthenticated()).to.be.true;
        // eslint-disable-next-line no-unused-expressions
        expect(req.isUnauthenticated()).to.be.false;
      });

      it('should set user', () => {
        expect(req.user).to.be.an('object');
        expect(req.user.id).to.equal('1');
        expect(req.user.username).to.equal('root');
      });

      it('should serialize user', () => {
        expect(req._passport.session.user).to.equal('1');
      });
    });

    describe('establishing a session and setting custom user property', () => {
      const { req, passport } = setupPassport();
      passport.serializeUser((rq, user, done) => {
        done(null, user.id);
      });
      passport._userProperty = 'currentUser';

      let error;

      before(async () => {
        const user = { id: '1', username: 'root' };

        try {
          await req.login(user);
        } catch (err) {
          error = err;
        }
      });

      it('should not error', () => {
        // eslint-disable-next-line no-unused-expressions
        expect(error).to.be.undefined;
      });

      it('should be authenticated', () => {
        // eslint-disable-next-line no-unused-expressions
        expect(req.isAuthenticated()).to.be.true;
        // eslint-disable-next-line no-unused-expressions
        expect(req.isUnauthenticated()).to.be.false;
      });

      it('should not set user', () => {
        // eslint-disable-next-line no-unused-expressions
        expect(req.user).to.be.undefined;
      });

      it('should set custom user', () => {
        expect(req.currentUser).to.be.an('object');
        expect(req.currentUser.id).to.equal('1');
        expect(req.currentUser.username).to.equal('root');
      });

      it('should serialize user', () => {
        expect(req._passport.session.user).to.equal('1');
      });
    });

    describe('encountering an error when serializing to session', () => {
      const { req, passport } = setupPassport();
      req._passport.session = {};
      passport.serializeUser((rq, user, done) => {
        done(new Error('something went wrong'));
      });

      let error;

      before(async () => {
        const user = { id: '1', username: 'root' };

        try {
          await req.login(user);
        } catch (err) {
          error = err;
        }
      });

      it('should error', () => {
        expect(error).to.be.an.instanceOf(Error);
        expect(error.message).to.equal('something went wrong');
      });

      it('should not be authenticated', () => {
        // eslint-disable-next-line no-unused-expressions
        expect(req.isAuthenticated()).to.be.false;
        // eslint-disable-next-line no-unused-expressions
        expect(req.isUnauthenticated()).to.be.true;
      });

      it('should not set user', () => {
        // eslint-disable-next-line no-unused-expressions
        expect(req.user).to.be.null;
      });

      it('should not serialize user', () => {
        // eslint-disable-next-line no-unused-expressions
        expect(req._passport.session.user).to.be.undefined;
      });
    });

    describe('encountering an error when serializing to session with callback', () => {
      const { req, passport } = setupPassport();
      req._passport.session = {};
      passport.serializeUser((rq, user, done) => {
        done(new Error('something went wrong'));
      });

      let callbackError;

      before((done) => {
        const user = { id: '1', username: 'root' };

        try {
          req.login(user, (err) => {
            callbackError = err;
            done();
          });
        } catch (err) {
          done(err);
        }
      });

      it('should error', () => {
        expect(callbackError).to.be.an.instanceOf(Error);
        expect(callbackError.message).to.equal('something went wrong');
      });

      it('should not be authenticated', () => {
        // eslint-disable-next-line no-unused-expressions
        expect(req.isAuthenticated()).to.be.false;
        // eslint-disable-next-line no-unused-expressions
        expect(req.isUnauthenticated()).to.be.true;
      });

      it('should not set user', () => {
        // eslint-disable-next-line no-unused-expressions
        expect(req.user).to.be.null;
      });

      it('should not serialize user', () => {
        // eslint-disable-next-line no-unused-expressions
        expect(req._passport.session.user).to.be.undefined;
      });
    });

    describe('establishing a session, but not passing a callback argument', () => {
      const { req, passport } = setupPassport();
      passport.serializeUser(() => {
        return Promise.resolve(user.id);
      });

      const user = { id: '1', username: 'root' };

      it('should not throw an exception', () => {
        expect(async () => {
          await req.login(user);
        }).to.not.throw(Error, 'req#login no longer requires a callback function');
      });
    });
  });


  describe('#logout', () => {
    describe('existing session', () => {
      const { req } = setupPassport();
      req.user = { id: '1', username: 'root' };
      req._passport.session = {};
      req._passport.session.user = '1';

      req.logout();

      it('should not be authenticated', () => {
        // eslint-disable-next-line no-unused-expressions
        expect(req.isAuthenticated()).to.be.false;
        // eslint-disable-next-line no-unused-expressions
        expect(req.isUnauthenticated()).to.be.true;
      });

      it('should clear user', () => {
        // eslint-disable-next-line no-unused-expressions
        expect(req.user).to.be.null;
      });

      it('should clear serialized user', () => {
        // eslint-disable-next-line no-unused-expressions
        expect(req._passport.session.user).to.be.undefined;
      });
    });

    describe('existing session and clearing custom user property', () => {
      const { req } = setupPassport();
      req.currentUser = { id: '1', username: 'root' };
      req._passport.instance._userProperty = 'currentUser';
      req._passport.session = {};
      req._passport.session.user = '1';

      req.logout();

      it('should not be authenticated', () => {
        // eslint-disable-next-line no-unused-expressions
        expect(req.isAuthenticated()).to.be.false;
        // eslint-disable-next-line no-unused-expressions
        expect(req.isUnauthenticated()).to.be.true;
      });

      it('should clear user', () => {
        // eslint-disable-next-line no-unused-expressions
        expect(req.currentUser).to.be.null;
      });

      it('should clear serialized user', () => {
        // eslint-disable-next-line no-unused-expressions
        expect(req._passport.session.user).to.be.undefined;
      });
    });

    describe('existing session, without passport.initialize() middleware', () => {
      const { req } = setupPassport();
      delete req._passport;

      req.user = { id: '1', username: 'root' };

      req.logout();

      it('should not be authenticated', () => {
        // eslint-disable-next-line no-unused-expressions
        expect(req.isAuthenticated()).to.be.false;
        // eslint-disable-next-line no-unused-expressions
        expect(req.isUnauthenticated()).to.be.true;
      });

      it('should clear user', () => {
        // eslint-disable-next-line no-unused-expressions
        expect(req.user).to.be.null;
      });
    });

    describe('existing session, without passport.initialize() middleware but with an `instance` without a `_userProperty`', () => {
      const { req } = setupPassport();
      delete req._passport.instance._userProperty;

      req.user = { id: '1', username: 'root' };

      req.logout();

      it('should not be authenticated', () => {
        // eslint-disable-next-line no-unused-expressions
        expect(req.isAuthenticated()).to.be.false;
        // eslint-disable-next-line no-unused-expressions
        expect(req.isUnauthenticated()).to.be.true;
      });

      it('should clear user', () => {
        // eslint-disable-next-line no-unused-expressions
        expect(req.user).to.be.null;
      });
    });
  });


  describe('#isAuthenticated', () => {
    describe('with a user', () => {
      const { req } = setupPassport();
      req.user = { id: '1', username: 'root' };

      it('should be authenticated', () => {
        // eslint-disable-next-line no-unused-expressions
        expect(req.isAuthenticated()).to.be.true;
        // eslint-disable-next-line no-unused-expressions
        expect(req.isUnauthenticated()).to.be.false;
      });
    });

    describe('with a user set on custom property', () => {
      const { req } = setupPassport();
      req.currentUser = { id: '1', username: 'root' };
      req._passport.instance._userProperty = 'currentUser';

      it('should be authenticated', () => {
        // eslint-disable-next-line no-unused-expressions
        expect(req.isAuthenticated()).to.be.true;
        // eslint-disable-next-line no-unused-expressions
        expect(req.isUnauthenticated()).to.be.false;
      });
    });

    describe('without a user', () => {
      const { req } = setupPassport();

      it('should not be authenticated', () => {
        // eslint-disable-next-line no-unused-expressions
        expect(req.isAuthenticated()).to.be.false;
        // eslint-disable-next-line no-unused-expressions
        expect(req.isUnauthenticated()).to.be.true;
      });
    });

    describe('with a null user', () => {
      const { req } = setupPassport();
      req.user = null;

      it('should not be authenticated', () => {
        // eslint-disable-next-line no-unused-expressions
        expect(req.isAuthenticated()).to.be.false;
        // eslint-disable-next-line no-unused-expressions
        expect(req.isUnauthenticated()).to.be.true;
      });
    });
  });
});
