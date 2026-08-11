import { chai, expect } from '../bootstrap/node.js';
import authenticate from '../../lib/middleware/authenticate.js';
import { Passport, EnhancedStrategy } from '../../lib/index.js';


describe('middleware/authenticate', () => {
  describe('fail with message set by route', () => {
    let ranAuthentication = false;
    class Strategy extends EnhancedStrategy {
      authenticate() {
        ranAuthentication = true;
        this.fail({ message: 'Invalid password' });
      }
    }

    const passport = new Passport();
    passport.use('failure', new Strategy());

    /** @type {import('../types.js').Request} */
    let request;
    /** @type {import('@passport-next/chai-connect-middleware').Response} */
    let response;

    before((done) => {
      chai.connect.use('express', authenticate(passport, 'failure', {
        failureMessage: 'Wrong credentials',
        failureRedirect: 'https://www.example.com/login'
      }))
        .req((req) => {
          request = req;
          req.session = {};
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

    it('should add message to session', () => {
      expect(request.session.messages).to.have.length(1);
      expect(request.session.messages?.[0]).to.equal('Wrong credentials');
    });

    it('should redirect', () => {
      expect(response.statusCode).to.equal(302);
      expect(response.getHeader('Location')).to.equal('https://www.example.com/login');
    });

    it('should run authentication', () => {
      expect(ranAuthentication).to.be.true;
    });
  });

  describe('fail with message set by route but with bad strategy name', () => {
    let ranAuthentication = false;
    class Strategy extends EnhancedStrategy {
      authenticate() {
        ranAuthentication = true;
        this.fail({ message: 'Invalid password' });
      }
    }

    const passport = new Passport();
    passport.use('failure', new Strategy());

    /** @type {import('../types.js').Request} */
    let request;
    /** @type {import('@passport-next/chai-connect-middleware').Response} */
    let response;

    before((done) => {
      chai.connect.use('express', authenticate(
        passport,
        // @ts-expect-error Bad strategy name
        null,
        {
          failureMessage: 'Wrong credentials',
          failureRedirect: 'https://www.example.com/login'
        }
      ))
        .req((req) => {
          request = req;
          req.session = {};
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

    it('should add message to session', () => {
      expect(request.session.messages).to.have.length(1);
      expect(request.session.messages?.[0]).to.equal('Wrong credentials');
    });

    it('should redirect', () => {
      expect(response.statusCode).to.equal(302);
      expect(response.getHeader('Location')).to.equal('https://www.example.com/login');
    });

    it('should not run authentication', () => {
      expect(ranAuthentication).to.be.false;
    });
  });

  describe('fail with message set by route that is added to messages', () => {
    class Strategy extends EnhancedStrategy {
      authenticate() {
        this.fail({ message: 'Invalid password' });
      }
    }

    const passport = new Passport();
    passport.use('fail', new Strategy());

    /** @type {import('../types.js').Request} */
    let request;
    /** @type {import('@passport-next/chai-connect-middleware').Response} */
    let response;

    before((done) => {
      chai.connect.use('express', authenticate(passport, 'fail', {
        failureMessage: 'Wrong credentials',
        failureRedirect: 'https://www.example.com/login'
      }))
        .req((req) => {
          request = req;
          req.session = {};
          req.session.messages = ['I exist!'];
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

    it('should add message to session', () => {
      expect(request.session.messages).to.have.length(2);
      expect(request.session.messages?.[0]).to.equal('I exist!');
      expect(request.session.messages?.[1]).to.equal('Wrong credentials');
    });

    it('should redirect', () => {
      expect(response.statusCode).to.equal(302);
      expect(response.getHeader('Location')).to.equal('https://www.example.com/login');
    });
  });

  describe('fail with message set by strategy', () => {
    class Strategy extends EnhancedStrategy {
      authenticate() {
        this.fail({ message: 'Invalid password' });
      }
    }

    const passport = new Passport();
    passport.use('fail', new Strategy());

    /** @type {import('../types.js').Request} */
    let request;
    /** @type {import('@passport-next/chai-connect-middleware').Response} */
    let response;

    before((done) => {
      chai.connect.use('express', authenticate(passport, 'fail', {
        failureMessage: true,
        failureRedirect: 'https://www.example.com/login'
      }))
        .req((req) => {
          request = req;
          req.session = {};
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

    it('should add message to session', () => {
      expect(request.session.messages).to.have.length(1);
      expect(request.session.messages?.[0]).to.equal('Invalid password');
    });

    it('should redirect', () => {
      expect(response.statusCode).to.equal(302);
      expect(response.getHeader('Location')).to.equal('https://www.example.com/login');
    });
  });

  describe('fail with message set by strategy with extra info', () => {
    class Strategy extends EnhancedStrategy {
      authenticate() {
        this.fail({ message: 'Invalid password', scope: 'read' });
      }
    }

    const passport = new Passport();
    passport.use('fail', new Strategy());

    /** @type {import('../types.js').Request} */
    let request;
    /** @type {import('@passport-next/chai-connect-middleware').Response} */
    let response;

    before((done) => {
      chai.connect.use('express', authenticate(passport, 'fail', {
        failureMessage: true,
        failureRedirect: 'https://www.example.com/login'
      }))
        .req((req) => {
          request = req;
          req.session = {};
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

    it('should add message to session', () => {
      expect(request.session.messages).to.have.length(1);
      expect(request.session.messages?.[0]).to.equal('Invalid password');
    });

    it('should redirect', () => {
      expect(response.statusCode).to.equal(302);
      expect(response.getHeader('Location')).to.equal('https://www.example.com/login');
    });
  });

  describe('fail with message set by strategy with extra info (but a boolean failureMessage without a message property)', () => {
    class Strategy extends EnhancedStrategy {
      authenticate() {
        this.fail({ scope: 'read' });
      }
    }

    const passport = new Passport();
    passport.use('fail', new Strategy());

    /** @type {import('../types.js').Request} */
    let request;
    /** @type {import('@passport-next/chai-connect-middleware').Response} */
    let response;

    before((done) => {
      chai.connect.use('express', authenticate(passport, 'fail', {
        failureMessage: true,
        failureRedirect: 'https://www.example.com/login'
      }))
        .req((req) => {
          request = req;
          req.session = {};
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

    it('should not add message to session', () => {
      expect(request.session.messages).to.be.undefined;
    });

    it('should redirect', () => {
      expect(response.statusCode).to.equal(302);
      expect(response.getHeader('Location')).to.equal('https://www.example.com/login');
    });
  });

  describe('fail with message set by strategy with extra info (and non-string failure message info)', () => {
    class Strategy extends EnhancedStrategy {
      authenticate() {
        this.fail({ message: 'Invalid password', scope: 'read' });
      }
    }

    const passport = new Passport();
    passport.use('fail', new Strategy());

    /** @type {import('../types.js').Request} */
    let request;
    /** @type {import('@passport-next/chai-connect-middleware').Response} */
    let response;

    before((done) => {
      chai.connect.use('express', authenticate(passport, 'fail', {
        failureMessage: { nonBooleanOrString: true },
        failureRedirect: 'https://www.example.com/login'
      }))
        .req((req) => {
          request = req;
          req.session = {};
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

    it('should not add message to session', () => {
      expect(request.session.messages).to.be.undefined;
    });

    it('should redirect', () => {
      expect(response.statusCode).to.equal(302);
      expect(response.getHeader('Location')).to.equal('https://www.example.com/login');
    });
  });
});
