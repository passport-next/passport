import { chai, expect } from '../bootstrap/node.js';
import authenticate from '../../lib/middleware/authenticate.js';
import { Passport } from '../../lib/index.js';


describe('middleware/authenticate', () => {
  it('should be named authenticate', () => {
    expect(authenticate(new Passport(), 'test').name).to.equal('authenticate');
  });

  describe('with unknown strategy', () => {
    const passport = new Passport();

    /** @type {import('../types.js').Request} */
    let request;
    /** @type {Error | undefined} */
    let error;

    before((done) => {
      chai.connect.use(authenticate(passport, 'foo'))
        .req((req) => {
          request = req;

          req.logIn = function logIn(user) {
            this.user = user;
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
      expect(error?.message).to.equal('Unknown authentication strategy "foo"');
    });

    it('should not set user', () => {
      expect(request.user).to.be.undefined;
    });

    it('should not set authInfo', () => {
      expect(request.authInfo).to.be.undefined;
    });
  });
});
