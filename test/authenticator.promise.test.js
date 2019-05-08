'use strict';

const Authenticator = require('../lib/authenticator');


describe('Authenticator (Promise return)', () => {
  describe('#sessionManager', () => {
    it('should set custom session manager', () => {
      const passport = new Authenticator();
      const sessionManager = {};
      passport.sessionManager(sessionManager);

      expect(passport._sm).to.equal(sessionManager);
    });
  });

  describe('#use', () => {
    describe('with instance name', () => {
      class Strategy {
        constructor() {
          this.name = 'default';
        }

        // eslint-disable-next-line class-methods-use-this
        authenticate() {}
      }

      const authenticator = new Authenticator();
      authenticator.use(new Strategy());

      it('should register strategy', () => {
        expect(authenticator._strategies.default).to.be.an('object');
      });
    });

    describe('with registered name', () => {
      class Strategy {
        // eslint-disable-next-line class-methods-use-this
        authenticate() {}
      }

      const authenticator = new Authenticator();
      authenticator.use('foo', new Strategy());

      it('should register strategy', () => {
        expect(authenticator._strategies.foo).to.be.an('object');
      });
    });

    describe('with registered name overriding instance name', () => {
      class Strategy {
        constructor() {
          this.name = 'default';
        }

        // eslint-disable-next-line class-methods-use-this
        authenticate() {}
      }

      const authenticator = new Authenticator();
      authenticator.use('bar', new Strategy());

      it('should register strategy', () => {
        expect(authenticator._strategies.bar).to.be.an('object');
        // eslint-disable-next-line no-unused-expressions
        expect(authenticator._strategies.default).to.be.undefined;
      });
    });

    it('should throw if lacking a name', () => {
      class Strategy {
        // eslint-disable-next-line class-methods-use-this
        authenticate() {}
      }

      expect(() => {
        const authenticator = new Authenticator();
        authenticator.use(new Strategy());
      }).to.throw(Error, 'Authentication strategies must have a name');
    });
  });


  describe('#unuse', () => {
    class Strategy {
      // eslint-disable-next-line class-methods-use-this
      authenticate() {}
    }

    const authenticator = new Authenticator();
    authenticator.use('one', new Strategy());
    authenticator.use('two', new Strategy());

    expect(authenticator._strategies.one).to.be.an('object');
    expect(authenticator._strategies.two).to.be.an('object');

    authenticator.unuse('one');

    it('should unregister strategy', () => {
      // eslint-disable-next-line no-unused-expressions
      expect(authenticator._strategies.one).to.be.undefined;
      expect(authenticator._strategies.two).to.be.an('object');
    });
  });


  describe('#serializeUser', () => {
    describe('without serializers', () => {
      const authenticator = new Authenticator();
      let error;
      let obj;

      before((done) => {
        authenticator.serializeUser({ id: '1', username: 'jared' }, (err, o) => {
          error = err;
          obj = o;
          done();
        });
      });

      it('should error', () => {
        expect(error).to.be.an.instanceOf(Error);
        expect(error.message).to.equal('Failed to serialize user into session');
      });

      it('should not serialize user', () => {
        // eslint-disable-next-line no-unused-expressions
        expect(obj).to.be.undefined;
      });
    });

    describe('with one serializer', () => {
      const authenticator = new Authenticator();
      authenticator.serializeUser((req, user) => {
        return Promise.resolve(user.id);
      });

      let error;
      let obj;

      before((done) => {
        authenticator.serializeUser({ id: '1', username: 'jared' }, (err, o) => {
          error = err;
          obj = o;
          done();
        });
      });

      it('should not error', () => {
        // eslint-disable-next-line no-unused-expressions
        expect(error).to.be.null;
      });

      it('should serialize user', () => {
        expect(obj).to.equal('1');
      });
    });

    describe('with one serializer that serializes to 0', () => {
      const authenticator = new Authenticator();
      authenticator.serializeUser((/* req, user */) => {
        return Promise.resolve(0);
      });

      let error;
      let obj;

      before((done) => {
        authenticator.serializeUser({ id: '1', username: 'jared' }, (err, o) => {
          error = err;
          obj = o;
          done();
        });
      });

      it('should not error', () => {
        // eslint-disable-next-line no-unused-expressions
        expect(error).to.be.null;
      });

      it('should serialize user', () => {
        expect(obj).to.equal(0);
      });
    });

    describe('with one serializer that serializes to false', () => {
      const authenticator = new Authenticator();
      authenticator.serializeUser((/* req, user */) => {
        return Promise.resolve(false);
      });

      let error;
      let obj;

      before((done) => {
        authenticator.serializeUser({ id: '1', username: 'jared' }, (err, o) => {
          error = err;
          obj = o;
          done();
        });
      });

      it('should error', () => {
        expect(error).to.be.an.instanceOf(Error);
        expect(error.message).to.equal('Failed to serialize user into session');
      });

      it('should not serialize user', () => {
        // eslint-disable-next-line no-unused-expressions
        expect(obj).to.be.undefined;
      });
    });

    describe('with one serializer that serializes to null', () => {
      const authenticator = new Authenticator();
      authenticator.serializeUser((/* req, user */) => {
        return Promise.resolve(null);
      });

      let error;
      let obj;

      before((done) => {
        authenticator.serializeUser({ id: '1', username: 'jared' }, (err, o) => {
          error = err;
          obj = o;
          done();
        });
      });

      it('should error', () => {
        expect(error).to.be.an.instanceOf(Error);
        expect(error.message).to.equal('Failed to serialize user into session');
      });

      it('should not serialize user', () => {
        // eslint-disable-next-line no-unused-expressions
        expect(obj).to.be.undefined;
      });
    });

    describe('with one serializer that encounters an error', () => {
      const authenticator = new Authenticator();
      authenticator.serializeUser((/* req, user */) => {
        return Promise.reject(new Error('something went wrong'));
      });

      let error;
      let obj;

      before((done) => {
        authenticator.serializeUser({ id: '1', username: 'jared' }, (err, o) => {
          error = err;
          obj = o;
          done();
        });
      });

      it('should error', () => {
        expect(error).to.be.an.instanceOf(Error);
        expect(error.message).to.equal('something went wrong');
      });

      it('should not serialize user', () => {
        // eslint-disable-next-line no-unused-expressions
        expect(obj).to.be.undefined;
      });
    });

    describe('with one serializer that throws an exception', () => {
      const authenticator = new Authenticator();
      authenticator.serializeUser(() => {
        return Promise.reject(new Error('something went horribly wrong'));
      });

      let error;
      let obj;

      before((done) => {
        authenticator.serializeUser({ id: '1', username: 'jared' }, (err, o) => {
          error = err;
          obj = o;
          done();
        });
      });

      it('should error', () => {
        expect(error).to.be.an.instanceOf(Error);
        expect(error.message).to.equal('something went horribly wrong');
      });

      it('should not serialize user', () => {
        // eslint-disable-next-line no-unused-expressions
        expect(obj).to.be.undefined;
      });
    });

    describe('with three serializers, the first of which passes and the second of which serializes', () => {
      const authenticator = new Authenticator();
      authenticator.serializeUser(() => {
        throw new Error('pass');
      });
      authenticator.serializeUser((/* req, user */) => {
        return Promise.resolve('two');
      });
      authenticator.serializeUser((/* req, user */) => {
        return Promise.resolve('three');
      });

      let error;
      let obj;

      before((done) => {
        authenticator.serializeUser({ id: '1', username: 'jared' }, (err, o) => {
          error = err;
          obj = o;
          done();
        });
      });

      it('should not error', () => {
        // eslint-disable-next-line no-unused-expressions
        expect(error).to.be.null;
      });

      it('should serialize user', () => {
        expect(obj).to.equal('two');
      });
    });

    describe('with three serializers, the first of which passes and the second of which does not serialize by no argument', () => {
      const authenticator = new Authenticator();
      authenticator.serializeUser((/* req, obj */) => {
        throw new Error('pass');
      });
      authenticator.serializeUser((req, user, done) => {
        done(null);
      });
      authenticator.serializeUser((/* req, user */) => {
        return Promise.resolve('three');
      });

      let error;
      let obj;

      before((done) => {
        authenticator.serializeUser({ id: '1', username: 'jared' }, (err, o) => {
          error = err;
          obj = o;
          done();
        });
      });

      it('should not error', () => {
        // eslint-disable-next-line no-unused-expressions
        expect(error).to.be.null;
      });

      it('should serialize user', () => {
        expect(obj).to.equal('three');
      });
    });

    describe('with three serializers, the first of which passes and the second of which does not serialize by undefined', () => {
      const authenticator = new Authenticator();
      authenticator.serializeUser((/* req, obj */) => {
        throw new Error('pass');
      });
      authenticator.serializeUser((req, user, done) => {
        done(null, undefined);
      });
      authenticator.serializeUser((/* req, user */) => {
        return Promise.resolve('three');
      });

      let error;
      let obj;

      before((done) => {
        authenticator.serializeUser({ id: '1', username: 'jared' }, (err, o) => {
          error = err;
          obj = o;
          done();
        });
      });

      it('should not error', () => {
        // eslint-disable-next-line no-unused-expressions
        expect(error).to.be.null;
      });

      it('should serialize user', () => {
        expect(obj).to.equal('three');
      });
    });

    describe('with one serializer that takes request as argument', () => {
      const authenticator = new Authenticator();
      authenticator.serializeUser((req, user) => {
        if (req.url !== '/foo') {
          return Promise.reject(new Error('incorrect req argument'));
        }
        return Promise.resolve(user.id);
      });

      let error;
      let obj;

      before((done) => {
        const req = { url: '/foo' };

        authenticator.serializeUser({ id: '1', username: 'jared' }, req, (err, o) => {
          error = err;
          obj = o;
          done();
        });
      });

      it('should not error', () => {
        // eslint-disable-next-line no-unused-expressions
        expect(error).to.be.null;
      });

      it('should serialize user', () => {
        expect(obj).to.equal('1');
      });
    });
  });


  describe('#deserializeUser', () => {
    describe('without deserializers', () => {
      const authenticator = new Authenticator();
      let error;
      let user;

      before((done) => {
        authenticator.deserializeUser({ id: '1', username: 'jared' }, (err, u) => {
          error = err;
          user = u;
          done();
        });
      });

      it('should error', () => {
        expect(error).to.be.an.instanceOf(Error);
        expect(error.message).to.equal('Failed to deserialize user out of session');
      });

      it('should not deserialize user', () => {
        // eslint-disable-next-line no-unused-expressions
        expect(user).to.be.undefined;
      });
    });

    describe('with one deserializer', () => {
      const authenticator = new Authenticator();
      authenticator.deserializeUser((req, obj) => {
        return Promise.resolve(obj.username);
      });

      let error;
      let user;

      before((done) => {
        authenticator.deserializeUser({ id: '1', username: 'jared' }, (err, u) => {
          error = err;
          user = u;
          done();
        });
      });

      it('should not error', () => {
        // eslint-disable-next-line no-unused-expressions
        expect(error).to.be.null;
      });

      it('should deserialize user', () => {
        expect(user).to.equal('jared');
      });
    });

    describe('with one deserializer that deserializes to false', () => {
      const authenticator = new Authenticator();
      authenticator.deserializeUser((/* req, obj */) => {
        return Promise.resolve(false);
      });

      let error;
      let user;

      before((done) => {
        authenticator.deserializeUser({ id: '1', username: 'jared' }, (err, u) => {
          error = err;
          user = u;
          done();
        });
      });

      it('should not error', () => {
        // eslint-disable-next-line no-unused-expressions
        expect(error).to.be.null;
      });

      it('should invalidate session', () => {
        // eslint-disable-next-line no-unused-expressions
        expect(user).to.be.false;
      });
    });

    describe('with one deserializer that deserializes to null', () => {
      const authenticator = new Authenticator();
      authenticator.deserializeUser((/* req, obj */) => {
        return Promise.resolve(null);
      });

      let error;
      let user;

      before((done) => {
        authenticator.deserializeUser({ id: '1', username: 'jared' }, (err, u) => {
          error = err;
          user = u;
          done();
        });
      });

      it('should not error', () => {
        // eslint-disable-next-line no-unused-expressions
        expect(error).to.be.null;
      });

      it('should invalidate session', () => {
        // eslint-disable-next-line no-unused-expressions
        expect(user).to.be.false;
      });
    });

    describe('with one deserializer that encounters an error', () => {
      const authenticator = new Authenticator();
      authenticator.deserializeUser((/* req, obj */) => {
        return Promise.reject(new Error('something went wrong'));
      });

      let error;
      let user;

      before((done) => {
        authenticator.deserializeUser({ id: '1', username: 'jared' }, (err, u) => {
          error = err;
          user = u;
          done();
        });
      });

      it('should error', () => {
        expect(error).to.be.an.instanceOf(Error);
        expect(error.message).to.equal('something went wrong');
      });

      it('should invalidate session', () => {
        // eslint-disable-next-line no-unused-expressions
        expect(user).to.be.undefined;
      });
    });

    describe('with one deserializer that throws an exception', () => {
      const authenticator = new Authenticator();
      authenticator.deserializeUser(() => {
        return Promise.reject(new Error('something went horribly wrong'));
      });

      let error;
      let user;

      before((done) => {
        authenticator.deserializeUser({ id: '1', username: 'jared' }, (err, u) => {
          error = err;
          user = u;
          done();
        });
      });

      it('should error', () => {
        expect(error).to.be.an.instanceOf(Error);
        expect(error.message).to.equal('something went horribly wrong');
      });

      it('should invalidate session', () => {
        // eslint-disable-next-line no-unused-expressions
        expect(user).to.be.undefined;
      });
    });

    describe('with three deserializers, the first of which passes and the second of which deserializes', () => {
      const authenticator = new Authenticator();
      authenticator.deserializeUser((/* req, obj */) => {
        throw new Error('pass');
      });
      authenticator.deserializeUser((/* req, obj */) => {
        return Promise.resolve('two');
      });
      authenticator.deserializeUser((/* req, obj */) => {
        return Promise.resolve('three');
      });

      let error;
      let user;

      before((done) => {
        authenticator.deserializeUser({ id: '1', username: 'jared' }, (err, u) => {
          error = err;
          user = u;
          done();
        });
      });

      it('should not error', () => {
        // eslint-disable-next-line no-unused-expressions
        expect(error).to.be.null;
      });

      it('should deserialize user', () => {
        expect(user).to.equal('two');
      });
    });

    describe('with three deserializers, the first of which passes and the second of which does not deserialize by no argument', () => {
      const authenticator = new Authenticator();
      authenticator.deserializeUser((/* req, obj */) => {
        throw new Error('pass');
      });
      authenticator.deserializeUser((req, obj, done) => {
        done(null);
      });
      authenticator.deserializeUser((/* req, obj */) => {
        return Promise.resolve('three');
      });

      let error;
      let user;

      before((done) => {
        authenticator.deserializeUser({ id: '1', username: 'jared' }, (err, u) => {
          error = err;
          user = u;
          done();
        });
      });

      it('should not error', () => {
        // eslint-disable-next-line no-unused-expressions
        expect(error).to.be.null;
      });

      it('should deserialize user', () => {
        expect(user).to.equal('three');
      });
    });

    describe('with three deserializers, the first of which passes and the second of which does not deserialize by undefined', () => {
      const authenticator = new Authenticator();
      authenticator.deserializeUser((/* req, obj */) => {
        throw new Error('pass');
      });
      authenticator.deserializeUser((req, obj, done) => {
        done(null, undefined);
      });
      authenticator.deserializeUser((/* req, obj */) => {
        return Promise.resolve('three');
      });

      let error;
      let user;

      before((done) => {
        authenticator.deserializeUser({ id: '1', username: 'jared' }, (err, u) => {
          error = err;
          user = u;
          done();
        });
      });

      it('should not error', () => {
        // eslint-disable-next-line no-unused-expressions
        expect(error).to.be.null;
      });

      it('should deserialize user', () => {
        expect(user).to.equal('three');
      });
    });

    describe('with three deserializers, the first of which passes and the second of which invalidates session by false', () => {
      const authenticator = new Authenticator();
      authenticator.deserializeUser((/* req, obj */) => {
        throw new Error('pass');
      });
      authenticator.deserializeUser((/* req, obj */) => {
        return Promise.resolve(false);
      });
      authenticator.deserializeUser((/* req, obj */) => {
        return Promise.resolve('three');
      });

      let error;
      let user;

      before((done) => {
        authenticator.deserializeUser({ id: '1', username: 'jared' }, (err, u) => {
          error = err;
          user = u;
          done();
        });
      });

      it('should not error', () => {
        // eslint-disable-next-line no-unused-expressions
        expect(error).to.be.null;
      });

      it('should invalidate session', () => {
        // eslint-disable-next-line no-unused-expressions
        expect(user).to.be.false;
      });
    });

    describe('with three deserializers, the first of which passes and the second of which invalidates session by null', () => {
      const authenticator = new Authenticator();
      authenticator.deserializeUser((/* req, obj */) => {
        throw new Error('pass');
      });
      authenticator.deserializeUser((/* req, obj */) => {
        return Promise.resolve(null);
      });
      authenticator.deserializeUser((/* req, obj */) => {
        return Promise.resolve('three');
      });

      let error;
      let user;

      before((done) => {
        authenticator.deserializeUser({ id: '1', username: 'jared' }, (err, u) => {
          error = err;
          user = u;
          done();
        });
      });

      it('should not error', () => {
        // eslint-disable-next-line no-unused-expressions
        expect(error).to.be.null;
      });

      it('should invalidate session', () => {
        // eslint-disable-next-line no-unused-expressions
        expect(user).to.be.false;
      });
    });

    describe('with one deserializer that takes request as argument', () => {
      const authenticator = new Authenticator();
      authenticator.deserializeUser((req, obj) => {
        if (req.url !== '/foo') {
          return Promise.reject(new Error('incorrect req argument'));
        }
        return Promise.resolve(obj.username);
      });

      let error;
      let user;

      before((done) => {
        const req = { url: '/foo' };

        authenticator.deserializeUser({ id: '1', username: 'jared' }, req, (err, u) => {
          error = err;
          user = u;
          done();
        });
      });

      it('should not error', () => {
        // eslint-disable-next-line no-unused-expressions
        expect(error).to.be.null;
      });

      it('should deserialize user', () => {
        expect(user).to.equal('jared');
      });
    });
  });


  describe('#transformAuthInfo', () => {
    describe('without transforms', () => {
      const authenticator = new Authenticator();
      let error;
      let obj;

      before((done) => {
        authenticator.transformAuthInfo({ clientId: '1', scope: 'write' }, (err, o) => {
          error = err;
          obj = o;
          done();
        });
      });

      it('should not error', () => {
        // eslint-disable-next-line no-unused-expressions
        expect(error).to.be.null;
      });

      it('should not transform info', () => {
        expect(Object.keys(obj)).to.have.length(2);
        expect(obj.clientId).to.equal('1');
        expect(obj.scope).to.equal('write');
      });
    });

    describe('with one transform', () => {
      const authenticator = new Authenticator();
      authenticator.transformAuthInfo((req, info) => {
        return Promise.resolve({ clientId: info.clientId, client: { name: 'Foo' } });
      });

      let error;
      let obj;

      before((done) => {
        authenticator.transformAuthInfo({ clientId: '1', scope: 'write' }, (err, o) => {
          error = err;
          obj = o;
          done();
        });
      });

      it('should not error', () => {
        // eslint-disable-next-line no-unused-expressions
        expect(error).to.be.null;
      });

      it('should not transform info', () => {
        expect(Object.keys(obj)).to.have.length(2);
        expect(obj.clientId).to.equal('1');
        expect(obj.client.name).to.equal('Foo');
        // eslint-disable-next-line no-unused-expressions
        expect(obj.scope).to.be.undefined;
      });
    });

    describe('with one transform that encounters an error', () => {
      const authenticator = new Authenticator();
      authenticator.transformAuthInfo((/* req, info */) => {
        return Promise.reject(new Error('something went wrong'));
      });

      let error;
      let obj;

      before((done) => {
        authenticator.transformAuthInfo({ clientId: '1', scope: 'write' }, (err, o) => {
          error = err;
          obj = o;
          done();
        });
      });

      it('should error', () => {
        expect(error).to.be.an.instanceOf(Error);
        expect(error.message).to.equal('something went wrong');
      });

      it('should not transform info', () => {
        // eslint-disable-next-line no-unused-expressions
        expect(obj).to.be.undefined;
      });
    });

    describe('with one transform that throws an exception', () => {
      const authenticator = new Authenticator();
      authenticator.transformAuthInfo(() => {
        return Promise.reject(new Error('something went horribly wrong'));
      });

      let error;
      let obj;

      before((done) => {
        authenticator.transformAuthInfo({ clientId: '1', scope: 'write' }, (err, o) => {
          error = err;
          obj = o;
          done();
        });
      });

      it('should error', () => {
        expect(error).to.be.an.instanceOf(Error);
        expect(error.message).to.equal('something went horribly wrong');
      });

      it('should not transform info', () => {
        // eslint-disable-next-line no-unused-expressions
        expect(obj).to.be.undefined;
      });
    });

    describe('with one sync transform', () => {
      const authenticator = new Authenticator();
      authenticator.transformAuthInfo((req, info) => {
        return Promise.resolve({ clientId: info.clientId, client: { name: 'Foo' } });
      });

      let error;
      let obj;

      before((done) => {
        authenticator.transformAuthInfo({ clientId: '1', scope: 'write' }, (err, o) => {
          error = err;
          obj = o;
          done();
        });
      });

      it('should not error', () => {
        // eslint-disable-next-line no-unused-expressions
        expect(error).to.be.null;
      });

      it('should not transform info', () => {
        expect(Object.keys(obj)).to.have.length(2);
        expect(obj.clientId).to.equal('1');
        expect(obj.client.name).to.equal('Foo');
        // eslint-disable-next-line no-unused-expressions
        expect(obj.scope).to.be.undefined;
      });
    });

    describe('with three transform, the first of which passes and the second of which transforms', () => {
      const authenticator = new Authenticator();
      authenticator.transformAuthInfo((/* req, obj */) => {
        throw new Error('pass');
      });
      authenticator.transformAuthInfo((req, info) => {
        return Promise.resolve({ clientId: info.clientId, client: { name: 'Two' } });
      });
      authenticator.transformAuthInfo((req, info) => {
        return Promise.resolve({ clientId: info.clientId, client: { name: 'Three' } });
      });

      let error;
      let obj;

      before((done) => {
        authenticator.transformAuthInfo({ clientId: '1', scope: 'write' }, (err, o) => {
          error = err;
          obj = o;
          done();
        });
      });

      it('should not error', () => {
        // eslint-disable-next-line no-unused-expressions
        expect(error).to.be.null;
      });

      it('should not transform info', () => {
        expect(Object.keys(obj)).to.have.length(2);
        expect(obj.clientId).to.equal('1');
        expect(obj.client.name).to.equal('Two');
        // eslint-disable-next-line no-unused-expressions
        expect(obj.scope).to.be.undefined;
      });
    });

    describe('with one transform that takes request as argument', () => {
      const authenticator = new Authenticator();
      authenticator.transformAuthInfo((req, info) => {
        if (req.url !== '/foo') {
          return Promise.reject(new Error('incorrect req argument'));
        }
        return Promise.resolve({ clientId: info.clientId, client: { name: 'Foo' } });
      });

      let error;
      let obj;

      before((done) => {
        const req = { url: '/foo' };

        authenticator.transformAuthInfo({ clientId: '1', scope: 'write' }, req, (err, o) => {
          error = err;
          obj = o;
          done();
        });
      });

      it('should not error', () => {
        // eslint-disable-next-line no-unused-expressions
        expect(error).to.be.null;
      });

      it('should not transform info', () => {
        expect(Object.keys(obj)).to.have.length(2);
        expect(obj.clientId).to.equal('1');
        expect(obj.client.name).to.equal('Foo');
        // eslint-disable-next-line no-unused-expressions
        expect(obj.scope).to.be.undefined;
      });
    });
  });
});
