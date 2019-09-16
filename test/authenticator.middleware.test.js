'use strict';

const chai = require('chai');
const Authenticator = require('../lib/authenticator');


describe('Authenticator', () => {
  describe('#initialize', () => {
    it('should have correct arity', () => {
      const passport = new Authenticator();
      expect(passport.initialize).to.have.length(1);
    });

    describe('handling a request', () => {
      const passport = new Authenticator();
      let request;
      let error;

      before((done) => {
        chai.connect.use(passport.initialize())
          .req((req) => {
            request = req;
            req.session = {};
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

      it('should set user property on authenticator', () => {
        expect(passport._userProperty).to.equal('user');
      });

      it('should not initialize namespace within session', () => {
        expect(request.session.passport).to.be.undefined;
      });

      it('should expose authenticator on internal request property', () => {
        expect(request._passport).to.be.an('object');
        expect(request._passport.instance).to.be.an.instanceOf(Authenticator);
        expect(request._passport.instance).to.equal(passport);
      });

      it('should not expose session storage on internal request property', () => {
        expect(request._passport.session).to.be.undefined;
      });
    });

    describe('handling a request with custom user property', () => {
      const passport = new Authenticator();
      let request;
      let error;

      before((done) => {
        chai.connect.use(passport.initialize({ userProperty: 'currentUser' }))
          .req((req) => {
            request = req;
            req.session = {};
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

      it('should set user property on authenticator', () => {
        expect(passport._userProperty).to.equal('currentUser');
      });

      it('should not initialize namespace within session', () => {
        expect(request.session.passport).to.be.undefined;
      });

      it('should expose authenticator on internal request property', () => {
        expect(request._passport).to.be.an('object');
        expect(request._passport.instance).to.be.an.instanceOf(Authenticator);
        expect(request._passport.instance).to.equal(passport);
      });

      it('should not expose session storage on internal request property', () => {
        expect(request._passport.session).to.be.undefined;
      });
    });
  });


  describe('#authenticate', () => {
    it('should have correct arity', () => {
      const passport = new Authenticator();
      expect(passport.authenticate).to.have.length(3);
    });

    describe('handling a request', () => {
      class Strategy {
        authenticate() {
          const user = { id: '1', username: 'jaredhanson' };
          this.success(user);
        }
      }

      const passport = new Authenticator();
      passport.use('success', new Strategy());

      let request;
      let error;

      before((done) => {
        chai.connect.use(passport.authenticate('success'))
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
        expect(request.user.id).to.equal('1');
        expect(request.user.username).to.equal('jaredhanson');
      });

      it('should set authInfo', () => {
        expect(request.authInfo).to.be.an('object');
        expect(Object.keys(request.authInfo)).to.have.length(0);
      });
    });
  });


  describe('#authorize', () => {
    it('should have correct arity', () => {
      const passport = new Authenticator();
      expect(passport.authorize).to.have.length(3);
    });

    describe('handling a request', () => {
      class Strategy {
        authenticate() {
          const user = { id: '1', username: 'jaredhanson' };
          this.success(user);
        }
      }

      const passport = new Authenticator();
      passport.use('success', new Strategy());

      let request;
      let error;

      before((done) => {
        chai.connect.use(passport.authorize('success'))
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

      it('should not set user', () => {
        expect(request.user).to.be.undefined;
      });

      it('should set account', () => {
        expect(request.account).to.be.an('object');
        expect(request.account.id).to.equal('1');
        expect(request.account.username).to.equal('jaredhanson');
      });

      it('should not set authInfo', () => {
        expect(request.authInfo).to.be.undefined;
      });
    });
  });

  describe('#session', () => {
    it('should have correct arity', () => {
      const passport = new Authenticator();
      expect(passport.session).to.have.length(1);
    });

    describe('handling a request', () => {
      const passport = new Authenticator();
      passport.deserializeUser((req, user) => {
        return { id: user };
      });

      let request;
      let error;

      before((done) => {
        chai.connect.use(passport.session())
          .req((req) => {
            request = req;

            req._passport = {};
            req._passport.instance = {};
            req._passport.session = {};
            req._passport.session.user = '123456';
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
        expect(request.user.id).to.equal('123456');
      });

      it('should maintain session', () => {
        expect(request._passport.session).to.be.an('object');
        expect(request._passport.session.user).to.equal('123456');
      });
    });
  });
});
