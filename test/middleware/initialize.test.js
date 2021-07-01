'use strict';

const chai = require('chai');
const { Passport } = require('../../lib/index.js');
const initialize = require('../../lib/middleware/initialize.js');

describe('middleware/initialize', () => {
  it('should be named initialize', () => {
    expect(initialize().name).to.equal('initialize');
  });

  describe('handling a request without a session', () => {
    const passport = new Passport();
    let request;
    let error;

    before((done) => {
      chai.connect.use(initialize(passport))
        .req((req) => {
          request = req;
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

    it('should expose authenticator on internal request property', () => {
      expect(request._passport).to.be.an('object');
      expect(request._passport.instance).to.be.an.instanceOf(Passport);
      expect(request._passport.instance).to.equal(passport);
    });

    it('should not expose empty object as session storage on internal request property', () => {
      expect(request._passport.session).to.be.undefined;
    });
  });

  describe('handling a request with a new session', () => {
    const passport = new Passport();
    let request;
    let error;

    before((done) => {
      chai.connect.use(initialize(passport))
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

    it('should not initialize namespace within session', () => {
      expect(request.session.passport).to.be.undefined;
    });

    it('should expose authenticator on internal request property', () => {
      expect(request._passport).to.be.an('object');
      expect(request._passport.instance).to.be.an.instanceOf(Passport);
      expect(request._passport.instance).to.equal(passport);
    });

    it('should not expose session storage on internal request property', () => {
      expect(request._passport.session).to.be.undefined;
    });
  });

  describe('handling a request with an existing session', () => {
    const passport = new Passport();
    let request;
    let error;

    before((done) => {
      chai.connect.use(initialize(passport))
        .req((req) => {
          request = req;

          req.session = {};
          req.session.passport = {};
          req.session.passport.user = '123456';
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

    it('should maintain data within session', () => {
      expect(request.session.passport).to.be.an('object');
      expect(Object.keys(request.session.passport)).to.have.length(1);
      expect(request.session.passport.user).to.equal('123456');
    });

    it('should expose authenticator on internal request property', () => {
      expect(request._passport).to.be.an('object');
      expect(request._passport.instance).to.be.an.instanceOf(Passport);
      expect(request._passport.instance).to.equal(passport);
    });

    it('should expose session storage on internal request property', () => {
      expect(request._passport.session).to.be.an('object');
      expect(Object.keys(request._passport.session)).to.have.length(1);
      expect(request._passport.session.user).to.equal('123456');
    });
  });

  describe('handling a request with an existing session using custom session key', () => {
    const passport = new Passport();
    passport._key = 'authentication';
    let request;
    let error;

    before((done) => {
      chai.connect.use(initialize(passport))
        .req((req) => {
          request = req;

          req.session = {};
          req.session.authentication = {};
          req.session.authentication.user = '123456';
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

    it('should maintain data within session', () => {
      expect(request.session.authentication).to.be.an('object');
      expect(Object.keys(request.session.authentication)).to.have.length(1);
      expect(request.session.authentication.user).to.equal('123456');
    });

    it('should expose authenticator on internal request property', () => {
      expect(request._passport).to.be.an('object');
      expect(request._passport.instance).to.be.an.instanceOf(Passport);
      expect(request._passport.instance).to.equal(passport);
    });

    it('should expose session storage on internal request property', () => {
      expect(request._passport.session).to.be.an('object');
      expect(Object.keys(request._passport.session)).to.have.length(1);
      expect(request._passport.session.user).to.equal('123456');
    });
  });
});
