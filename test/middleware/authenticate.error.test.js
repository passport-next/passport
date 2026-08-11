import { chai, expect } from '../bootstrap/node.js';
import authenticate from '../../lib/middleware/authenticate.js';
import { Passport, EnhancedStrategy } from '../../lib/index.js';


describe('middleware/authenticate', () => {
  describe('error', () => {
    class Strategy extends EnhancedStrategy {
      authenticate() {
        this.error(new Error('something is wrong'));
      }
    }

    const passport = new Passport();
    passport.use('error', new Strategy());

    /** @type {import('../types.js').Request} */
    let request;
    /** @type {Error | undefined} */
    let error;

    before((done) => {
      chai.connect.use(authenticate(passport, 'error'))
        .req((req) => {
          request = req;
        })
        .next((err) => {
          error = err;
          done();
        })
        .dispatch();
    });

    it('should error', () => {
      expect(error).to.be.an.instanceOf(Error);
      expect(error?.message).to.equal('something is wrong');
    });

    it('should not set user', () => {
      expect(request.user).to.be.undefined;
    });
  });
});
