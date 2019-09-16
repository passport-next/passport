'use strict';

const chai = require('chai');
const authenticate = require('../../lib/middleware/authenticate');
const { Passport } = require('../..');


describe('middleware/authenticate', () => {
  describe('success with info', () => {
    class Strategy {
      authenticate() {
        const user = { id: '1', username: 'jaredhanson' };
        this.success(user, { clientId: '123', scope: 'read' });
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
      expect(Object.keys(request.authInfo)).to.have.length(2);
      expect(request.authInfo.clientId).to.equal('123');
      expect(request.authInfo.scope).to.equal('read');
    });
  });

  describe('success with info that is transformed', () => {
    class Strategy {
      authenticate() {
        const user = { id: '1', username: 'jaredhanson' };
        this.success(user, { clientId: '123', scope: 'read' });
      }
    }

    const passport = new Passport();
    passport.use('success', new Strategy());
    passport.transformAuthInfo((req, info) => {
      return { clientId: info.clientId, client: { name: 'Foo' }, scope: info.scope };
    });

    let request;
    let error;

    before((done) => {
      chai.connect.use(authenticate(passport, 'success'))
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
      expect(Object.keys(request.authInfo)).to.have.length(3);
      expect(request.authInfo.clientId).to.equal('123');
      expect(request.authInfo.client.name).to.equal('Foo');
      expect(request.authInfo.scope).to.equal('read');
    });
  });

  describe('success with info, but transform that encounters an error', () => {
    class Strategy {
      authenticate() {
        const user = { id: '1', username: 'jaredhanson' };
        this.success(user, { clientId: '123', scope: 'read' });
      }
    }

    const passport = new Passport();
    passport.use('success', new Strategy());
    passport.transformAuthInfo((/* req, info */) => {
      throw new Error('something went wrong');
    });

    let request;
    let error;

    before((done) => {
      chai.connect.use(authenticate(passport, 'success'))
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

    it('should error', () => {
      expect(error).to.be.an.instanceOf(Error);
      expect(error.message).to.equal('something went wrong');
    });

    it('should set user', () => {
      expect(request.user).to.be.an('object');
      expect(request.user.id).to.equal('1');
      expect(request.user.username).to.equal('jaredhanson');
    });

    it('should not set authInfo', () => {
      expect(request.authInfo).to.be.undefined;
    });
  });

  describe('success with info, but option that disables info', () => {
    class Strategy {
      authenticate() {
        const user = { id: '1', username: 'jaredhanson' };
        this.success(user, { clientId: '123', scope: 'read' });
      }
    }

    const passport = new Passport();
    passport.use('success', new Strategy());

    let request;
    let error;

    before((done) => {
      chai.connect.use(authenticate(passport, 'success', { authInfo: false }))
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

    it('should not set authInfo', () => {
      expect(request.authInfo).to.be.undefined;
    });
  });
});
