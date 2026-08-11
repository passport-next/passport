import { chai, expect } from '../bootstrap/node.js';
import authenticate from '../../lib/middleware/authenticate.js';
import { Passport, EnhancedStrategy } from '../../lib/index.js';

describe('middleware/authenticate', () => {
  describe('fail with callback', () => {
    class Strategy extends EnhancedStrategy {
      authenticate() {
        this.fail();
      }
    }

    const passport = new Passport();
    passport.use('fail', new Strategy());

    /** @type {import('../types.js').Request} */
    let request;
    /** @type {Error | null | undefined} */
    let error;
    /** @type {unknown} */
    let user;

    // eslint-disable-next-line mocha/handle-done-callback -- Bug
    before((done) => {
      /** @type {import('../types.js').AuthenticateCallback} */
      function callback(e, u) {
        error = e;
        user = u;
        done();
      }

      chai.connect.use(authenticate(passport, 'fail', callback))
        .req((req) => {
          request = req;
        })
        .dispatch();
    });

    it('should not error', () => {
      expect(error).to.be.null;
    });

    it('should pass false to callback', () => {
      expect(user).to.equal(false);
    });

    it('should not set user on request', () => {
      expect(request.user).to.be.undefined;
    });
  });

  describe('fail with callback, passing info', () => {
    class Strategy extends EnhancedStrategy {
      authenticate() {
        this.fail({ message: 'Invalid password' });
      }
    }

    const passport = new Passport();
    passport.use('fail', new Strategy());

    /** @type {import('../types.js').Request} */
    let request;
    /** @type {Error | null | undefined} */
    let error;
    /** @type {unknown} */
    let user;
    /** @type {unknown} */
    let info;
    /** @type {unknown} */
    let status;

    // eslint-disable-next-line mocha/handle-done-callback -- Bug
    before((done) => {
      /** @type {import('../types.js').AuthenticateCallback} */
      function callback(e, u, i, s) {
        error = e;
        user = u;
        info = i;
        status = s;
        done();
      }

      chai.connect.use(authenticate(passport, 'fail', callback))
        .req((req) => {
          request = req;
        })
        .dispatch();
    });

    it('should not error', () => {
      expect(error).to.be.null;
    });

    it('should pass false to callback', () => {
      expect(user).to.equal(false);
    });

    it('should pass info to callback', () => {
      const authInfo = /** @type {import('../types.js').AuthInfo} */ (info);
      expect(info).to.be.an('object');
      expect(authInfo.message).to.equal('Invalid password');
    });

    it('should pass status to callback', () => {
      expect(status).to.be.undefined;
    });

    it('should not set user on request', () => {
      expect(request.user).to.be.undefined;
    });
  });

  describe('fail with callback, passing info and status', () => {
    class Strategy extends EnhancedStrategy {
      authenticate() {
        this.fail({ message: 'Invalid password' }, 403);
      }
    }

    const passport = new Passport();
    passport.use('fail', new Strategy());

    /** @type {import('../types.js').Request} */
    let request;
    /** @type {Error | null | undefined} */
    let error;
    /** @type {unknown} */
    let user;
    /** @type {unknown} */
    let info;
    /** @type {unknown} */
    let status;

    // eslint-disable-next-line mocha/handle-done-callback -- Bug
    before((done) => {
      /** @type {import('../types.js').AuthenticateCallback} */
      function callback(e, u, i, s) {
        error = e;
        user = u;
        info = i;
        status = s;
        done();
      }

      chai.connect.use(authenticate(passport, 'fail', callback))
        .req((req) => {
          request = req;
        })
        .dispatch();
    });

    it('should not error', () => {
      expect(error).to.be.null;
    });

    it('should pass false to callback', () => {
      expect(user).to.equal(false);
    });

    it('should pass info to callback', () => {
      const authInfo = /** @type {import('../types.js').AuthInfo} */ (info);
      expect(info).to.be.an('object');
      expect(authInfo.message).to.equal('Invalid password');
    });

    it('should pass status to callback', () => {
      expect(status).to.equal(403);
    });

    it('should not set user on request', () => {
      expect(request.user).to.be.undefined;
    });
  });

  describe('fail with callback, passing challenge', () => {
    class Strategy extends EnhancedStrategy {
      authenticate() {
        this.fail('Bearer challenge');
      }
    }

    const passport = new Passport();
    passport.use('fail', new Strategy());

    /** @type {import('../types.js').Request} */
    let request;
    /** @type {Error | null | undefined} */
    let error;
    /** @type {unknown} */
    let user;
    /** @type {unknown} */
    let challenge;
    /** @type {unknown} */
    let status;

    // eslint-disable-next-line mocha/handle-done-callback -- Bug
    before((done) => {
      /** @type {import('../types.js').AuthenticateCallback} */
      function callback(e, u, c, s) {
        error = e;
        user = u;
        challenge = c;
        status = s;
        done();
      }

      chai.connect.use(authenticate(passport, 'fail', callback))
        .req((req) => {
          request = req;
        })
        .dispatch();
    });

    it('should not error', () => {
      expect(error).to.be.null;
    });

    it('should pass false to callback', () => {
      expect(user).to.equal(false);
    });

    it('should pass challenge to callback', () => {
      expect(challenge).to.equal('Bearer challenge');
    });

    it('should pass status to callback', () => {
      expect(status).to.be.undefined;
    });

    it('should not set user on request', () => {
      expect(request.user).to.be.undefined;
    });
  });

  describe('fail with callback, passing challenge and status', () => {
    class Strategy extends EnhancedStrategy {
      authenticate() {
        this.fail('Bearer challenge', 403);
      }
    }

    const passport = new Passport();
    passport.use('fail', new Strategy());

    /** @type {import('../types.js').Request} */
    let request;
    /** @type {Error | null | undefined} */
    let error;
    /** @type {unknown} */
    let user;
    /** @type {unknown} */
    let challenge;
    /** @type {unknown} */
    let status;

    // eslint-disable-next-line mocha/handle-done-callback -- Bug
    before((done) => {
      /** @type {import('../types.js').AuthenticateCallback} */
      function callback(e, u, c, s) {
        error = e;
        user = u;
        challenge = c;
        status = s;
        done();
      }

      chai.connect.use(authenticate(passport, 'fail', callback))
        .req((req) => {
          request = req;
        })
        .dispatch();
    });

    it('should not error', () => {
      expect(error).to.be.null;
    });

    it('should pass false to callback', () => {
      expect(user).to.equal(false);
    });

    it('should pass challenge to callback', () => {
      expect(challenge).to.equal('Bearer challenge');
    });

    it('should pass status to callback', () => {
      expect(status).to.equal(403);
    });

    it('should not set user on request', () => {
      expect(request.user).to.be.undefined;
    });
  });

  describe('fail with callback, passing status', () => {
    class Strategy extends EnhancedStrategy {
      authenticate() {
        this.fail(402);
      }
    }

    const passport = new Passport();
    passport.use('fail', new Strategy());

    /** @type {import('../types.js').Request} */
    let request;
    /** @type {Error | null | undefined} */
    let error;
    /** @type {unknown} */
    let user;
    /** @type {unknown} */
    let challenge;
    /** @type {unknown} */
    let status;

    // eslint-disable-next-line mocha/handle-done-callback -- Bug
    before((done) => {
      /** @type {import('../types.js').AuthenticateCallback} */
      function callback(e, u, c, s) {
        error = e;
        user = u;
        challenge = c;
        status = s;
        done();
      }

      chai.connect.use(authenticate(passport, 'fail', callback))
        .req((req) => {
          request = req;
        })
        .dispatch();
    });

    it('should not error', () => {
      expect(error).to.be.null;
    });

    it('should pass false to callback', () => {
      expect(user).to.equal(false);
    });

    it('should pass challenge to callback', () => {
      expect(challenge).to.be.undefined;
    });

    it('should pass status to callback', () => {
      expect(status).to.equal(402);
    });

    it('should not set user on request', () => {
      expect(request.user).to.be.undefined;
    });
  });

  describe('fail with callback and options passed to middleware', () => {
    class Strategy extends EnhancedStrategy {
      authenticate() {
        this.fail();
      }
    }

    const passport = new Passport();
    passport.use('fail', new Strategy());

    /** @type {import('../types.js').Request} */
    let request;
    /** @type {Error | null | undefined} */
    let error;
    /** @type {unknown} */
    let user;

    // eslint-disable-next-line mocha/handle-done-callback -- Bug
    before((done) => {
      /** @type {import('../types.js').AuthenticateCallback} */
      function callback(e, u) {
        error = e;
        user = u;
        done();
      }

      chai.connect.use(authenticate(passport, 'fail', { foo: 'bar' }, callback))
        .req((req) => {
          request = req;
        })
        .dispatch();
    });

    it('should not error', () => {
      expect(error).to.be.null;
    });

    it('should pass false to callback', () => {
      expect(user).to.equal(false);
    });

    it('should not set user on request', () => {
      expect(request.user).to.be.undefined;
    });
  });
});
