import { chai, expect } from '../bootstrap/node.js';
import authenticate from '../../lib/middleware/authenticate.js';
import { Passport, EnhancedStrategy } from '../../lib/index.js';


describe('middleware/authenticate', () => {
  describe('with multiple strategies, the first of which succeeds', () => {
    class StrategyA extends EnhancedStrategy {
      authenticate() {
        this.success({ username: 'bob-a' });
      }
    }

    class StrategyB extends EnhancedStrategy {
      authenticate() {
        this.success({ username: 'bob-b' });
      }
    }

    const passport = new Passport();
    passport.use('a', new StrategyA());
    passport.use('b', new StrategyB());

    /** @type {import('../types.js').Request} */
    let request;
    /** @type {Error | undefined} */
    let error;

    before((done) => {
      chai.connect.use(authenticate(passport, ['a', 'b']))
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

    it('should not error', () => {
      expect(error).to.be.undefined;
    });

    it('should set user', () => {
      expect(request.user).to.be.an('object');
      expect(request.user.username).to.equal('bob-a');
    });
  });

  describe('with multiple strategies, the second of which succeeds', () => {
    class StrategyA extends EnhancedStrategy {
      authenticate() {
        this.fail('A challenge');
      }
    }

    class StrategyB extends EnhancedStrategy {
      authenticate() {
        this.success({ username: 'bob-b' });
      }
    }

    const passport = new Passport();
    passport.use('a', new StrategyA());
    passport.use('b', new StrategyB());

    /** @type {import('../types.js').Request} */
    let request;
    /** @type {Error | undefined} */
    let error;

    before((done) => {
      chai.connect.use(authenticate(passport, ['a', 'b']))
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

    it('should not error', () => {
      expect(error).to.be.undefined;
    });

    it('should set user', () => {
      expect(request.user).to.be.an('object');
      expect(request.user.username).to.equal('bob-b');
    });
  });
});
