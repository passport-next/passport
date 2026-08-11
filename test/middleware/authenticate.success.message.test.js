import { chai, expect } from '../bootstrap/node.js';
import authenticate from '../../lib/middleware/authenticate.js';
import { Passport, EnhancedStrategy } from '../../lib/index.js';


describe('middleware/authenticate', () => {
  describe('success with message set by route', () => {
    class Strategy extends EnhancedStrategy {
      authenticate() {
        const user = { id: '1', username: 'jaredhanson' };
        this.success(user, { message: 'Welcome!' });
      }
    }

    const passport = new Passport();
    passport.use('success', new Strategy());

    /** @type {import('../types.js').Request} */
    let request;
    /** @type {import('@passport-next/chai-connect-middleware').Response} */
    let response;

    before((done) => {
      chai.connect.use('express', authenticate(passport, 'success', {
        successMessage: 'Login complete',
        successRedirect: 'https://www.example.com/account'
      }))
        .req((req) => {
          request = req;
          req.session = {};

          req.logIn = function logIn(user) {
            this.user = user;
          };
        })
        .end((res) => {
          response = res;
          done();
        })
        .dispatch();
    });

    it('should set user', () => {
      expect(request.user).to.be.an('object');
      expect(request.user.id).to.equal('1');
      expect(request.user.username).to.equal('jaredhanson');
    });

    it('should add message to session', () => {
      expect(request.session.messages).to.have.length(1);
      expect(request.session.messages?.[0]).to.equal('Login complete');
    });

    it('should redirect', () => {
      expect(response.statusCode).to.equal(302);
      expect(response.getHeader('Location')).to.equal('https://www.example.com/account');
    });
  });

  describe('success with message set by route that is added to messages', () => {
    class Strategy extends EnhancedStrategy {
      authenticate() {
        const user = { id: '1', username: 'jaredhanson' };
        this.success(user, { message: 'Welcome!' });
      }
    }

    const passport = new Passport();
    passport.use('success', new Strategy());

    /** @type {import('../types.js').Request} */
    let request;
    /** @type {import('@passport-next/chai-connect-middleware').Response} */
    let response;

    before((done) => {
      chai.connect.use('express', authenticate(passport, 'success', {
        successMessage: 'Login complete',
        successRedirect: 'https://www.example.com/account'
      }))
        .req((req) => {
          request = req;
          req.session = {};
          req.session.messages = ['I exist!'];

          req.logIn = function logIn(user) {
            this.user = user;
          };
        })
        .end((res) => {
          response = res;
          done();
        })
        .dispatch();
    });

    it('should set user', () => {
      expect(request.user).to.be.an('object');
      expect(request.user.id).to.equal('1');
      expect(request.user.username).to.equal('jaredhanson');
    });

    it('should add message to session', () => {
      expect(request.session.messages).to.have.length(2);
      expect(request.session.messages?.[0]).to.equal('I exist!');
      expect(request.session.messages?.[1]).to.equal('Login complete');
    });

    it('should redirect', () => {
      expect(response.statusCode).to.equal(302);
      expect(response.getHeader('Location')).to.equal('https://www.example.com/account');
    });
  });

  describe('success with message set by strategy', () => {
    class Strategy extends EnhancedStrategy {
      authenticate() {
        const user = { id: '1', username: 'jaredhanson' };
        this.success(user, { message: 'Welcome!' });
      }
    }

    const passport = new Passport();
    passport.use('success', new Strategy());

    /** @type {import('../types.js').Request} */
    let request;
    /** @type {import('@passport-next/chai-connect-middleware').Response} */
    let response;

    before((done) => {
      chai.connect.use('express', authenticate(passport, 'success', {
        successMessage: true,
        successRedirect: 'https://www.example.com/account'
      }))
        .req((req) => {
          request = req;
          req.session = {};

          req.logIn = function logIn(user) {
            this.user = user;
          };
        })
        .end((res) => {
          response = res;
          done();
        })
        .dispatch();
    });

    it('should set user', () => {
      expect(request.user).to.be.an('object');
      expect(request.user.id).to.equal('1');
      expect(request.user.username).to.equal('jaredhanson');
    });

    it('should add message to session', () => {
      expect(request.session.messages).to.have.length(1);
      expect(request.session.messages?.[0]).to.equal('Welcome!');
    });

    it('should redirect', () => {
      expect(response.statusCode).to.equal(302);
      expect(response.getHeader('Location')).to.equal('https://www.example.com/account');
    });
  });

  describe('success with message set by strategy with extra info', () => {
    class Strategy extends EnhancedStrategy {
      authenticate() {
        const user = { id: '1', username: 'jaredhanson' };
        this.success(user, { message: 'Welcome!', scope: 'read' });
      }
    }

    const passport = new Passport();
    passport.use('success', new Strategy());

    /** @type {import('../types.js').Request} */
    let request;
    /** @type {import('@passport-next/chai-connect-middleware').Response} */
    let response;

    before((done) => {
      chai.connect.use('express', authenticate(passport, 'success', {
        successMessage: true,
        successRedirect: 'https://www.example.com/account'
      }))
        .req((req) => {
          request = req;
          req.session = {};

          req.logIn = function logIn(user) {
            this.user = user;
          };
        })
        .end((res) => {
          response = res;
          done();
        })
        .dispatch();
    });

    it('should set user', () => {
      expect(request.user).to.be.an('object');
      expect(request.user.id).to.equal('1');
      expect(request.user.username).to.equal('jaredhanson');
    });

    it('should add message to session', () => {
      expect(request.session.messages).to.have.length(1);
      expect(request.session.messages?.[0]).to.equal('Welcome!');
    });

    it('should redirect', () => {
      expect(response.statusCode).to.equal(302);
      expect(response.getHeader('Location')).to.equal('https://www.example.com/account');
    });
  });

  describe('success with message set by strategy with extra info (but a boolean successMessage without a message property)', () => {
    class Strategy extends EnhancedStrategy {
      authenticate() {
        const user = { id: '1', username: 'jaredhanson' };
        this.success(user, { scope: 'read' });
      }
    }

    const passport = new Passport();
    passport.use('success', new Strategy());

    /** @type {import('../types.js').Request} */
    let request;
    /** @type {import('@passport-next/chai-connect-middleware').Response} */
    let response;

    before((done) => {
      chai.connect.use('express', authenticate(passport, 'success', {
        successMessage: true,
        successRedirect: 'https://www.example.com/account'
      }))
        .req((req) => {
          request = req;
          req.session = {};

          req.logIn = function logIn(user) {
            this.user = user;
          };
        })
        .end((res) => {
          response = res;
          done();
        })
        .dispatch();
    });

    it('should set user', () => {
      expect(request.user).to.be.an('object');
      expect(request.user.id).to.equal('1');
      expect(request.user.username).to.equal('jaredhanson');
    });

    it('should not add message to session', () => {
      expect(request.session.messages).to.be.undefined;
    });

    it('should redirect', () => {
      expect(response.statusCode).to.equal(302);
      expect(response.getHeader('Location')).to.equal('https://www.example.com/account');
    });
  });

  describe('success with message set by strategy with extra info (and non-string success message info)', () => {
    class Strategy extends EnhancedStrategy {
      authenticate() {
        const user = { id: '1', username: 'jaredhanson' };
        this.success(user, { message: 'Welcome!', scope: 'read' });
      }
    }

    const passport = new Passport();
    passport.use('success', new Strategy());

    /** @type {import('../types.js').Request} */
    let request;
    /** @type {import('@passport-next/chai-connect-middleware').Response} */
    let response;

    before((done) => {
      chai.connect.use('express', authenticate(passport, 'success', {
        successMessage: { nonBooleanOrString: true },
        successRedirect: 'https://www.example.com/account'
      }))
        .req((req) => {
          request = req;
          req.session = {};

          req.logIn = function logIn(user) {
            this.user = user;
          };
        })
        .end((res) => {
          response = res;
          done();
        })
        .dispatch();
    });

    it('should set user', () => {
      expect(request.user).to.be.an('object');
      expect(request.user.id).to.equal('1');
      expect(request.user.username).to.equal('jaredhanson');
    });

    it('should not add message to session', () => {
      expect(request.session.messages).to.be.undefined;
    });

    it('should redirect', () => {
      expect(response.statusCode).to.equal(302);
      expect(response.getHeader('Location')).to.equal('https://www.example.com/account');
    });
  });
});
