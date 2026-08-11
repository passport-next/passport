import { expect } from './bootstrap/node.js';
import SessionManager from '../lib/sessionmanager.js';

/**
 * @param {import('./types.js').PassportSession} [passportSession]
 * @param {import('./types.js').SessionStore} [session]
 * @returns {import('./types.js').SessionRequest}
 */
function createRequest(passportSession, session) {
  return {
    method: 'GET',
    url: '/',
    _passport: passportSession ? { session: passportSession } : {},
    ...(session ? { session } : {})
  };
}

/**
 * @param {import('./types.js').SessionRequest} request
 * @returns {import('./types.js').PassportSession}
 * @throws {Error} When the request has no Passport session.
 */
function getPassportSession(request) {
  const session = request.session?.passport;
  if (!session) {
    throw new Error('Expected Passport session');
  }
  return session;
}


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
    const func = (/** @type {import('./types.js').User} */ user /* , req */) => {
      return JSON.stringify(user);
    };
    const sessionManager = new SessionManager(func);
    const user = {
      username: 'dummy'
    };
    const req = createRequest();
    before((done) => {
      sessionManager.logIn(req, user, done);
    });
    it('serializes user', () => {
      expect(getPassportSession(req).user).to.equal('{"username":"dummy"}');
    });
  });
  describe('#logIn (with pre-provided private passport session)', () => {
    const func = (/** @type {import('./types.js').User} */ user /* , req */) => {
      return JSON.stringify(user);
    };
    const sessionManager = new SessionManager(func);
    const user = {
      username: 'dummy'
    };
    const req = createRequest({});
    before((done) => {
      sessionManager.logIn(req, user, done);
    });
    it('serializes user', () => {
      expect(getPassportSession(req).user).to.equal('{"username":"dummy"}');
    });
  });
  describe('#logIn (with pre-provided session)', () => {
    const func = (/** @type {import('./types.js').User} */ user /* , req */) => {
      return JSON.stringify(user);
    };
    const sessionManager = new SessionManager(func);
    const user = {
      username: 'dummy'
    };
    const req = createRequest(undefined, {});
    before((done) => {
      sessionManager.logIn(req, user, done);
    });
    it('serializes user', () => {
      expect(getPassportSession(req).user).to.equal('{"username":"dummy"}');
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
    const req = createRequest();
    it('does not throw with callback and bad serializer', (done) => {
      expect(() => {
        sessionManager.logIn(req, user, () => {
          setTimeout(() => done(), 0);
        });
      }).to.not.throw();
    });
  });
  describe('#logOut', () => {
    const func = (/** @type {import('./types.js').User} */ user /* , req */) => {
      return JSON.stringify(user);
    };
    const sessionManager = new SessionManager(func);
    const user = {
      username: 'dummy'
    };
    const req = createRequest();
    before(async () => {
      await sessionManager.logIn(req, user);
      return sessionManager.logOut(req);
    });
    it('deletes the session', () => {
      expect(getPassportSession(req).user).to.undefined;
    });
  });

  describe('#logOut (with callback)', () => {
    const func = (/** @type {import('./types.js').User} */ user /* , req */) => {
      return JSON.stringify(user);
    };
    const sessionManager = new SessionManager(func);
    const user = {
      username: 'dummy'
    };
    const req = createRequest();
    before(async () => {
      await sessionManager.logIn(req, user);
      // eslint-disable-next-line promise/avoid-new -- Callback API
      return new Promise((resolve) => {
        sessionManager.logOut(req, resolve);
      });
    });
    it('deletes the session', () => {
      expect(getPassportSession(req).user).to.undefined;
    });
  });
});
