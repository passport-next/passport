/* global describe, it, expect, before */
/* jshint expr: true */

/* eslint-disable camelcase, no-proto, no-shadow */

const chai = require('chai');
const authenticate = require('../../lib/middleware/authenticate');
const Passport = require('../..').Passport;


describe('middleware/authenticate', () => {
  describe('fail with message set by route', () => {
    function Strategy() {
    }
    Strategy.prototype.authenticate = function authenticate() {
      this.fail({ message: 'Invalid password' });
    };

    const passport = new Passport();
    passport.use('fail', new Strategy());

    let request;
    let response;

    before((done) => {
      chai.connect.use('express', authenticate(passport, 'fail', {
        failureMessage: 'Wrong credentials',
        failureRedirect: 'http://www.example.com/login',
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
      // eslint-disable-next-line no-unused-expressions
      expect(request.user).to.be.undefined;
    });

    it('should add message to session', () => {
      expect(request.session.messages).to.have.length(1);
      expect(request.session.messages[0]).to.equal('Wrong credentials');
    });

    it('should redirect', () => {
      expect(response.statusCode).to.equal(302);
      expect(response.getHeader('Location')).to.equal('http://www.example.com/login');
    });
  });

  describe('fail with message set by route that is added to messages', () => {
    function Strategy() {
    }
    Strategy.prototype.authenticate = function authenticate() {
      this.fail({ message: 'Invalid password' });
    };

    const passport = new Passport();
    passport.use('fail', new Strategy());

    let request;
    let response;

    before((done) => {
      chai.connect.use('express', authenticate(passport, 'fail', {
        failureMessage: 'Wrong credentials',
        failureRedirect: 'http://www.example.com/login',
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
      // eslint-disable-next-line no-unused-expressions
      expect(request.user).to.be.undefined;
    });

    it('should add message to session', () => {
      expect(request.session.messages).to.have.length(2);
      expect(request.session.messages[0]).to.equal('I exist!');
      expect(request.session.messages[1]).to.equal('Wrong credentials');
    });

    it('should redirect', () => {
      expect(response.statusCode).to.equal(302);
      expect(response.getHeader('Location')).to.equal('http://www.example.com/login');
    });
  });

  describe('fail with message set by strategy', () => {
    function Strategy() {
    }
    Strategy.prototype.authenticate = function authenticate() {
      this.fail({ message: 'Invalid password' });
    };

    const passport = new Passport();
    passport.use('fail', new Strategy());

    let request;
    let response;

    before((done) => {
      chai.connect.use('express', authenticate(passport, 'fail', {
        failureMessage: true,
        failureRedirect: 'http://www.example.com/login',
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
      // eslint-disable-next-line no-unused-expressions
      expect(request.user).to.be.undefined;
    });

    it('should add message to session', () => {
      expect(request.session.messages).to.have.length(1);
      expect(request.session.messages[0]).to.equal('Invalid password');
    });

    it('should redirect', () => {
      expect(response.statusCode).to.equal(302);
      expect(response.getHeader('Location')).to.equal('http://www.example.com/login');
    });
  });

  describe('fail with message set by strategy with extra info', () => {
    function Strategy() {
    }
    Strategy.prototype.authenticate = function authenticate() {
      this.fail({ message: 'Invalid password', scope: 'read' });
    };

    const passport = new Passport();
    passport.use('fail', new Strategy());

    let request;
    let response;

    before((done) => {
      chai.connect.use('express', authenticate(passport, 'fail', {
        failureMessage: true,
        failureRedirect: 'http://www.example.com/login',
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
      // eslint-disable-next-line no-unused-expressions
      expect(request.user).to.be.undefined;
    });

    it('should add message to session', () => {
      expect(request.session.messages).to.have.length(1);
      expect(request.session.messages[0]).to.equal('Invalid password');
    });

    it('should redirect', () => {
      expect(response.statusCode).to.equal(302);
      expect(response.getHeader('Location')).to.equal('http://www.example.com/login');
    });
  });
});
