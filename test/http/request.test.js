/* global describe, it, expect, before */
/* jshint expr: true */

/* eslint-disable camelcase, no-proto, no-shadow */

const http = require('http');
const Passport = require('../..').Passport;
const initialize = require('../../lib/middleware/initialize');

function setup() {
  const passport = new Passport();
  const req = new http.IncomingMessage();
  const middleware = initialize(passport);
  middleware(req, {}, () => {});
  return { passport, req };
}

describe('http.ServerRequest', () => {
  describe('prototoype', () => {
    const { req } = setup();
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
    describe('not establishing a session', () => {
      const { req } = setup();
      req._passport.session = {};
      let error;

      before((done) => {
        const user = { id: '1', username: 'root' };

        req.login(user, { session: false }, (err) => {
          error = err;
          done();
        });
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

    describe('not establishing a session and setting custom user property', () => {
      const { req, passport } = setup();
      req._passport.session = {};
      passport._userProperty = 'currentUser';
      let error;

      before((done) => {
        const user = { id: '1', username: 'root' };

        req.login(user, { session: false }, (err) => {
          error = err;
          done();
        });
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

    describe('not establishing a session and invoked without a callback', () => {
      const { req } = setup();
      req._passport.session = {};

      const user = { id: '1', username: 'root' };
      req.login(user, { session: false });

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
      const { req } = setup();
      let error;

      before((done) => {
        const user = { id: '1', username: 'root' };

        req.login(user, { session: false }, (err) => {
          error = err;
          done();
        });
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
      const { req, passport } = setup();
      passport.serializeUser((user, done) => {
        done(null, user.id);
      });
      let error;

      before((done) => {
        const user = { id: '1', username: 'root' };

        req.login(user, (err) => {
          error = err;
          done();
        });
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
      const { req, passport } = setup();
      passport.serializeUser((user, done) => {
        done(null, user.id);
      });
      passport._userProperty = 'currentUser';

      let error;

      before((done) => {
        const user = { id: '1', username: 'root' };

        req.login(user, (err) => {
          error = err;
          done();
        });
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
      const { req, passport } = setup();
      req._passport.session = {};
      passport.serializeUser((user, done) => {
        done(new Error('something went wrong'));
      });

      let error;

      before((done) => {
        const user = { id: '1', username: 'root' };

        req.login(user, (err) => {
          error = err;
          done();
        });
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

    describe('establishing a session, but not passing a callback argument', () => {
      const { req, passport } = setup();
      passport.serializeUser((user, done) => {
        done(null, user.id);
      });

      const user = { id: '1', username: 'root' };

      it('should throw an exception', () => {
        expect(() => {
          req.login(user);
        }).to.throw(Error, 'req#login requires a callback function');
      });
    });
  });


  describe('#logout', () => {
    describe('existing session', () => {
      const { req } = setup();
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
      const { req } = setup();
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
      const { req } = setup();
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
      const { req } = setup();
      req.user = { id: '1', username: 'root' };

      it('should be authenticated', () => {
        // eslint-disable-next-line no-unused-expressions
        expect(req.isAuthenticated()).to.be.true;
        // eslint-disable-next-line no-unused-expressions
        expect(req.isUnauthenticated()).to.be.false;
      });
    });

    describe('with a user set on custom property', () => {
      const { req } = setup();
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
      const { req } = setup();

      it('should not be authenticated', () => {
        // eslint-disable-next-line no-unused-expressions
        expect(req.isAuthenticated()).to.be.false;
        // eslint-disable-next-line no-unused-expressions
        expect(req.isUnauthenticated()).to.be.true;
      });
    });

    describe('with a null user', () => {
      const { req } = setup();
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
