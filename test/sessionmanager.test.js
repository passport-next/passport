'use strict';

const SessionManager = require('../lib/sessionmanager.js');


describe('SessionManager', () => {
  describe('#constuctor', () => {
    it('accept two arguments', () => {
      const func = () => { };
      const options = { key: 'test' };
      const sessionManager = new SessionManager(options, func);
      expect(sessionManager._serializeUser).to.equal(func);
      expect(sessionManager._key).to.equal('test');
    });
    it('accept one argument', () => {
      const func = () => { };
      const sessionManager = new SessionManager(func);
      expect(sessionManager._serializeUser).to.equal(func);
      expect(sessionManager._key).to.equal('passport');
    });
  });
  describe('#logIn', () => {
    const func = (user /* , req */) => {
      return JSON.stringify(user);
    };
    const sessionManager = new SessionManager(func);
    const user = {
      username: 'dummy'
    };
    const req = {
      _passport: {}
    };
    before((done) => {
      sessionManager.logIn(req, user, done);
    });
    it('serializes user', () => {
      expect(req.session.passport.user).to.equal('{"username":"dummy"}');
    });
  });
  describe('#logIn (with pre-provided private passport session)', () => {
    const func = (user /* , req */) => {
      return JSON.stringify(user);
    };
    const sessionManager = new SessionManager(func);
    const user = {
      username: 'dummy'
    };
    const req = {
      _passport: {
        session: {}
      }
    };
    before((done) => {
      sessionManager.logIn(req, user, done);
    });
    it('serializes user', () => {
      expect(req.session.passport.user).to.equal('{"username":"dummy"}');
    });
  });
  describe('#logIn (with pre-provided session)', () => {
    const func = (user /* , req */) => {
      return JSON.stringify(user);
    };
    const sessionManager = new SessionManager(func);
    const user = {
      username: 'dummy'
    };
    const req = {
      _passport: {
      },
      session: {}
    };
    before((done) => {
      sessionManager.logIn(req, user, done);
    });
    it('serializes user', () => {
      expect(req.session.passport.user).to.equal('{"username":"dummy"}');
    });
  });
  describe('#logIn (erring with callback)', () => {
    const func = (/* user, req */) => {
      throw new Error('Bad serializer');
    };
    const sessionManager = new SessionManager(func);
    const user = {
      username: 'dummy'
    };
    const req = {
      _passport: {}
    };
    it('does not throw with callback and bad serializer', (done) => {
      expect(() => {
        sessionManager.logIn(req, user, () => {
          setTimeout(() => done());
        });
      }).to.not.throw();
    });
  });
  describe('#logOut', () => {
    const func = (user /* , req */) => {
      return JSON.stringify(user);
    };
    const sessionManager = new SessionManager(func);
    const user = {
      username: 'dummy'
    };
    const req = {
      _passport: {}
    };
    before(async () => {
      await sessionManager.logIn(req, user);
      return sessionManager.logOut(req);
    });
    it('deletes the session', () => {
      expect(req.session.passport.user).to.undefined;
    });
  });

  describe('#logOut (with callback)', () => {
    const func = (user /* , req */) => {
      return JSON.stringify(user);
    };
    const sessionManager = new SessionManager(func);
    const user = {
      username: 'dummy'
    };
    const req = {
      _passport: {}
    };
    before(async () => {
      await sessionManager.logIn(req, user);
      // eslint-disable-next-line promise/avoid-new
      return new Promise((resolve) => {
        sessionManager.logOut(req, resolve);
      });
    });
    it('deletes the session', () => {
      expect(req.session.passport.user).to.undefined;
    });
  });
});
