/* eslint-disable no-shadow */
'use strict';

const chai = require('chai');
const SessionStrategy = require('../../lib/strategies/session');

describe('SessionStrategy', () => {
  const strategy = new SessionStrategy();

  it('should be named session', () => {
    expect(strategy.name).to.equal('session');
  });

  describe('handling a request without a login session', () => {
    let request;
    let pass = false;

    before((done) => {
      chai.passport.use(strategy)
        .pass(() => {
          pass = true;
          done();
        })
        .req((req) => {
          request = req;

          req._passport = {};
          req._passport.session = {};
        })
        .authenticate();
    });

    it('should pass', () => {
      // eslint-disable-next-line no-unused-expressions
      expect(pass).to.be.true;
    });

    it('should not set user on request', () => {
      // eslint-disable-next-line no-unused-expressions
      expect(request.user).to.be.undefined;
    });
  });

  describe('handling a request with a login session', () => {
    const strategy = new SessionStrategy((user) => {
      return { id: user };
    });

    let request;
    let pass = false;

    before((done) => {
      chai.passport.use(strategy)
        .pass(() => {
          pass = true;
          done();
        })
        .req((req) => {
          request = req;

          req._passport = {};
          req._passport.instance = {};
          req._passport.session = {};
          req._passport.session.user = '123456';
        })
        .authenticate();
    });

    it('should pass', () => {
      // eslint-disable-next-line no-unused-expressions
      expect(pass).to.be.true;
    });

    it('should set user on request', () => {
      expect(request.user).to.be.an('object');
      expect(request.user.id).to.equal('123456');
    });

    it('should maintain session', () => {
      expect(request._passport.session).to.be.an('object');
      expect(request._passport.session.user).to.equal('123456');
    });
  });

  describe('handling a request with a login session serialized to 0', () => {
    const strategy = new SessionStrategy((user) => {
      return { id: user };
    });

    let request;
    let pass = false;

    before((done) => {
      chai.passport.use(strategy)
        .pass(() => {
          pass = true;
          done();
        })
        .req((req) => {
          request = req;

          req._passport = {};
          req._passport.instance = {};
          req._passport.session = {};
          req._passport.session.user = 0;
        })
        .authenticate();
    });

    it('should pass', () => {
      // eslint-disable-next-line no-unused-expressions
      expect(pass).to.be.true;
    });

    it('should set user on request', () => {
      expect(request.user).to.be.an('object');
      expect(request.user.id).to.equal(0);
    });

    it('should maintain session', () => {
      expect(request._passport.session).to.be.an('object');
      expect(request._passport.session.user).to.equal(0);
    });
  });

  describe('handling a request with a login session that has been invalidated', () => {
    const strategy = new SessionStrategy((/* user, req */) => {
      return false;
    });

    let request;
    let pass = false;

    before((done) => {
      chai.passport.use(strategy)
        .pass(() => {
          pass = true;
          done();
        })
        .req((req) => {
          request = req;

          req._passport = {};
          req._passport.instance = {};
          req._passport.session = {};
          req._passport.session.user = '123456';
        })
        .authenticate();
    });

    it('should pass', () => {
      // eslint-disable-next-line no-unused-expressions
      expect(pass).to.be.true;
    });

    it('should not set user on request', () => {
      // eslint-disable-next-line no-unused-expressions
      expect(request.user).to.be.undefined;
    });

    it('should remove user from session', () => {
      expect(request._passport.session).to.be.an('object');
      // eslint-disable-next-line no-unused-expressions
      expect(request._passport.session.user).to.be.undefined;
    });
  });

  describe('handling a request with a login session and setting custom user property', () => {
    const strategy = new SessionStrategy((user) => {
      return { id: user };
    });

    let request;
    let pass = false;

    before((done) => {
      chai.passport.use(strategy)
        .pass(() => {
          pass = true;
          done();
        })
        .req((req) => {
          request = req;

          req._passport = {};
          req._passport.instance = {};
          req._passport.instance._userProperty = 'currentUser';
          req._passport.session = {};
          req._passport.session.user = '123456';
        })
        .authenticate();
    });

    it('should pass', () => {
      // eslint-disable-next-line no-unused-expressions
      expect(pass).to.be.true;
    });

    it('should not set "user" on request', () => {
      // eslint-disable-next-line no-unused-expressions
      expect(request.user).to.be.undefined;
    });

    it('should set "currentUser" on request', () => {
      expect(request.currentUser).to.be.an('object');
      expect(request.currentUser.id).to.equal('123456');
    });
  });

  describe('handling a request with a login session that encounters an error when deserializing', () => {
    const strategy = new SessionStrategy(() => {
      throw new Error('something went wrong');
    });

    let request;
    let error;

    before((done) => {
      chai.passport.use(strategy)
        .error((err) => {
          error = err;
          done();
        })
        .req((req) => {
          request = req;

          req._passport = {};
          req._passport.instance = {};
          req._passport.session = {};
          req._passport.session.user = '123456';
        })
        .authenticate();
    });

    it('should error', () => {
      expect(error).to.be.an.instanceOf(Error);
      expect(error.message).to.equal('something went wrong');
    });

    it('should not set user on request', () => {
      // eslint-disable-next-line no-unused-expressions
      expect(request.user).to.be.undefined;
    });

    it('should maintain session', () => {
      expect(request._passport.session).to.be.an('object');
      expect(request._passport.session.user).to.equal('123456');
    });
  });

  describe('handling a request that lacks an authenticator', () => {
    let request;
    let error;

    before((done) => {
      chai.passport.use(strategy)
        .error((err) => {
          error = err;
          done();
        })
        .req((req) => {
          request = req;
        })
        .authenticate();
    });

    it('should error', () => {
      expect(error).to.be.an.instanceOf(Error);
      expect(error.message).to.equal('passport.initialize() middleware not in use');
    });

    it('should not set user on request', () => {
      // eslint-disable-next-line no-unused-expressions
      expect(request.user).to.be.undefined;
    });
  });
});
