'use strict';

const SessionManager = require('../lib/sessionmanager');


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
    const func = (user, req, cb) => {
      cb(null, JSON.stringify(user));
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
  describe('#logOut', () => {
    const func = (user, req, cb) => {
      cb(null, JSON.stringify(user));
    };
    const sessionManager = new SessionManager(func);
    const user = {
      username: 'dummy'
    };
    const req = {
      _passport: {}
    };
    before((done) => {
      sessionManager.logIn(req, user, () => {
        sessionManager.logOut(req, done);
      });
    });
    it('deletes the session', () => {
      // eslint-disable-next-line no-unused-expressions
      expect(req.session.passport.user).to.undefined;
    });
  });
});
