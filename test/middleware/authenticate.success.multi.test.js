/* global describe, it, expect, before */
/* jshint expr: true */

/* eslint-disable camelcase, no-proto, no-shadow */

const chai = require('chai');
const authenticate = require('../../lib/middleware/authenticate');
const Passport = require('../..').Passport;


describe('middleware/authenticate', () => {
  describe('with multiple strategies, the first of which succeeds', () => {
    function StrategyA() {
    }
    StrategyA.prototype.authenticate = function authenticate() {
      this.success({ username: 'bob-a' });
    };

    function StrategyB() {
    }
    StrategyB.prototype.authenticate = function authenticate() {
      this.success({ username: 'bob-b' });
    };

    const passport = new Passport();
    passport.use('a', new StrategyA());
    passport.use('b', new StrategyB());

    let request;
    let error;

    before((done) => {
      chai.connect.use(authenticate(passport, ['a', 'b']))
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
      expect(request.user.username).to.equal('bob-a');
    });
  });

  describe('with multiple strategies, the second of which succeeds', () => {
    function StrategyA() {
    }
    StrategyA.prototype.authenticate = function authenticate() {
      this.fail('A challenge');
    };

    function StrategyB() {
    }
    StrategyB.prototype.authenticate = function authenticate() {
      this.success({ username: 'bob-b' });
    };

    const passport = new Passport();
    passport.use('a', new StrategyA());
    passport.use('b', new StrategyB());

    let request;
    let error;

    before((done) => {
      chai.connect.use(authenticate(passport, ['a', 'b']))
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
      expect(request.user.username).to.equal('bob-b');
    });
  });
});
