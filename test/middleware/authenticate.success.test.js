/* eslint-disable no-shadow */
'use strict';

const chai = require('chai');
const authenticate = require('../../lib/middleware/authenticate');
const { Passport } = require('../..');


describe('middleware/authenticate', () => {
  describe('success', () => {
    class Strategy {
      authenticate() {
        const user = { id: '1', username: 'jaredhanson' };
        this.success(user);
      }
    }

    const passport = new Passport();
    passport.use('success', new Strategy());

    let request;
    let error;

    before((done) => {
      chai.connect.use(authenticate(passport, 'success'))
        .req((req) => {
          request = req;

          req.logIn = function logIn(user, options, done) {
            this.user = user;
            done();
          };
        })
        .next((err) => {
          error = err;
          done();
        })
        .dispatch();
    });

    it('should not error', () => {
      // eslint-disable-next-line no-unused-expressions
      expect(error).to.be.undefined;
    });

    it('should set user', () => {
      expect(request.user).to.be.an('object');
      expect(request.user.id).to.equal('1');
      expect(request.user.username).to.equal('jaredhanson');
    });

    it('should set authInfo', () => {
      expect(request.authInfo).to.be.an('object');
      expect(Object.keys(request.authInfo)).to.have.length(0);
    });
  });

  describe('success that assigns a specific property', () => {
    class Strategy {
      authenticate() {
        const user = { id: '1', username: 'jaredhanson' };
        this.success(user);
      }
    }

    const passport = new Passport();
    passport.use('success', new Strategy());

    let request;
    let error;

    before((done) => {
      chai.connect.use(authenticate(passport, 'success', { assignProperty: 'account' }))
        .req((req) => {
          request = req;

          req.logIn = function logIn(user, options, done) {
            this.user = user;
            done();
          };
        })
        .next((err) => {
          error = err;
          done();
        })
        .dispatch();
    });

    it('should not error', () => {
      // eslint-disable-next-line no-unused-expressions
      expect(error).to.be.undefined;
    });

    it('should not set user', () => {
      // eslint-disable-next-line no-unused-expressions
      expect(request.user).to.be.undefined;
    });

    it('should set account', () => {
      expect(request.account).to.be.an('object');
      expect(request.account.id).to.equal('1');
      expect(request.account.username).to.equal('jaredhanson');
    });

    it('should not set authInfo', () => {
      // eslint-disable-next-line no-unused-expressions
      expect(request.authInfo).to.be.undefined;
    });
  });

  describe('success with strategy-specific options', () => {
    class Strategy {
      authenticate(req, options) {
        const user = { id: '1', username: 'jaredhanson' };
        if (options.scope === 'email') {
          user.email = 'jaredhanson@example.com';
        }
        this.success(user);
      }
    }

    const passport = new Passport();
    passport.use('success', new Strategy());

    let request;
    let error;

    before((done) => {
      chai.connect.use(authenticate(passport, 'success', { scope: 'email' }))
        .req((req) => {
          request = req;

          // eslint-disable-next-line consistent-return
          req.logIn = function logIn(user, options, done) {
            if (options.scope !== 'email') { return done(new Error('invalid options')); }
            this.user = user;
            done();
          };
        })
        .next((err) => {
          error = err;
          done();
        })
        .dispatch();
    });

    it('should not error', () => {
      // eslint-disable-next-line no-unused-expressions
      expect(error).to.be.undefined;
    });

    it('should set user', () => {
      expect(request.user).to.be.an('object');
      expect(request.user.id).to.equal('1');
      expect(request.user.username).to.equal('jaredhanson');
      expect(request.user.email).to.equal('jaredhanson@example.com');
    });

    it('should set authInfo', () => {
      expect(request.authInfo).to.be.an('object');
      expect(Object.keys(request.authInfo)).to.have.length(0);
    });
  });

  describe('success with redirect', () => {
    class Strategy {
      authenticate() {
        const user = { id: '1', username: 'jaredhanson' };
        this.success(user);
      }
    }

    const passport = new Passport();
    passport.use('success', new Strategy());

    let request;
    let response;

    before((done) => {
      chai.connect.use('express', authenticate(passport, 'success', { successRedirect: 'http://www.example.com/account' }))
        .req((req) => {
          request = req;

          req.logIn = function logIn(user, options, done) {
            this.user = user;
            done();
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

    it('should set authInfo', () => {
      expect(request.authInfo).to.be.an('object');
      expect(Object.keys(request.authInfo)).to.have.length(0);
    });

    it('should redirect', () => {
      expect(response.statusCode).to.equal(302);
      expect(response.getHeader('Location')).to.equal('http://www.example.com/account');
    });
  });

  describe('success with return to previous location', () => {
    class Strategy {
      authenticate() {
        const user = { id: '1', username: 'jaredhanson' };
        this.success(user);
      }
    }

    const passport = new Passport();
    passport.use('success', new Strategy());

    let request;
    let response;

    before((done) => {
      chai.connect.use('express', authenticate(passport, 'success', { successReturnToOrRedirect: 'http://www.example.com/default' }))
        .req((req) => {
          request = req;
          req.session = { returnTo: 'http://www.example.com/return' };

          req.logIn = function logIn(user, options, done) {
            this.user = user;
            done();
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

    it('should set authInfo', () => {
      expect(request.authInfo).to.be.an('object');
      expect(Object.keys(request.authInfo)).to.have.length(0);
    });

    it('should redirect', () => {
      expect(response.statusCode).to.equal(302);
      expect(response.getHeader('Location')).to.equal('http://www.example.com/return');
    });

    it('should move return to from session', () => {
      // eslint-disable-next-line no-unused-expressions
      expect(request.session.returnTo).to.be.undefined;
    });
  });

  describe('success with return to default location', () => {
    class Strategy {
      authenticate() {
        const user = { id: '1', username: 'jaredhanson' };
        this.success(user);
      }
    }

    const passport = new Passport();
    passport.use('success', new Strategy());

    let request;
    let response;

    before((done) => {
      chai.connect.use('express', authenticate(passport, 'success', { successReturnToOrRedirect: 'http://www.example.com/default' }))
        .req((req) => {
          request = req;

          req.logIn = function logIn(user, options, done) {
            this.user = user;
            done();
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

    it('should set authInfo', () => {
      expect(request.authInfo).to.be.an('object');
      expect(Object.keys(request.authInfo)).to.have.length(0);
    });

    it('should redirect', () => {
      expect(response.statusCode).to.equal(302);
      expect(response.getHeader('Location')).to.equal('http://www.example.com/default');
    });
  });

  describe('success, but login that encounters an error', () => {
    class Strategy {
      authenticate() {
        const user = { id: '1', username: 'jaredhanson' };
        this.success(user);
      }
    }

    const passport = new Passport();
    passport.use('success', new Strategy());

    let request;
    let error;

    before((done) => {
      chai.connect.use(authenticate(passport, 'success'))
        .req((req) => {
          request = req;

          req.logIn = function logIn(user, options, done) {
            done(new Error('something went wrong'));
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
      expect(error.message).to.equal('something went wrong');
    });

    it('should not set user', () => {
      // eslint-disable-next-line no-unused-expressions
      expect(request.user).to.be.undefined;
    });

    it('should not set authInfo', () => {
      // eslint-disable-next-line no-unused-expressions
      expect(request.authInfo).to.be.undefined;
    });
  });
});
