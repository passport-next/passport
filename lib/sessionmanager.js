'use strict';

class SessionManager {
  constructor(options, serializeUser) {
    if (typeof options === 'function') {
      serializeUser = options;
      options = undefined;
    }
    options = options || {};

    this._key = options.key || 'passport';
    this._serializeUser = serializeUser;
  }

  logIn(req, user, cb) {
    // eslint-disable-next-line consistent-return
    this._serializeUser(user, req, (err, obj) => {
      if (err) {
        return cb(err);
      }
      if (!req._passport.session) {
        req._passport.session = {};
      }
      req._passport.session.user = obj;
      if (!req.session) {
        req.session = {};
      }
      req.session[this._key] = req._passport.session;
      cb();
    });
  }

  // eslint-disable-next-line class-methods-use-this
  logOut(req, cb) {
    if (req._passport && req._passport.session) {
      delete req._passport.session.user;
    }
    // eslint-disable-next-line no-unused-expressions
    cb && cb();
  }
}

module.exports = SessionManager;
