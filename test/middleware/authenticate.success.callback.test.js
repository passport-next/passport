import { chai, expect } from '../bootstrap/node.js';
import authenticate from '../../lib/middleware/authenticate.js';
import { Passport, EnhancedStrategy } from '../../lib/index.js';


describe('middleware/authenticate', () => {
  describe('success with callback', () => {
    class Strategy extends EnhancedStrategy {
      authenticate() {
        const user = { id: '1', username: 'jaredhanson' };
        this.success(user, { message: 'Hello' });
      }
    }

    const passport = new Passport();
    passport.use('success', new Strategy());

    /** @type {import('../types.js').Request} */
    let request;
    /** @type {Error | null | undefined} */
    let error;
    /** @type {unknown} */
    let user;
    /** @type {unknown} */
    let info;

    // eslint-disable-next-line mocha/handle-done-callback -- Bug
    before((done) => {
      /** @type {import('../types.js').AuthenticateCallback} */
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
      expect(error).to.be.null;
    });

    it('should pass user to callback', () => {
      const authenticatedUser = /** @type {import('../types.js').User} */ (user);
      expect(user).to.be.an('object');
      expect(authenticatedUser.id).to.equal('1');
      expect(authenticatedUser.username).to.equal('jaredhanson');
    });

    it('should pass info to callback', () => {
      const authInfo = /** @type {import('../types.js').AuthInfo} */ (info);
      expect(info).to.be.an('object');
      expect(authInfo.message).to.equal('Hello');
    });

    it('should not set user on request', () => {
      expect(request.user).to.be.undefined;
    });

    it('should not set authInfo on request', () => {
      expect(request.authInfo).to.be.undefined;
    });
  });

  describe('success with callback and options passed to middleware', () => {
    class Strategy extends EnhancedStrategy {
      authenticate() {
        const user = { id: '1', username: 'jaredhanson' };
        this.success(user, { message: 'Hello' });
      }
    }

    const passport = new Passport();
    passport.use('success', new Strategy());

    /** @type {import('../types.js').Request} */
    let request;
    /** @type {Error | null | undefined} */
    let error;
    /** @type {unknown} */
    let user;
    /** @type {unknown} */
    let info;

    // eslint-disable-next-line mocha/handle-done-callback -- Bug
    before((done) => {
      /** @type {import('../types.js').AuthenticateCallback} */
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
      expect(error).to.be.null;
    });

    it('should pass user to callback', () => {
      const authenticatedUser = /** @type {import('../types.js').User} */ (user);
      expect(user).to.be.an('object');
      expect(authenticatedUser.id).to.equal('1');
      expect(authenticatedUser.username).to.equal('jaredhanson');
    });

    it('should pass info to callback', () => {
      const authInfo = /** @type {import('../types.js').AuthInfo} */ (info);
      expect(info).to.be.an('object');
      expect(authInfo.message).to.equal('Hello');
    });

    it('should not set user on request', () => {
      expect(request.user).to.be.undefined;
    });

    it('should not set authInfo on request', () => {
      expect(request.authInfo).to.be.undefined;
    });
  });
});
