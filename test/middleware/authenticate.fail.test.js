import { chai, expect } from '../bootstrap/node.js';
import authenticate from '../../lib/middleware/authenticate.js';
import { Passport, EnhancedStrategy } from '../../lib/index.js';


describe('middleware/authenticate', () => {
  describe('fail', () => {
    class Strategy extends EnhancedStrategy {
      authenticate() {
        this.fail();
      }
    }

    const passport = new Passport();
    passport.use('fail', new Strategy());

    /** @type {import('../types.js').Request} */
    let request;
    /** @type {import('@passport-next/chai-connect-middleware').Response} */
    let response;

    before((done) => {
      chai.connect.use(authenticate(passport, 'fail'))
        .req((req) => {
          request = req;
        })
        .end((res) => {
          response = res;
          done();
        })
        .dispatch();
    });

    it('should not set user', () => {
      expect(request.user).to.be.undefined;
    });

    it('should respond', () => {
      expect(response.statusCode).to.equal(401);
      expect(response.getHeader('WWW-Authenticate')).to.be.undefined;
      expect(response.body).to.equal('Unauthorized');
    });
  });

  describe('fail with redirect', () => {
    class Strategy extends EnhancedStrategy {
      authenticate() {
        this.fail();
      }
    }

    const passport = new Passport();
    passport.use('fail', new Strategy());

    /** @type {import('../types.js').Request} */
    let request;
    /** @type {import('@passport-next/chai-connect-middleware').Response} */
    let response;

    before((done) => {
      chai.connect.use('express', authenticate(passport, 'fail', { failureRedirect: 'https://www.example.com/login' }))
        .req((req) => {
          request = req;
        })
        .end((res) => {
          response = res;
          done();
        })
        .dispatch();
    });

    it('should not set user', () => {
      expect(request.user).to.be.undefined;
    });

    it('should redirect', () => {
      expect(response.statusCode).to.equal(302);
      expect(response.getHeader('Location')).to.equal('https://www.example.com/login');
    });
  });

  describe('fail with challenge', () => {
    class Strategy extends EnhancedStrategy {
      authenticate() {
        this.fail('MOCK challenge');
      }
    }

    const passport = new Passport();
    passport.use('fail', new Strategy());

    /** @type {import('../types.js').Request} */
    let request;
    /** @type {import('@passport-next/chai-connect-middleware').Response} */
    let response;

    before((done) => {
      chai.connect.use(authenticate(passport, 'fail'))
        .req((req) => {
          request = req;
        })
        .end((res) => {
          response = res;
          done();
        })
        .dispatch();
    });

    it('should not set user', () => {
      expect(request.user).to.be.undefined;
    });

    it('should respond', () => {
      expect(response.statusCode).to.equal(401);
      expect(response.body).to.equal('Unauthorized');
    });

    it('should set authenticate header on response', () => {
      const val = response.getHeader('WWW-Authenticate');
      expect(val).to.be.an('array');
      if (!Array.isArray(val)) {
        throw new TypeError('Expected WWW-Authenticate to be an array');
      }
      expect(val).to.have.length(1);

      expect(val[0]).to.equal('MOCK challenge');
    });
  });

  describe('fail with challenge and status', () => {
    class Strategy extends EnhancedStrategy {
      authenticate() {
        this.fail('MOCK challenge', 403);
      }
    }

    const passport = new Passport();
    passport.use('fail', new Strategy());

    /** @type {import('../types.js').Request} */
    let request;
    /** @type {import('@passport-next/chai-connect-middleware').Response} */
    let response;

    before((done) => {
      chai.connect.use(authenticate(passport, 'fail'))
        .req((req) => {
          request = req;
        })
        .end((res) => {
          response = res;
          done();
        })
        .dispatch();
    });

    it('should not set user', () => {
      expect(request.user).to.be.undefined;
    });

    it('should respond', () => {
      expect(response.statusCode).to.equal(403);
      expect(response.getHeader('WWW-Authenticate')).to.be.undefined;
      expect(response.body).to.equal('Forbidden');
    });
  });

  describe('fail with status', () => {
    class Strategy extends EnhancedStrategy {
      authenticate() {
        this.fail(400);
      }
    }

    const passport = new Passport();
    passport.use('fail', new Strategy());

    /** @type {import('../types.js').Request} */
    let request;
    /** @type {import('@passport-next/chai-connect-middleware').Response} */
    let response;

    before((done) => {
      chai.connect.use(authenticate(passport, 'fail'))
        .req((req) => {
          request = req;
        })
        .end((res) => {
          response = res;
          done();
        })
        .dispatch();
    });

    it('should not set user', () => {
      expect(request.user).to.be.undefined;
    });

    it('should respond', () => {
      expect(response.statusCode).to.equal(400);
      expect(response.getHeader('WWW-Authenticate')).to.be.undefined;
      expect(response.body).to.equal('Bad Request');
    });
  });

  describe('fail with error', () => {
    class Strategy extends EnhancedStrategy {
      authenticate() {
        this.fail();
      }
    }

    const passport = new Passport();
    passport.use('fail', new Strategy());

    /** @type {import('../types.js').Request} */
    let request;
    /** @type {import('@passport-next/chai-connect-middleware').Response} */
    let response;
    /** @type {import('../types.js').AuthenticationError | undefined} */
    let error;

    before((done) => {
      chai.connect.use('express', authenticate(passport, 'fail', { failWithError: true }))
        .req((req) => {
          request = req;
        })
        .res((res) => {
          response = res;
        })
        .next((err) => {
          error = /** @type {import('../types.js').AuthenticationError | undefined} */ (err);
          done();
        })
        .dispatch();
    });

    it('should error', () => {
      if (!error) {
        throw new Error('Expected authentication error');
      }
      expect(error).to.be.an.instanceOf(Error);
      expect(error.constructor.name).to.equal('AuthenticationError');
      expect(error?.message).to.equal('Unauthorized');
      expect(error.status).to.equal(401);
    });

    it('should not set user', () => {
      expect(request.user).to.be.undefined;
    });

    it('should not set body of response', () => {
      expect(response.statusCode).to.equal(401);
      expect(response.getHeader('WWW-Authenticate')).to.be.undefined;
      expect(response.body).to.be.undefined;
    });
  });

  describe('fail with error, passing info to fail', () => {
    class Strategy extends EnhancedStrategy {
      authenticate() {
        this.fail({ message: 'Invalid credentials' });
      }
    }

    const passport = new Passport();
    passport.use('fail', new Strategy());

    /** @type {import('../types.js').Request} */
    let request;
    /** @type {import('@passport-next/chai-connect-middleware').Response} */
    let response;
    /** @type {import('../types.js').AuthenticationError | undefined} */
    let error;

    before((done) => {
      chai.connect.use('express', authenticate(passport, 'fail', { failWithError: true }))
        .req((req) => {
          request = req;
        })
        .res((res) => {
          response = res;
        })
        .next((err) => {
          error = /** @type {import('../types.js').AuthenticationError | undefined} */ (err);
          done();
        })
        .dispatch();
    });

    it('should error', () => {
      if (!error) {
        throw new Error('Expected authentication error');
      }
      expect(error).to.be.an.instanceOf(Error);
      expect(error.constructor.name).to.equal('AuthenticationError');
      expect(error?.message).to.equal('Unauthorized');
      expect(error.status).to.equal(401);
    });

    it('should not set user', () => {
      expect(request.user).to.be.undefined;
    });

    it('should not set body of response', () => {
      expect(response.statusCode).to.equal(401);
      expect(response.getHeader('WWW-Authenticate')).to.be.undefined;
      expect(response.body).to.be.undefined;
    });
  });

  describe('fail with error, passing info and status to fail', () => {
    class Strategy extends EnhancedStrategy {
      authenticate() {
        this.fail({ message: 'Multiple credentials' }, 400);
      }
    }

    const passport = new Passport();
    passport.use('fail', new Strategy());

    /** @type {import('../types.js').Request} */
    let request;
    /** @type {import('@passport-next/chai-connect-middleware').Response} */
    let response;
    /** @type {import('../types.js').AuthenticationError | undefined} */
    let error;

    before((done) => {
      chai.connect.use('express', authenticate(passport, 'fail', { failWithError: true }))
        .req((req) => {
          request = req;
        })
        .res((res) => {
          response = res;
        })
        .next((err) => {
          error = /** @type {import('../types.js').AuthenticationError | undefined} */ (err);
          done();
        })
        .dispatch();
    });

    it('should error', () => {
      if (!error) {
        throw new Error('Expected authentication error');
      }
      expect(error).to.be.an.instanceOf(Error);
      expect(error.constructor.name).to.equal('AuthenticationError');
      expect(error?.message).to.equal('Bad Request');
      expect(error.status).to.equal(400);
    });

    it('should not set user', () => {
      expect(request.user).to.be.undefined;
    });

    it('should not set body of response', () => {
      expect(response.statusCode).to.equal(400);
      expect(response.getHeader('WWW-Authenticate')).to.be.undefined;
      expect(response.body).to.be.undefined;
    });
  });

  describe('fail with error, passing challenge to fail', () => {
    class Strategy extends EnhancedStrategy {
      authenticate() {
        this.fail('Bearer challenge');
      }
    }

    const passport = new Passport();
    passport.use('fail', new Strategy());

    /** @type {import('../types.js').Request} */
    let request;
    /** @type {import('@passport-next/chai-connect-middleware').Response} */
    let response;
    /** @type {import('../types.js').AuthenticationError | undefined} */
    let error;

    before((done) => {
      chai.connect.use('express', authenticate(passport, 'fail', { failWithError: true }))
        .req((req) => {
          request = req;
        })
        .res((res) => {
          response = res;
        })
        .next((err) => {
          error = /** @type {import('../types.js').AuthenticationError | undefined} */ (err);
          done();
        })
        .dispatch();
    });

    it('should error', () => {
      if (!error) {
        throw new Error('Expected authentication error');
      }
      expect(error).to.be.an.instanceOf(Error);
      expect(error.constructor.name).to.equal('AuthenticationError');
      expect(error?.message).to.equal('Unauthorized');
      expect(error.status).to.equal(401);
    });

    it('should not set user', () => {
      expect(request.user).to.be.undefined;
    });

    it('should not set body of response', () => {
      expect(response.statusCode).to.equal(401);
      expect(response.body).to.be.undefined;
    });

    it('should set authenticate header on response', () => {
      const val = response.getHeader('WWW-Authenticate');
      expect(val).to.be.an('array');
      expect(val).to.have.length(1);

      if (Array.isArray(val)) {
        expect(val[0]).to.equal('Bearer challenge');
      }
    });
  });

  describe('fail with error, passing challenge and status to fail', () => {
    class Strategy extends EnhancedStrategy {
      authenticate() {
        this.fail('Bearer challenge', 403);
      }
    }

    const passport = new Passport();
    passport.use('fail', new Strategy());

    /** @type {import('../types.js').Request} */
    let request;
    /** @type {import('@passport-next/chai-connect-middleware').Response} */
    let response;
    /** @type {import('../types.js').AuthenticationError | undefined} */
    let error;

    before((done) => {
      chai.connect.use('express', authenticate(passport, 'fail', { failWithError: true }))
        .req((req) => {
          request = req;
        })
        .res((res) => {
          response = res;
        })
        .next((err) => {
          error = /** @type {import('../types.js').AuthenticationError | undefined} */ (err);
          done();
        })
        .dispatch();
    });

    it('should error', () => {
      if (!error) {
        throw new Error('Expected authentication error');
      }
      expect(error).to.be.an.instanceOf(Error);
      expect(error.constructor.name).to.equal('AuthenticationError');
      expect(error?.message).to.equal('Forbidden');
      expect(error.status).to.equal(403);
    });

    it('should not set user', () => {
      expect(request.user).to.be.undefined;
    });

    it('should not set body of response', () => {
      expect(response.statusCode).to.equal(403);
      expect(response.getHeader('WWW-Authenticate')).to.be.undefined;
      expect(response.body).to.be.undefined;
    });
  });

  describe('fail with error, passing status to fail', () => {
    class Strategy extends EnhancedStrategy {
      authenticate() {
        this.fail(402);
      }
    }

    const passport = new Passport();
    passport.use('fail', new Strategy());

    /** @type {import('../types.js').Request} */
    let request;
    /** @type {import('@passport-next/chai-connect-middleware').Response} */
    let response;
    /** @type {import('../types.js').AuthenticationError | undefined} */
    let error;

    before((done) => {
      chai.connect.use('express', authenticate(passport, 'fail', { failWithError: true }))
        .req((req) => {
          request = req;
        })
        .res((res) => {
          response = res;
        })
        .next((err) => {
          error = /** @type {import('../types.js').AuthenticationError | undefined} */ (err);
          done();
        })
        .dispatch();
    });

    it('should error', () => {
      if (!error) {
        throw new Error('Expected authentication error');
      }
      expect(error).to.be.an.instanceOf(Error);
      expect(error.constructor.name).to.equal('AuthenticationError');
      expect(error?.message).to.equal('Payment Required');
      expect(error.status).to.equal(402);
    });

    it('should not set user', () => {
      expect(request.user).to.be.undefined;
    });

    it('should not set body of response', () => {
      expect(response.statusCode).to.equal(402);
      expect(response.getHeader('WWW-Authenticate')).to.be.undefined;
      expect(response.body).to.be.undefined;
    });
  });
});
