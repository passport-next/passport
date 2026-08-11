import { chai, expect } from '../bootstrap/node.js';
import authenticate from '../../lib/middleware/authenticate.js';
import { Passport, EnhancedStrategy } from '../../lib/index.js';


describe('middleware/authenticate', () => {
  describe('using strategy that specifies message', () => {
    describe('success with flash message', () => {
      class Strategy extends EnhancedStrategy {
        authenticate() {
          const user = { id: '1', username: 'jaredhanson' };
          this.success(user, { message: 'Welcome!' });
        }
      }

      const passport = new Passport();
      passport.use('success', new Strategy());

      /**
       * @type {import('../types.js').Request}
       */
      let request;

      /** @type {import('@passport-next/chai-connect-middleware').Response} */
      let response;

      before((done) => {
        chai.connect.use('express', authenticate(passport, 'success', {
          successFlash: true,
          successRedirect: 'https://www.example.com/account'
        }))
          .req((req) => {
            request = req;
            req.session = {};

            req.logIn = function logIn(user) {
              this.user = user;
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
        expect(response.getHeader('Location')).to.equal('https://www.example.com/account');
      });
    });

    describe('success with flash message using type set by route', () => {
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
          successFlash: { type: 'info' },
          successRedirect: 'https://www.example.com/account'
        }))
          .req((req) => {
            request = req;
            req.session = {};

            req.logIn = function logIn(user) {
              this.user = user;
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
        expect(response.getHeader('Location')).to.equal('https://www.example.com/account');
      });
    });

    describe('success with flash message overridden by route as string', () => {
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
          successFlash: 'Login complete',
          successRedirect: 'https://www.example.com/account'
        }))
          .req((req) => {
            request = req;
            req.session = {};

            req.logIn = function logIn(user) {
              this.user = user;
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
        expect(response.getHeader('Location')).to.equal('https://www.example.com/account');
      });
    });

    describe('success with flash message overridden by route using options', () => {
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
          successFlash: { message: 'OK' },
          successRedirect: 'https://www.example.com/account'
        }))
          .req((req) => {
            request = req;
            req.session = {};

            req.logIn = function logIn(user) {
              this.user = user;
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
        expect(response.getHeader('Location')).to.equal('https://www.example.com/account');
      });
    });

    describe('success with flash message overridden by route using options with type', () => {
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
          successFlash: { type: 'notice', message: 'Last login was yesterday' },
          successRedirect: 'https://www.example.com/account'
        }))
          .req((req) => {
            request = req;
            req.session = {};

            req.logIn = function logIn(user) {
              this.user = user;
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
        expect(response.getHeader('Location')).to.equal('https://www.example.com/account');
      });
    });
  });


  describe('using strategy that specifies message and type', () => {
    describe('success with flash message', () => {
      class Strategy extends EnhancedStrategy {
        authenticate() {
          const user = { id: '1', username: 'jaredhanson' };
          this.success(user, { type: 'info', message: 'Hello' });
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
          successFlash: true,
          successRedirect: 'https://www.example.com/account'
        }))
          .req((req) => {
            request = req;
            req.session = {};

            req.logIn = function logIn(user) {
              this.user = user;
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
        expect(response.getHeader('Location')).to.equal('https://www.example.com/account');
      });
    });

    describe('success with flash message using type set by route', () => {
      class Strategy extends EnhancedStrategy {
        authenticate() {
          const user = { id: '1', username: 'jaredhanson' };
          this.success(user, { type: 'info', message: 'Hello' });
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
          successFlash: { type: 'ok' },
          successRedirect: 'https://www.example.com/account'
        }))
          .req((req) => {
            request = req;
            req.session = {};

            req.logIn = function logIn(user) {
              this.user = user;
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
        expect(response.getHeader('Location')).to.equal('https://www.example.com/account');
      });
    });

    describe('success with flash message overridden by route as string', () => {
      class Strategy extends EnhancedStrategy {
        authenticate() {
          const user = { id: '1', username: 'jaredhanson' };
          this.success(user, { type: 'info', message: 'Hello' });
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
          successFlash: 'Success!',
          successRedirect: 'https://www.example.com/account'
        }))
          .req((req) => {
            request = req;
            req.session = {};

            req.logIn = function logIn(user) {
              this.user = user;
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
        expect(response.getHeader('Location')).to.equal('https://www.example.com/account');
      });
    });

    describe('success with flash message overridden by route using options', () => {
      class Strategy extends EnhancedStrategy {
        authenticate() {
          const user = { id: '1', username: 'jaredhanson' };
          this.success(user, { type: 'info', message: 'Hello' });
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
          successFlash: { message: 'Okay' },
          successRedirect: 'https://www.example.com/account'
        }))
          .req((req) => {
            request = req;
            req.session = {};

            req.logIn = function logIn(user) {
              this.user = user;
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
        expect(response.getHeader('Location')).to.equal('https://www.example.com/account');
      });
    });

    describe('success with flash message overridden by route using options with type', () => {
      class Strategy extends EnhancedStrategy {
        authenticate() {
          const user = { id: '1', username: 'jaredhanson' };
          this.success(user, { type: 'info', message: 'Hello' });
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
          successFlash: { type: 'warn', message: 'Last login from far away place' },
          successRedirect: 'https://www.example.com/account'
        }))
          .req((req) => {
            request = req;
            req.session = {};

            req.logIn = function logIn(user) {
              this.user = user;
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
        expect(response.getHeader('Location')).to.equal('https://www.example.com/account');
      });
    });
  });


  describe('using strategy that specifies message as string', () => {
    describe('success with flash message', () => {
      class Strategy extends EnhancedStrategy {
        authenticate() {
          const user = { id: '1', username: 'jaredhanson' };
          this.success(user, 'Greetings');
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
          successFlash: true,
          successRedirect: 'https://www.example.com/account'
        }))
          .req((req) => {
            request = req;
            req.session = {};

            req.logIn = function logIn(user) {
              this.user = user;
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
        expect(response.getHeader('Location')).to.equal('https://www.example.com/account');
      });
    });

    describe('success with flash message using type set by route', () => {
      class Strategy extends EnhancedStrategy {
        authenticate() {
          const user = { id: '1', username: 'jaredhanson' };
          this.success(user, 'Greetings');
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
          successFlash: { type: 'info' },
          successRedirect: 'https://www.example.com/account'
        }))
          .req((req) => {
            request = req;
            req.session = {};

            req.logIn = function logIn(user) {
              this.user = user;
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
        expect(response.getHeader('Location')).to.equal('https://www.example.com/account');
      });
    });

    describe('success with flash message overridden by route as string', () => {
      class Strategy extends EnhancedStrategy {
        authenticate() {
          const user = { id: '1', username: 'jaredhanson' };
          this.success(user, 'Greetings');
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
          successFlash: 'Login complete',
          successRedirect: 'https://www.example.com/account'
        }))
          .req((req) => {
            request = req;
            req.session = {};

            req.logIn = function logIn(user) {
              this.user = user;
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
        expect(response.getHeader('Location')).to.equal('https://www.example.com/account');
      });
    });

    describe('success with flash message overridden by route using options', () => {
      class Strategy extends EnhancedStrategy {
        authenticate() {
          const user = { id: '1', username: 'jaredhanson' };
          this.success(user, 'Greetings');
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
          successFlash: { message: 'OK' },
          successRedirect: 'https://www.example.com/account'
        }))
          .req((req) => {
            request = req;
            req.session = {};

            req.logIn = function logIn(user) {
              this.user = user;
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
        expect(response.getHeader('Location')).to.equal('https://www.example.com/account');
      });
    });

    describe('success with flash message overridden by route using options with type', () => {
      class Strategy extends EnhancedStrategy {
        authenticate() {
          const user = { id: '1', username: 'jaredhanson' };
          this.success(user, 'Greetings');
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
          successFlash: { type: 'notice', message: 'Last login was yesterday' },
          successRedirect: 'https://www.example.com/account'
        }))
          .req((req) => {
            request = req;
            req.session = {};

            req.logIn = function logIn(user) {
              this.user = user;
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
        expect(response.getHeader('Location')).to.equal('https://www.example.com/account');
      });
    });
  });


  describe('using strategy that does not specify message', () => {
    describe('success with flash message left up to strategy', () => {
      class Strategy extends EnhancedStrategy {
        authenticate() {
          const user = { id: '1', username: 'jaredhanson' };
          this.success(user);
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
          successFlash: true,
          successRedirect: 'https://www.example.com/account'
        }))
          .req((req) => {
            request = req;
            req.session = {};

            req.logIn = function logIn(user) {
              this.user = user;
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
        expect(request.message).to.be.undefined;
      });

      it('should redirect', () => {
        expect(response.statusCode).to.equal(302);
        expect(response.getHeader('Location')).to.equal('https://www.example.com/account');
      });
    });

    describe('success with flash message left up to strategy using type set by route', () => {
      class Strategy extends EnhancedStrategy {
        authenticate() {
          const user = { id: '1', username: 'jaredhanson' };
          this.success(user);
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
          successFlash: { type: 'info' },
          successRedirect: 'https://www.example.com/account'
        }))
          .req((req) => {
            request = req;
            req.session = {};

            req.logIn = function logIn(user) {
              this.user = user;
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
        expect(request.message).to.be.undefined;
      });

      it('should redirect', () => {
        expect(response.statusCode).to.equal(302);
        expect(response.getHeader('Location')).to.equal('https://www.example.com/account');
      });
    });

    describe('success with flash message specified by route as string', () => {
      class Strategy extends EnhancedStrategy {
        authenticate() {
          const user = { id: '1', username: 'jaredhanson' };
          this.success(user);
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
          successFlash: 'Login complete',
          successRedirect: 'https://www.example.com/account'
        }))
          .req((req) => {
            request = req;
            req.session = {};

            req.logIn = function logIn(user) {
              this.user = user;
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
        expect(response.getHeader('Location')).to.equal('https://www.example.com/account');
      });
    });

    describe('success with flash message specified by route using options', () => {
      class Strategy extends EnhancedStrategy {
        authenticate() {
          const user = { id: '1', username: 'jaredhanson' };
          this.success(user);
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
          successFlash: { message: 'OK' },
          successRedirect: 'https://www.example.com/account'
        }))
          .req((req) => {
            request = req;
            req.session = {};

            req.logIn = function logIn(user) {
              this.user = user;
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
        expect(response.getHeader('Location')).to.equal('https://www.example.com/account');
      });
    });

    describe('success with flash message specified by route using options with type', () => {
      class Strategy extends EnhancedStrategy {
        authenticate() {
          const user = { id: '1', username: 'jaredhanson' };
          this.success(user);
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
          successFlash: { type: 'notice', message: 'Last login was yesterday' },
          successRedirect: 'https://www.example.com/account'
        }))
          .req((req) => {
            request = req;
            req.session = {};

            req.logIn = function logIn(user) {
              this.user = user;
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
        expect(response.getHeader('Location')).to.equal('https://www.example.com/account');
      });
    });
  });
});
