'use strict';

const chai = require('chai');
const authenticate = require('../../lib/middleware/authenticate');
const { Passport } = require('../..');


describe('middleware/authenticate', () => {
  describe('success with message set by route', () => {
    class Strategy {
      authenticate() {
        const user = { id: '1', username: 'jaredhanson' };
        this.success(user, { message: 'Welcome!' });
      }
    }

    const passport = new Passport();
    passport.use('success', new Strategy());

    let request;
    let response;

    before((done) => {
      chai.connect.use('express', authenticate(passport, 'success', {
        successMessage: 'Login complete',
        successRedirect: 'http://www.example.com/account'
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
      expect(request.session.messages[0]).to.equal('Login complete');
    });

    it('should redirect', () => {
      expect(response.statusCode).to.equal(302);
      expect(response.getHeader('Location')).to.equal('http://www.example.com/account');
    });
  });

  describe('success with message set by route that is added to messages', () => {
    class Strategy {
      authenticate() {
        const user = { id: '1', username: 'jaredhanson' };
        this.success(user, { message: 'Welcome!' });
      }
    }

    const passport = new Passport();
    passport.use('success', new Strategy());

    let request;
    let response;

    before((done) => {
      chai.connect.use('express', authenticate(passport, 'success', {
        successMessage: 'Login complete',
        successRedirect: 'http://www.example.com/account'
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
      expect(request.session.messages[0]).to.equal('I exist!');
      expect(request.session.messages[1]).to.equal('Login complete');
    });

    it('should redirect', () => {
      expect(response.statusCode).to.equal(302);
      expect(response.getHeader('Location')).to.equal('http://www.example.com/account');
    });
  });

  describe('success with message set by strategy', () => {
    class Strategy {
      authenticate() {
        const user = { id: '1', username: 'jaredhanson' };
        this.success(user, { message: 'Welcome!' });
      }
    }

    const passport = new Passport();
    passport.use('success', new Strategy());

    let request;
    let response;

    before((done) => {
      chai.connect.use('express', authenticate(passport, 'success', {
        successMessage: true,
        successRedirect: 'http://www.example.com/account'
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
      expect(request.session.messages[0]).to.equal('Welcome!');
    });

    it('should redirect', () => {
      expect(response.statusCode).to.equal(302);
      expect(response.getHeader('Location')).to.equal('http://www.example.com/account');
    });
  });

  describe('success with message set by strategy with extra info', () => {
    class Strategy {
      authenticate() {
        const user = { id: '1', username: 'jaredhanson' };
        this.success(user, { message: 'Welcome!', scope: 'read' });
      }
    }

    const passport = new Passport();
    passport.use('success', new Strategy());

    let request;
    let response;

    before((done) => {
      chai.connect.use('express', authenticate(passport, 'success', {
        successMessage: true,
        successRedirect: 'http://www.example.com/account'
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
      expect(request.session.messages[0]).to.equal('Welcome!');
    });

    it('should redirect', () => {
      expect(response.statusCode).to.equal(302);
      expect(response.getHeader('Location')).to.equal('http://www.example.com/account');
    });
  });

  describe('success with message set by strategy with extra info (but a boolean successMessage without a message property)', () => {
    class Strategy {
      authenticate() {
        const user = { id: '1', username: 'jaredhanson' };
        this.success(user, { scope: 'read' });
      }
    }

    const passport = new Passport();
    passport.use('success', new Strategy());

    let request;
    let response;

    before((done) => {
      chai.connect.use('express', authenticate(passport, 'success', {
        successMessage: true,
        successRedirect: 'http://www.example.com/account'
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
      // eslint-disable-next-line no-unused-expressions
      expect(request.session.messages).to.be.undefined;
    });

    it('should redirect', () => {
      expect(response.statusCode).to.equal(302);
      expect(response.getHeader('Location')).to.equal('http://www.example.com/account');
    });
  });

  describe('success with message set by strategy with extra info (and non-string success message info)', () => {
    class Strategy {
      authenticate() {
        const user = { id: '1', username: 'jaredhanson' };
        this.success(user, { message: 'Welcome!', scope: 'read' });
      }
    }

    const passport = new Passport();
    passport.use('success', new Strategy());

    let request;
    let response;

    before((done) => {
      chai.connect.use('express', authenticate(passport, 'success', {
        successMessage: { nonBooleanOrString: true },
        successRedirect: 'http://www.example.com/account'
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
      // eslint-disable-next-line no-unused-expressions
      expect(request.session.messages).to.be.undefined;
    });

    it('should redirect', () => {
      expect(response.statusCode).to.equal(302);
      expect(response.getHeader('Location')).to.equal('http://www.example.com/account');
    });
  });
});
