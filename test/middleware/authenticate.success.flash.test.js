/* eslint-disable no-shadow */
'use strict';

const chai = require('chai');
const authenticate = require('../../lib/middleware/authenticate');
const { Passport } = require('../..');


describe('middleware/authenticate', () => {
  describe('using strategy that specifies message', () => {
    describe('success with flash message', () => {
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
          successFlash: true,
          successRedirect: 'http://www.example.com/account'
        }))
          .req((req) => {
            request = req;
            req.session = {};

            req.logIn = function logIn(user, options, done) {
              this.user = user;
              done();
            };
            req.flash = function flash(type, msg) {
              this.message = { type, msg };
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

      it('should flash message', () => {
        expect(request.message.type).to.equal('success');
        expect(request.message.msg).to.equal('Welcome!');
      });

      it('should redirect', () => {
        expect(response.statusCode).to.equal(302);
        expect(response.getHeader('Location')).to.equal('http://www.example.com/account');
      });
    });

    describe('success with flash message using type set by route', () => {
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
          successFlash: { type: 'info' },
          successRedirect: 'http://www.example.com/account'
        }))
          .req((req) => {
            request = req;
            req.session = {};

            req.logIn = function logIn(user, options, done) {
              this.user = user;
              done();
            };
            req.flash = function flash(type, msg) {
              this.message = { type, msg };
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

      it('should flash message', () => {
        expect(request.message.type).to.equal('info');
        expect(request.message.msg).to.equal('Welcome!');
      });

      it('should redirect', () => {
        expect(response.statusCode).to.equal(302);
        expect(response.getHeader('Location')).to.equal('http://www.example.com/account');
      });
    });

    describe('success with flash message overridden by route as string', () => {
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
          successFlash: 'Login complete',
          successRedirect: 'http://www.example.com/account'
        }))
          .req((req) => {
            request = req;
            req.session = {};

            req.logIn = function logIn(user, options, done) {
              this.user = user;
              done();
            };
            req.flash = function flash(type, msg) {
              this.message = { type, msg };
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

      it('should flash message', () => {
        expect(request.message.type).to.equal('success');
        expect(request.message.msg).to.equal('Login complete');
      });

      it('should redirect', () => {
        expect(response.statusCode).to.equal(302);
        expect(response.getHeader('Location')).to.equal('http://www.example.com/account');
      });
    });

    describe('success with flash message overridden by route using options', () => {
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
          successFlash: { message: 'OK' },
          successRedirect: 'http://www.example.com/account'
        }))
          .req((req) => {
            request = req;
            req.session = {};

            req.logIn = function logIn(user, options, done) {
              this.user = user;
              done();
            };
            req.flash = function flash(type, msg) {
              this.message = { type, msg };
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

      it('should flash message', () => {
        expect(request.message.type).to.equal('success');
        expect(request.message.msg).to.equal('OK');
      });

      it('should redirect', () => {
        expect(response.statusCode).to.equal(302);
        expect(response.getHeader('Location')).to.equal('http://www.example.com/account');
      });
    });

    describe('success with flash message overridden by route using options with type', () => {
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
          successFlash: { type: 'notice', message: 'Last login was yesterday' },
          successRedirect: 'http://www.example.com/account'
        }))
          .req((req) => {
            request = req;
            req.session = {};

            req.logIn = function logIn(user, options, done) {
              this.user = user;
              done();
            };
            req.flash = function flash(type, msg) {
              this.message = { type, msg };
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

      it('should flash message', () => {
        expect(request.message.type).to.equal('notice');
        expect(request.message.msg).to.equal('Last login was yesterday');
      });

      it('should redirect', () => {
        expect(response.statusCode).to.equal(302);
        expect(response.getHeader('Location')).to.equal('http://www.example.com/account');
      });
    });
  });


  describe('using strategy that specifies message and type', () => {
    describe('success with flash message', () => {
      class Strategy {
        authenticate() {
          const user = { id: '1', username: 'jaredhanson' };
          this.success(user, { type: 'info', message: 'Hello' });
        }
      }

      const passport = new Passport();
      passport.use('success', new Strategy());

      let request;
      let response;

      before((done) => {
        chai.connect.use('express', authenticate(passport, 'success', {
          successFlash: true,
          successRedirect: 'http://www.example.com/account'
        }))
          .req((req) => {
            request = req;
            req.session = {};

            req.logIn = function logIn(user, options, done) {
              this.user = user;
              done();
            };
            req.flash = function flash(type, msg) {
              this.message = { type, msg };
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

      it('should flash message', () => {
        expect(request.message.type).to.equal('info');
        expect(request.message.msg).to.equal('Hello');
      });

      it('should redirect', () => {
        expect(response.statusCode).to.equal(302);
        expect(response.getHeader('Location')).to.equal('http://www.example.com/account');
      });
    });

    describe('success with flash message using type set by route', () => {
      class Strategy {
        authenticate() {
          const user = { id: '1', username: 'jaredhanson' };
          this.success(user, { type: 'info', message: 'Hello' });
        }
      }

      const passport = new Passport();
      passport.use('success', new Strategy());

      let request;
      let response;

      before((done) => {
        chai.connect.use('express', authenticate(passport, 'success', {
          successFlash: { type: 'ok' },
          successRedirect: 'http://www.example.com/account'
        }))
          .req((req) => {
            request = req;
            req.session = {};

            req.logIn = function logIn(user, options, done) {
              this.user = user;
              done();
            };
            req.flash = function flash(type, msg) {
              this.message = { type, msg };
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

      it('should flash message', () => {
        expect(request.message.type).to.equal('ok');
        expect(request.message.msg).to.equal('Hello');
      });

      it('should redirect', () => {
        expect(response.statusCode).to.equal(302);
        expect(response.getHeader('Location')).to.equal('http://www.example.com/account');
      });
    });

    describe('success with flash message overridden by route as string', () => {
      class Strategy {
        authenticate() {
          const user = { id: '1', username: 'jaredhanson' };
          this.success(user, { type: 'info', message: 'Hello' });
        }
      }

      const passport = new Passport();
      passport.use('success', new Strategy());

      let request;
      let response;

      before((done) => {
        chai.connect.use('express', authenticate(passport, 'success', {
          successFlash: 'Success!',
          successRedirect: 'http://www.example.com/account'
        }))
          .req((req) => {
            request = req;
            req.session = {};

            req.logIn = function logIn(user, options, done) {
              this.user = user;
              done();
            };
            req.flash = function flash(type, msg) {
              this.message = { type, msg };
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

      it('should flash message', () => {
        expect(request.message.type).to.equal('success');
        expect(request.message.msg).to.equal('Success!');
      });

      it('should redirect', () => {
        expect(response.statusCode).to.equal(302);
        expect(response.getHeader('Location')).to.equal('http://www.example.com/account');
      });
    });

    describe('success with flash message overridden by route using options', () => {
      class Strategy {
        authenticate() {
          const user = { id: '1', username: 'jaredhanson' };
          this.success(user, { type: 'info', message: 'Hello' });
        }
      }

      const passport = new Passport();
      passport.use('success', new Strategy());

      let request;
      let response;

      before((done) => {
        chai.connect.use('express', authenticate(passport, 'success', {
          successFlash: { message: 'Okay' },
          successRedirect: 'http://www.example.com/account'
        }))
          .req((req) => {
            request = req;
            req.session = {};

            req.logIn = function logIn(user, options, done) {
              this.user = user;
              done();
            };
            req.flash = function flash(type, msg) {
              this.message = { type, msg };
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

      it('should flash message', () => {
        expect(request.message.type).to.equal('success');
        expect(request.message.msg).to.equal('Okay');
      });

      it('should redirect', () => {
        expect(response.statusCode).to.equal(302);
        expect(response.getHeader('Location')).to.equal('http://www.example.com/account');
      });
    });

    describe('success with flash message overridden by route using options with type', () => {
      class Strategy {
        authenticate() {
          const user = { id: '1', username: 'jaredhanson' };
          this.success(user, { type: 'info', message: 'Hello' });
        }
      }

      const passport = new Passport();
      passport.use('success', new Strategy());

      let request;
      let response;

      before((done) => {
        chai.connect.use('express', authenticate(passport, 'success', {
          successFlash: { type: 'warn', message: 'Last login from far away place' },
          successRedirect: 'http://www.example.com/account'
        }))
          .req((req) => {
            request = req;
            req.session = {};

            req.logIn = function logIn(user, options, done) {
              this.user = user;
              done();
            };
            req.flash = function flash(type, msg) {
              this.message = { type, msg };
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

      it('should flash message', () => {
        expect(request.message.type).to.equal('warn');
        expect(request.message.msg).to.equal('Last login from far away place');
      });

      it('should redirect', () => {
        expect(response.statusCode).to.equal(302);
        expect(response.getHeader('Location')).to.equal('http://www.example.com/account');
      });
    });
  });


  describe('using strategy that specifies message as string', () => {
    describe('success with flash message', () => {
      class Strategy {
        authenticate() {
          const user = { id: '1', username: 'jaredhanson' };
          this.success(user, 'Greetings');
        }
      }

      const passport = new Passport();
      passport.use('success', new Strategy());

      let request;
      let response;

      before((done) => {
        chai.connect.use('express', authenticate(passport, 'success', {
          successFlash: true,
          successRedirect: 'http://www.example.com/account'
        }))
          .req((req) => {
            request = req;
            req.session = {};

            req.logIn = function logIn(user, options, done) {
              this.user = user;
              done();
            };
            req.flash = function flash(type, msg) {
              this.message = { type, msg };
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

      it('should flash message', () => {
        expect(request.message.type).to.equal('success');
        expect(request.message.msg).to.equal('Greetings');
      });

      it('should redirect', () => {
        expect(response.statusCode).to.equal(302);
        expect(response.getHeader('Location')).to.equal('http://www.example.com/account');
      });
    });

    describe('success with flash message using type set by route', () => {
      class Strategy {
        authenticate() {
          const user = { id: '1', username: 'jaredhanson' };
          this.success(user, 'Greetings');
        }
      }

      const passport = new Passport();
      passport.use('success', new Strategy());

      let request;
      let response;

      before((done) => {
        chai.connect.use('express', authenticate(passport, 'success', {
          successFlash: { type: 'info' },
          successRedirect: 'http://www.example.com/account'
        }))
          .req((req) => {
            request = req;
            req.session = {};

            req.logIn = function logIn(user, options, done) {
              this.user = user;
              done();
            };
            req.flash = function flash(type, msg) {
              this.message = { type, msg };
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

      it('should flash message', () => {
        expect(request.message.type).to.equal('info');
        expect(request.message.msg).to.equal('Greetings');
      });

      it('should redirect', () => {
        expect(response.statusCode).to.equal(302);
        expect(response.getHeader('Location')).to.equal('http://www.example.com/account');
      });
    });

    describe('success with flash message overridden by route as string', () => {
      class Strategy {
        authenticate() {
          const user = { id: '1', username: 'jaredhanson' };
          this.success(user, 'Greetings');
        }
      }

      const passport = new Passport();
      passport.use('success', new Strategy());

      let request;
      let response;

      before((done) => {
        chai.connect.use('express', authenticate(passport, 'success', {
          successFlash: 'Login complete',
          successRedirect: 'http://www.example.com/account'
        }))
          .req((req) => {
            request = req;
            req.session = {};

            req.logIn = function logIn(user, options, done) {
              this.user = user;
              done();
            };
            req.flash = function flash(type, msg) {
              this.message = { type, msg };
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

      it('should flash message', () => {
        expect(request.message.type).to.equal('success');
        expect(request.message.msg).to.equal('Login complete');
      });

      it('should redirect', () => {
        expect(response.statusCode).to.equal(302);
        expect(response.getHeader('Location')).to.equal('http://www.example.com/account');
      });
    });

    describe('success with flash message overridden by route using options', () => {
      class Strategy {
        authenticate() {
          const user = { id: '1', username: 'jaredhanson' };
          this.success(user, 'Greetings');
        }
      }

      const passport = new Passport();
      passport.use('success', new Strategy());

      let request;
      let response;

      before((done) => {
        chai.connect.use('express', authenticate(passport, 'success', {
          successFlash: { message: 'OK' },
          successRedirect: 'http://www.example.com/account'
        }))
          .req((req) => {
            request = req;
            req.session = {};

            req.logIn = function logIn(user, options, done) {
              this.user = user;
              done();
            };
            req.flash = function flash(type, msg) {
              this.message = { type, msg };
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

      it('should flash message', () => {
        expect(request.message.type).to.equal('success');
        expect(request.message.msg).to.equal('OK');
      });

      it('should redirect', () => {
        expect(response.statusCode).to.equal(302);
        expect(response.getHeader('Location')).to.equal('http://www.example.com/account');
      });
    });

    describe('success with flash message overridden by route using options with type', () => {
      class Strategy {
        authenticate() {
          const user = { id: '1', username: 'jaredhanson' };
          this.success(user, 'Greetings');
        }
      }

      const passport = new Passport();
      passport.use('success', new Strategy());

      let request;
      let response;

      before((done) => {
        chai.connect.use('express', authenticate(passport, 'success', {
          successFlash: { type: 'notice', message: 'Last login was yesterday' },
          successRedirect: 'http://www.example.com/account'
        }))
          .req((req) => {
            request = req;
            req.session = {};

            req.logIn = function logIn(user, options, done) {
              this.user = user;
              done();
            };
            req.flash = function flash(type, msg) {
              this.message = { type, msg };
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

      it('should flash message', () => {
        expect(request.message.type).to.equal('notice');
        expect(request.message.msg).to.equal('Last login was yesterday');
      });

      it('should redirect', () => {
        expect(response.statusCode).to.equal(302);
        expect(response.getHeader('Location')).to.equal('http://www.example.com/account');
      });
    });
  });


  describe('using strategy that does not specify message', () => {
    describe('success with flash message left up to strategy', () => {
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
        chai.connect.use('express', authenticate(passport, 'success', {
          successFlash: true,
          successRedirect: 'http://www.example.com/account'
        }))
          .req((req) => {
            request = req;
            req.session = {};

            req.logIn = function logIn(user, options, done) {
              this.user = user;
              done();
            };
            req.flash = function flash(type, msg) {
              this.message = { type, msg };
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

      it('should not flash message', () => {
        // eslint-disable-next-line no-unused-expressions
        expect(request.message).to.be.undefined;
      });

      it('should redirect', () => {
        expect(response.statusCode).to.equal(302);
        expect(response.getHeader('Location')).to.equal('http://www.example.com/account');
      });
    });

    describe('success with flash message left up to strategy using type set by route', () => {
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
        chai.connect.use('express', authenticate(passport, 'success', {
          successFlash: { type: 'info' },
          successRedirect: 'http://www.example.com/account'
        }))
          .req((req) => {
            request = req;
            req.session = {};

            req.logIn = function logIn(user, options, done) {
              this.user = user;
              done();
            };
            req.flash = function flash(type, msg) {
              this.message = { type, msg };
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

      it('should not flash message', () => {
        // eslint-disable-next-line no-unused-expressions
        expect(request.message).to.be.undefined;
      });

      it('should redirect', () => {
        expect(response.statusCode).to.equal(302);
        expect(response.getHeader('Location')).to.equal('http://www.example.com/account');
      });
    });

    describe('success with flash message specified by route as string', () => {
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
        chai.connect.use('express', authenticate(passport, 'success', {
          successFlash: 'Login complete',
          successRedirect: 'http://www.example.com/account'
        }))
          .req((req) => {
            request = req;
            req.session = {};

            req.logIn = function logIn(user, options, done) {
              this.user = user;
              done();
            };
            req.flash = function flash(type, msg) {
              this.message = { type, msg };
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

      it('should flash message', () => {
        expect(request.message.type).to.equal('success');
        expect(request.message.msg).to.equal('Login complete');
      });

      it('should redirect', () => {
        expect(response.statusCode).to.equal(302);
        expect(response.getHeader('Location')).to.equal('http://www.example.com/account');
      });
    });

    describe('success with flash message specified by route using options', () => {
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
        chai.connect.use('express', authenticate(passport, 'success', {
          successFlash: { message: 'OK' },
          successRedirect: 'http://www.example.com/account'
        }))
          .req((req) => {
            request = req;
            req.session = {};

            req.logIn = function logIn(user, options, done) {
              this.user = user;
              done();
            };
            req.flash = function flash(type, msg) {
              this.message = { type, msg };
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

      it('should flash message', () => {
        expect(request.message.type).to.equal('success');
        expect(request.message.msg).to.equal('OK');
      });

      it('should redirect', () => {
        expect(response.statusCode).to.equal(302);
        expect(response.getHeader('Location')).to.equal('http://www.example.com/account');
      });
    });

    describe('success with flash message specified by route using options with type', () => {
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
        chai.connect.use('express', authenticate(passport, 'success', {
          successFlash: { type: 'notice', message: 'Last login was yesterday' },
          successRedirect: 'http://www.example.com/account'
        }))
          .req((req) => {
            request = req;
            req.session = {};

            req.logIn = function logIn(user, options, done) {
              this.user = user;
              done();
            };
            req.flash = function flash(type, msg) {
              this.message = { type, msg };
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

      it('should flash message', () => {
        expect(request.message.type).to.equal('notice');
        expect(request.message.msg).to.equal('Last login was yesterday');
      });

      it('should redirect', () => {
        expect(response.statusCode).to.equal(302);
        expect(response.getHeader('Location')).to.equal('http://www.example.com/account');
      });
    });
  });
});
