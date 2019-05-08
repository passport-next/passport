/* eslint-disable no-shadow */

const chai = require('chai');
const authenticate = require('../../lib/middleware/authenticate');
const { Passport } = require('../..');


describe('middleware/authenticate', () => {
  describe('redirect', () => {
    class Strategy {
      authenticate() {
        this.redirect('http://www.example.com/idp');
      }
    }

    const passport = new Passport();
    passport.use('redirect', new Strategy());

    let request;
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
      // eslint-disable-next-line no-unused-expressions
      expect(request.user).to.be.undefined;
    });

    it('should redirect', () => {
      expect(response.statusCode).to.equal(302);
      expect(response.getHeader('Location')).to.equal('http://www.example.com/idp');
      expect(response.getHeader('Content-Length')).to.equal('0');
    });
  });

  describe('redirect with session', () => {
    class Strategy {
      authenticate() {
        const user = { id: '1', username: 'idurotola' };
        this.success(user);
      }
    }

    const passport = new Passport();
    passport.use('success', new Strategy());

    let request;
    let response;
    const authenticator = authenticate(passport, 'success', {
      successRedirect: 'http://www.example.com/idp',
    });

    before((done) => {
      chai.connect.use('express', authenticator)
        .req((req) => {
          request = req;

          req.session = {};
          req.session.save = function save(done) {
            done();
          };

          req.logIn = function logIn(user, options, done) {
            this.user = user;
            done();
          };
        })
        .end((res) => {
          response = res;
          done();
        })
        .dispatch();
    });

    it('should set user', () => {
      // eslint-disable-next-line no-unused-expressions
      expect(request.user).to.not.be.undefined;
    });

    it('should redirect', () => {
      expect(response.statusCode).to.equal(302);
      expect(response.getHeader('Location')).to.equal('http://www.example.com/idp');
    });
  });

  describe('redirect with status', () => {
    class Strategy {
      authenticate() {
        this.redirect('http://www.example.com/idp', 303);
      }
    }

    const passport = new Passport();
    passport.use('redirect', new Strategy());

    let request;
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
      // eslint-disable-next-line no-unused-expressions
      expect(request.user).to.be.undefined;
    });

    it('should redirect', () => {
      expect(response.statusCode).to.equal(303);
      expect(response.getHeader('Location')).to.equal('http://www.example.com/idp');
      expect(response.getHeader('Content-Length')).to.equal('0');
    });
  });

  describe('redirect using framework function', () => {
    class Strategy {
      authenticate() {
        this.redirect('http://www.example.com/idp');
      }
    }

    const passport = new Passport();
    passport.use('redirect', new Strategy());

    let request;
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
      // eslint-disable-next-line no-unused-expressions
      expect(request.user).to.be.undefined;
    });

    it('should redirect', () => {
      expect(response.statusCode).to.equal(302);
      expect(response.getHeader('Location')).to.equal('http://www.example.com/idp');
    });
  });

  describe('redirect with status using framework function', () => {
    class Strategy {
      authenticate() {
        this.redirect('http://www.example.com/idp', 303);
      }
    }

    const passport = new Passport();
    passport.use('redirect', new Strategy());

    let request;
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
      // eslint-disable-next-line no-unused-expressions
      expect(request.user).to.be.undefined;
    });

    it('should redirect', () => {
      expect(response.statusCode).to.equal(303);
      expect(response.getHeader('Location')).to.equal('http://www.example.com/idp');
    });
  });
});
