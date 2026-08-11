import { chai, expect } from '../bootstrap/node.js';
import authenticate from '../../lib/middleware/authenticate.js';
import { Passport, EnhancedStrategy } from '../../lib/index.js';


describe('middleware/authenticate', () => {
  describe('using strategy that specifies message', () => {
    describe('fail with flash message', () => {
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
          failureFlash: true,
          failureRedirect: 'https://www.example.com/login'
        }))
          .req((req) => {
            request = req;
            req.session = {};

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

      it('should not set user', () => {
        expect(request.user).to.be.undefined;
      });

      it('should flash message', () => {
        expect(request.message.type).to.equal('error');
        expect(request.message.msg).to.equal('Invalid password');
      });

      it('should redirect', () => {
        expect(response.statusCode).to.equal(302);
        expect(response.getHeader('Location')).to.equal('https://www.example.com/login');
      });
    });

    describe('fail with flash message using type set by route', () => {
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
          failureFlash: { type: 'info' },
          failureRedirect: 'https://www.example.com/login'
        }))
          .req((req) => {
            request = req;
            req.session = {};

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

      it('should not set user', () => {
        expect(request.user).to.be.undefined;
      });

      it('should flash message', () => {
        expect(request.message.type).to.equal('info');
        expect(request.message.msg).to.equal('Invalid password');
      });

      it('should redirect', () => {
        expect(response.statusCode).to.equal(302);
        expect(response.getHeader('Location')).to.equal('https://www.example.com/login');
      });
    });

    describe('fail with flash message overridden by route as string', () => {
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
          failureFlash: 'Wrong credentials',
          failureRedirect: 'https://www.example.com/login'
        }))
          .req((req) => {
            request = req;
            req.session = {};

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

      it('should not set user', () => {
        expect(request.user).to.be.undefined;
      });

      it('should flash message', () => {
        expect(request.message.type).to.equal('error');
        expect(request.message.msg).to.equal('Wrong credentials');
      });

      it('should redirect', () => {
        expect(response.statusCode).to.equal(302);
        expect(response.getHeader('Location')).to.equal('https://www.example.com/login');
      });
    });

    describe('fail with flash message overridden by route using options', () => {
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
          failureFlash: { message: 'Try again' },
          failureRedirect: 'https://www.example.com/login'
        }))
          .req((req) => {
            request = req;
            req.session = {};

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

      it('should not set user', () => {
        expect(request.user).to.be.undefined;
      });

      it('should flash message', () => {
        expect(request.message.type).to.equal('error');
        expect(request.message.msg).to.equal('Try again');
      });

      it('should redirect', () => {
        expect(response.statusCode).to.equal(302);
        expect(response.getHeader('Location')).to.equal('https://www.example.com/login');
      });
    });

    describe('fail with flash message overridden by route using options with type', () => {
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
          failureFlash: { type: 'notice', message: 'Try again' },
          failureRedirect: 'https://www.example.com/login'
        }))
          .req((req) => {
            request = req;
            req.session = {};

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

      it('should not set user', () => {
        expect(request.user).to.be.undefined;
      });

      it('should flash message', () => {
        expect(request.message.type).to.equal('notice');
        expect(request.message.msg).to.equal('Try again');
      });

      it('should redirect', () => {
        expect(response.statusCode).to.equal(302);
        expect(response.getHeader('Location')).to.equal('https://www.example.com/login');
      });
    });
  });


  describe('using strategy that specifies message and type', () => {
    describe('fail with flash message', () => {
      class Strategy extends EnhancedStrategy {
        authenticate() {
          this.fail({ type: 'notice', message: 'Invite required' });
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
          failureFlash: true,
          failureRedirect: 'https://www.example.com/login'
        }))
          .req((req) => {
            request = req;
            req.session = {};

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

      it('should not set user', () => {
        expect(request.user).to.be.undefined;
      });

      it('should flash message', () => {
        expect(request.message.type).to.equal('notice');
        expect(request.message.msg).to.equal('Invite required');
      });

      it('should redirect', () => {
        expect(response.statusCode).to.equal(302);
        expect(response.getHeader('Location')).to.equal('https://www.example.com/login');
      });
    });

    describe('fail with flash message using type set by route', () => {
      class Strategy extends EnhancedStrategy {
        authenticate() {
          this.fail({ type: 'notice', message: 'Invite required' });
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
          failureFlash: { type: 'info' },
          failureRedirect: 'https://www.example.com/login'
        }))
          .req((req) => {
            request = req;
            req.session = {};

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

      it('should not set user', () => {
        expect(request.user).to.be.undefined;
      });

      it('should flash message', () => {
        expect(request.message.type).to.equal('info');
        expect(request.message.msg).to.equal('Invite required');
      });

      it('should redirect', () => {
        expect(response.statusCode).to.equal(302);
        expect(response.getHeader('Location')).to.equal('https://www.example.com/login');
      });
    });

    describe('fail with flash message overridden by route as string', () => {
      class Strategy extends EnhancedStrategy {
        authenticate() {
          this.fail({ type: 'notice', message: 'Invite required' });
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
          failureFlash: 'Wrong credentials',
          failureRedirect: 'https://www.example.com/login'
        }))
          .req((req) => {
            request = req;
            req.session = {};

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

      it('should not set user', () => {
        expect(request.user).to.be.undefined;
      });

      it('should flash message', () => {
        expect(request.message.type).to.equal('error');
        expect(request.message.msg).to.equal('Wrong credentials');
      });

      it('should redirect', () => {
        expect(response.statusCode).to.equal(302);
        expect(response.getHeader('Location')).to.equal('https://www.example.com/login');
      });
    });

    describe('fail with flash message overridden by route using options', () => {
      class Strategy extends EnhancedStrategy {
        authenticate() {
          this.fail({ type: 'notice', message: 'Invite required' });
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
          failureFlash: { message: 'Try again' },
          failureRedirect: 'https://www.example.com/login'
        }))
          .req((req) => {
            request = req;
            req.session = {};

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

      it('should not set user', () => {
        expect(request.user).to.be.undefined;
      });

      it('should flash message', () => {
        expect(request.message.type).to.equal('error');
        expect(request.message.msg).to.equal('Try again');
      });

      it('should redirect', () => {
        expect(response.statusCode).to.equal(302);
        expect(response.getHeader('Location')).to.equal('https://www.example.com/login');
      });
    });

    describe('fail with flash message overridden by route using options with type', () => {
      class Strategy extends EnhancedStrategy {
        authenticate() {
          this.fail({ type: 'notice', message: 'Invite required' });
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
          failureFlash: { type: 'info', message: 'Try again' },
          failureRedirect: 'https://www.example.com/login'
        }))
          .req((req) => {
            request = req;
            req.session = {};

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

      it('should not set user', () => {
        expect(request.user).to.be.undefined;
      });

      it('should flash message', () => {
        expect(request.message.type).to.equal('info');
        expect(request.message.msg).to.equal('Try again');
      });

      it('should redirect', () => {
        expect(response.statusCode).to.equal(302);
        expect(response.getHeader('Location')).to.equal('https://www.example.com/login');
      });
    });
  });


  describe('using strategy that specifies message as string', () => {
    describe('fail with flash message', () => {
      class Strategy extends EnhancedStrategy {
        authenticate() {
          this.fail('Access denied');
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
          failureFlash: true,
          failureRedirect: 'https://www.example.com/login'
        }))
          .req((req) => {
            request = req;
            req.session = {};

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

      it('should not set user', () => {
        expect(request.user).to.be.undefined;
      });

      it('should flash message', () => {
        expect(request.message.type).to.equal('error');
        expect(request.message.msg).to.equal('Access denied');
      });

      it('should redirect', () => {
        expect(response.statusCode).to.equal(302);
        expect(response.getHeader('Location')).to.equal('https://www.example.com/login');
      });
    });

    describe('fail with flash message using type set by route', () => {
      class Strategy extends EnhancedStrategy {
        authenticate() {
          this.fail('Access denied');
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
          failureFlash: { type: 'info' },
          failureRedirect: 'https://www.example.com/login'
        }))
          .req((req) => {
            request = req;
            req.session = {};

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

      it('should not set user', () => {
        expect(request.user).to.be.undefined;
      });

      it('should flash message', () => {
        expect(request.message.type).to.equal('info');
        expect(request.message.msg).to.equal('Access denied');
      });

      it('should redirect', () => {
        expect(response.statusCode).to.equal(302);
        expect(response.getHeader('Location')).to.equal('https://www.example.com/login');
      });
    });

    describe('fail with flash message overridden by route as string', () => {
      class Strategy extends EnhancedStrategy {
        authenticate() {
          this.fail('Access denied');
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
          failureFlash: 'Wrong credentials',
          failureRedirect: 'https://www.example.com/login'
        }))
          .req((req) => {
            request = req;
            req.session = {};

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

      it('should not set user', () => {
        expect(request.user).to.be.undefined;
      });

      it('should flash message', () => {
        expect(request.message.type).to.equal('error');
        expect(request.message.msg).to.equal('Wrong credentials');
      });

      it('should redirect', () => {
        expect(response.statusCode).to.equal(302);
        expect(response.getHeader('Location')).to.equal('https://www.example.com/login');
      });
    });

    describe('fail with flash message overridden by route using options', () => {
      class Strategy extends EnhancedStrategy {
        authenticate() {
          this.fail('Access denied');
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
          failureFlash: { message: 'Try again' },
          failureRedirect: 'https://www.example.com/login'
        }))
          .req((req) => {
            request = req;
            req.session = {};

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

      it('should not set user', () => {
        expect(request.user).to.be.undefined;
      });

      it('should flash message', () => {
        expect(request.message.type).to.equal('error');
        expect(request.message.msg).to.equal('Try again');
      });

      it('should redirect', () => {
        expect(response.statusCode).to.equal(302);
        expect(response.getHeader('Location')).to.equal('https://www.example.com/login');
      });
    });

    describe('fail with flash message overridden by route using options with type', () => {
      class Strategy extends EnhancedStrategy {
        authenticate() {
          this.fail('Access denied');
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
          failureFlash: { type: 'notice', message: 'Try again' },
          failureRedirect: 'https://www.example.com/login'
        }))
          .req((req) => {
            request = req;
            req.session = {};

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

      it('should not set user', () => {
        expect(request.user).to.be.undefined;
      });

      it('should flash message', () => {
        expect(request.message.type).to.equal('notice');
        expect(request.message.msg).to.equal('Try again');
      });

      it('should redirect', () => {
        expect(response.statusCode).to.equal(302);
        expect(response.getHeader('Location')).to.equal('https://www.example.com/login');
      });
    });
  });


  describe('using strategy that does not specify message', () => {
    describe('fail with flash message left up to strategy', () => {
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
        chai.connect.use('express', authenticate(passport, 'fail', {
          failureFlash: true,
          failureRedirect: 'https://www.example.com/login'
        }))
          .req((req) => {
            request = req;
            req.session = {};

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

      it('should not set user', () => {
        expect(request.user).to.be.undefined;
      });

      it('should not flash message', () => {
        expect(request.message).to.be.undefined;
      });

      it('should redirect', () => {
        expect(response.statusCode).to.equal(302);
        expect(response.getHeader('Location')).to.equal('https://www.example.com/login');
      });
    });

    describe('fail with flash message left up to strategy using type set by route', () => {
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
        chai.connect.use('express', authenticate(passport, 'fail', {
          failureFlash: { type: 'info' },
          failureRedirect: 'https://www.example.com/login'
        }))
          .req((req) => {
            request = req;
            req.session = {};

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

      it('should not set user', () => {
        expect(request.user).to.be.undefined;
      });

      it('should not flash message', () => {
        expect(request.message).to.be.undefined;
      });

      it('should redirect', () => {
        expect(response.statusCode).to.equal(302);
        expect(response.getHeader('Location')).to.equal('https://www.example.com/login');
      });
    });

    describe('fail with flash message specified by route as string', () => {
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
        chai.connect.use('express', authenticate(passport, 'fail', {
          failureFlash: 'Wrong credentials',
          failureRedirect: 'https://www.example.com/login'
        }))
          .req((req) => {
            request = req;
            req.session = {};

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

      it('should not set user', () => {
        expect(request.user).to.be.undefined;
      });

      it('should flash message', () => {
        expect(request.message.type).to.equal('error');
        expect(request.message.msg).to.equal('Wrong credentials');
      });

      it('should redirect', () => {
        expect(response.statusCode).to.equal(302);
        expect(response.getHeader('Location')).to.equal('https://www.example.com/login');
      });
    });

    describe('fail with flash message specified by route using options', () => {
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
        chai.connect.use('express', authenticate(passport, 'fail', {
          failureFlash: { message: 'Try again' },
          failureRedirect: 'https://www.example.com/login'
        }))
          .req((req) => {
            request = req;
            req.session = {};

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

      it('should not set user', () => {
        expect(request.user).to.be.undefined;
      });

      it('should flash message', () => {
        expect(request.message.type).to.equal('error');
        expect(request.message.msg).to.equal('Try again');
      });

      it('should redirect', () => {
        expect(response.statusCode).to.equal(302);
        expect(response.getHeader('Location')).to.equal('https://www.example.com/login');
      });
    });

    describe('fail with flash message specified by route using options with type', () => {
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
        chai.connect.use('express', authenticate(passport, 'fail', {
          failureFlash: { type: 'notice', message: 'Try again' },
          failureRedirect: 'https://www.example.com/login'
        }))
          .req((req) => {
            request = req;
            req.session = {};

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

      it('should not set user', () => {
        expect(request.user).to.be.undefined;
      });

      it('should flash message', () => {
        expect(request.message.type).to.equal('notice');
        expect(request.message.msg).to.equal('Try again');
      });

      it('should redirect', () => {
        expect(response.statusCode).to.equal(302);
        expect(response.getHeader('Location')).to.equal('https://www.example.com/login');
      });
    });
  });
});
