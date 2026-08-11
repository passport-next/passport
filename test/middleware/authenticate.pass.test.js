import { chai, expect } from '../bootstrap/node.js';
import authenticate from '../../lib/middleware/authenticate.js';
import { Passport, EnhancedStrategy } from '../../lib/index.js';


describe('middleware/authenticate', () => {
  describe('pass', () => {
    class Strategy extends EnhancedStrategy {
      authenticate() {
        this.pass();
      }
    }

    const passport = new Passport();
    passport.use('pass', new Strategy());

    /** @type {import('../types.js').Request} */
    let request;
    /** @type {Error | undefined} */
    let error;

    before((done) => {
      chai.connect.use(authenticate(passport, 'pass'))
        .req((req) => {
          request = req;
        })
        .next((err) => {
          error = err;
          done();
        })
        .dispatch();
    });

    it('should not error', () => {
      expect(error).to.be.undefined;
    });

    it('should not set user', () => {
      expect(request.user).to.be.undefined;
    });
  });
});
