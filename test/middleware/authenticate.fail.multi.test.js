'use strict';

const chai = require('chai');
const authenticate = require('../../lib/middleware/authenticate.js');
const { Passport } = require('../../lib/index.js');


describe('middleware/authenticate', () => {
  describe('with multiple strategies, all of which fail, and responding with unauthorized status', () => {
    class BasicStrategy {
      authenticate() {
        this.fail('BASIC challenge');
      }
    }

    class DigestStrategy {
      authenticate() {
        this.fail('DIGEST challenge');
      }
    }

    class NoChallengeStrategy {
      authenticate() {
        this.fail();
      }
    }

    const passport = new Passport();
    passport.use('basic', new BasicStrategy());
    passport.use('digest', new DigestStrategy());
    passport.use('no-challenge', new NoChallengeStrategy());

    let request;
    let response;

    before((done) => {
      chai.connect.use(authenticate(passport, ['basic', 'no-challenge', 'digest']))
        .req((req) => {
          request = req;

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

    it('should respond', () => {
      expect(response.statusCode).to.equal(401);
      expect(response.body).to.equal('Unauthorized');
    });

    it('should set authenticate header on response', () => {
      const val = response.getHeader('WWW-Authenticate');
      expect(val).to.be.an('array');
      expect(val).to.have.length(2);

      expect(val[0]).to.equal('BASIC challenge');
      expect(val[1]).to.equal('DIGEST challenge');
    });
  });

  describe('with multiple strategies, all of which fail, and responding with specified status', () => {
    class BasicStrategy {
      authenticate() {
        this.fail('BASIC challenge', 400);
      }
    }

    class BearerStrategy {
      authenticate() {
        this.fail('BEARER challenge', 403);
      }
    }

    class NoChallengeStrategy {
      authenticate() {
        this.fail(402);
      }
    }

    const passport = new Passport();
    passport.use('basic', new BasicStrategy());
    passport.use('bearer', new BearerStrategy());
    passport.use('no-challenge', new NoChallengeStrategy());

    let request;
    let response;

    before((done) => {
      chai.connect.use(authenticate(passport, ['basic', 'no-challenge', 'bearer']))
        .req((req) => {
          request = req;

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

    it('should respond', () => {
      expect(response.statusCode).to.equal(400);
      expect(response.getHeader('WWW-Authenticate')).to.be.undefined;
      expect(response.body).to.equal('Bad Request');
    });
  });

  describe('with multiple strategies, all of which fail, and flashing message', () => {
    class StrategyA {
      authenticate() {
        this.fail('A message');
      }
    }

    class StrategyB {
      authenticate() {
        this.fail('B message');
      }
    }

    const passport = new Passport();
    passport.use('a', new StrategyA());
    passport.use('b', new StrategyB());

    let request;
    let response;

    before((done) => {
      chai.connect.use('express', authenticate(passport, ['a', 'b'], {
        failureFlash: true,
        failureRedirect: 'http://www.example.com/login'
      }))
        .req((req) => {
          request = req;

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
      expect(request.message.msg).to.equal('A message');
    });

    it('should redirect', () => {
      expect(response.statusCode).to.equal(302);
      expect(response.getHeader('Location')).to.equal('http://www.example.com/login');
    });
  });

  describe('with multiple strategies, all of which fail with unauthorized status, and invoking callback', () => {
    class BasicStrategy {
      authenticate() {
        this.fail('BASIC challenge');
      }
    }

    class DigestStrategy {
      authenticate() {
        this.fail('DIGEST challenge');
      }
    }

    class NoChallengeStrategy {
      authenticate() {
        this.fail();
      }
    }

    const passport = new Passport();
    passport.use('basic', new BasicStrategy());
    passport.use('digest', new DigestStrategy());
    passport.use('no-challenge', new NoChallengeStrategy());

    let request;
    let error;
    let user;
    let challenge;
    let status;

    before((done) => {
      function callback(e, u, c, s) {
        error = e;
        user = u;
        challenge = c;
        status = s;
        done();
      }

      chai.connect.use(authenticate(passport, ['basic', 'no-challenge', 'digest'], callback))
        .req((req) => {
          request = req;
        })
        .dispatch();
    });

    it('should not error', () => {
      expect(error).to.be.null;
    });

    it('should pass false to callback', () => {
      expect(user).to.equal(false);
    });

    it('should pass challenges to callback', () => {
      expect(challenge).to.be.an('array');
      expect(challenge).to.have.length(3);
      expect(challenge[0]).to.equal('BASIC challenge');
      expect(challenge[1]).to.be.undefined;
      expect(challenge[2]).to.equal('DIGEST challenge');
    });

    it('should pass statuses to callback', () => {
      expect(status).to.be.an('array');
      expect(status).to.have.length(3);
      expect(status[0]).to.be.undefined;
      expect(status[1]).to.be.undefined;
      expect(status[2]).to.be.undefined;
    });

    it('should not set user on request', () => {
      expect(request.user).to.be.undefined;
    });
  });

  describe('with multiple strategies, all of which fail with specific status, and invoking callback', () => {
    class BasicStrategy {
      authenticate() {
        this.fail('BASIC challenge', 400);
      }
    }

    class BearerStrategy {
      authenticate() {
        this.fail('BEARER challenge', 403);
      }
    }

    class NoChallengeStrategy {
      authenticate() {
        this.fail(402);
      }
    }

    const passport = new Passport();
    passport.use('basic', new BasicStrategy());
    passport.use('bearer', new BearerStrategy());
    passport.use('no-challenge', new NoChallengeStrategy());

    let request;
    let error;
    let user;
    let challenge;
    let status;

    before((done) => {
      function callback(e, u, c, s) {
        error = e;
        user = u;
        challenge = c;
        status = s;
        done();
      }

      chai.connect.use(authenticate(passport, ['basic', 'no-challenge', 'bearer'], callback))
        .req((req) => {
          request = req;
        })
        .dispatch();
    });

    it('should not error', () => {
      expect(error).to.be.null;
    });

    it('should pass false to callback', () => {
      expect(user).to.equal(false);
    });

    it('should pass challenges to callback', () => {
      expect(challenge).to.be.an('array');
      expect(challenge).to.have.length(3);
      expect(challenge[0]).to.equal('BASIC challenge');
      expect(challenge[1]).to.be.undefined;
      expect(challenge[2]).to.equal('BEARER challenge');
    });

    it('should pass statuses to callback', () => {
      expect(status).to.be.an('array');
      expect(status).to.have.length(3);
      expect(status[0]).to.equal(400);
      expect(status[1]).to.equal(402);
      expect(status[2]).to.equal(403);
    });

    it('should not set user on request', () => {
      expect(request.user).to.be.undefined;
    });
  });

  describe('with single strategy in list, which fails with unauthorized status, and invoking callback', () => {
    class BasicStrategy {
      authenticate() {
        this.fail('BASIC challenge');
      }
    }

    const passport = new Passport();
    passport.use('basic', new BasicStrategy());

    let request;
    let error;
    let user;
    let challenge;
    let status;

    before((done) => {
      function callback(e, u, c, s) {
        error = e;
        user = u;
        challenge = c;
        status = s;
        done();
      }

      chai.connect.use(authenticate(passport, ['basic'], callback))
        .req((req) => {
          request = req;
        })
        .dispatch();
    });

    it('should not error', () => {
      expect(error).to.be.null;
    });

    it('should pass false to callback', () => {
      expect(user).to.equal(false);
    });

    it('should pass challenges to callback', () => {
      expect(challenge).to.be.an('array');
      expect(challenge).to.have.length(1);
      expect(challenge[0]).to.equal('BASIC challenge');
    });

    it('should pass statuses to callback', () => {
      expect(status).to.be.an('array');
      expect(status).to.have.length(1);

      expect(status[0]).to.be.undefined;
    });

    it('should not set user on request', () => {
      expect(request.user).to.be.undefined;
    });
  });

  describe('without a valid strategy name, which fails with unauthorized status, and invoking callback', () => {
    class BasicStrategy {
      authenticate() {
        this.fail('BASIC challenge');
      }
    }

    const passport = new Passport();
    passport.use('basic', new BasicStrategy());

    let request;
    let error;
    let user;
    let challenge;
    let status;

    before((done) => {
      function callback(e, u, c, s) {
        error = e;
        user = u;
        challenge = c;
        status = s;
        done();
      }

      chai.connect.use(authenticate(
        passport,
        // Bad strategy name
        null,
        callback
      ))
        .req((req) => {
          request = req;
        })
        .dispatch();
    });

    it('should not error', () => {
      expect(error).to.be.null;
    });

    it('should pass false to callback', () => {
      expect(user).to.equal(false);
    });

    it('should not pass challenges to callback', () => {
      expect(challenge).to.be.an('array');
      expect(challenge).to.have.length(0);
    });

    it('should not pass statuses to callback', () => {
      expect(status).to.be.an('array');
      expect(status).to.have.length(0);
    });

    it('should not set user on request', () => {
      expect(request.user).to.be.undefined;
    });
  });
});
