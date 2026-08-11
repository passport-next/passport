/* eslint-disable no-shadow -- Convenient */

import { chai, expect } from '../bootstrap/node.js';
import authenticate from '../../lib/middleware/authenticate.js';
import { Passport, EnhancedStrategy } from '../../lib/index.js';


describe('middleware/authenticate', () => {
  describe('redirect', () => {
    class Strategy extends EnhancedStrategy {
      authenticate() {
        this.redirect('https://www.example.com/idp');
      }
    }

    const passport = new Passport();
    passport.use('redirect', new Strategy());

    /** @type {import('../types.js').Request} */
    let request;
    /** @type {import('@passport-next/chai-connect-middleware').Response} */
    let response;

    before((done) => {
      chai.connect.use(authenticate(passport, 'redirect'))
        .req((req) => {
          request = req;
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

    it('should redirect', () => {
      expect(response.statusCode).to.equal(302);
      expect(response.getHeader('Location')).to.equal('https://www.example.com/idp');
      expect(response.getHeader('Content-Length')).to.equal('0');
    });
  });

  describe('redirect with session', () => {
    class Strategy extends EnhancedStrategy {
      authenticate() {
        const user = { id: '1', username: 'idurotola' };
        this.success(user);
      }
    }

    const passport = new Passport();
    passport.use('success', new Strategy());

    /** @type {import('../types.js').Request} */
    let request;
    /** @type {import('@passport-next/chai-connect-middleware').Response} */
    let response;
    const authenticator = authenticate(passport, 'success', {
      successRedirect: 'https://www.example.com/idp'
    });

    before((done) => {
      chai.connect.use('express', authenticator)
        .req((req) => {
          request = req;

          req.session = {};
          req.session.save = function save(done) {
            done();
          };

          req.logIn = function logIn(user) {
            this.user = user;
          };
        })
        .end((res) => {
          response = res;
          done();
        })
        .dispatch();
    });

    it('should set user', () => {
      expect(request.user).to.not.be.undefined;
    });

    it('should redirect', () => {
      expect(response.statusCode).to.equal(302);
      expect(response.getHeader('Location')).to.equal('https://www.example.com/idp');
    });
  });

  describe('redirect with status', () => {
    class Strategy extends EnhancedStrategy {
      authenticate() {
        this.redirect('https://www.example.com/idp', 303);
      }
    }

    const passport = new Passport();
    passport.use('redirect', new Strategy());

    /** @type {import('../types.js').Request} */
    let request;
    /** @type {import('@passport-next/chai-connect-middleware').Response} */
    let response;

    before((done) => {
      chai.connect.use(authenticate(passport, 'redirect'))
        .req((req) => {
          request = req;
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

    it('should redirect', () => {
      expect(response.statusCode).to.equal(303);
      expect(response.getHeader('Location')).to.equal('https://www.example.com/idp');
      expect(response.getHeader('Content-Length')).to.equal('0');
    });
  });

  describe('redirect using framework function', () => {
    class Strategy extends EnhancedStrategy {
      authenticate() {
        this.redirect('https://www.example.com/idp');
      }
    }

    const passport = new Passport();
    passport.use('redirect', new Strategy());

    /** @type {import('../types.js').Request} */
    let request;
    /** @type {import('@passport-next/chai-connect-middleware').Response} */
    let response;

    before((done) => {
      chai.connect.use('express', authenticate(passport, 'redirect'))
        .req((req) => {
          request = req;
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

    it('should redirect', () => {
      expect(response.statusCode).to.equal(302);
      expect(response.getHeader('Location')).to.equal('https://www.example.com/idp');
    });
  });

  describe('redirect with status using framework function', () => {
    class Strategy extends EnhancedStrategy {
      authenticate() {
        this.redirect('https://www.example.com/idp', 303);
      }
    }

    const passport = new Passport();
    passport.use('redirect', new Strategy());

    /** @type {import('../types.js').Request} */
    let request;
    /** @type {import('@passport-next/chai-connect-middleware').Response} */
    let response;

    before((done) => {
      chai.connect.use('express', authenticate(passport, 'redirect'))
        .req((req) => {
          request = req;
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

    it('should redirect', () => {
      expect(response.statusCode).to.equal(303);
      expect(response.getHeader('Location')).to.equal('https://www.example.com/idp');
    });
  });
});
