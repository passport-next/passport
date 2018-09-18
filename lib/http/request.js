/**
 * Module dependencies.
 */

// var http = require('http')
//  , req = http.IncomingMessage.prototype;

/* eslint-disable no-multi-assign, camelcase, no-proto, no-shadow */

const req = exports = module.exports = {};

/**
 * Initiate a login session for `user`.
 *
 * Options:
 *   - `session`  Save login state in session, defaults to _true_
 *
 * Examples:
 *
 *     req.logIn(user, { session: false });
 *
 *     req.logIn(user, function(err) {
 *       if (err) { throw err; }
 *       // session saved
 *     });
 *
 * @param {User} user
 * @param {Object} options
 * @param {Function} done
 * @api public
 */
req.logIn = function logIn(user, options, done) {
  if (typeof options === 'function') {
    done = options;
    options = {};
  }
  options = options || {};

  let property = 'user';
  if (this._passport && this._passport.instance) {
    property = this._passport.instance._userProperty || 'user';
  }
  const session = (options.session === undefined) ? true : options.session;

  this[property] = user;
  if (session) {
    if (!this._passport) { throw new Error('passport.initialize() middleware not in use'); }
    if (typeof done !== 'function') { throw new Error('req#login requires a callback function'); }

    const self = this;
    // eslint-disable-next-line consistent-return
    this._passport.instance._sm.logIn(this, user, (err) => {
      if (err) { self[property] = null; return done(err); }
      done();
    });
  } else {
    // eslint-disable-next-line no-unused-expressions
    done && done();
  }
};

req.login = req.logIn;

/**
 * Terminate an existing login session.
 *
 * @api public
 */
req.logOut = function logOut() {
  let property = 'user';
  if (this._passport && this._passport.instance) {
    property = this._passport.instance._userProperty || 'user';
  }

  this[property] = null;
  if (this._passport) {
    this._passport.instance._sm.logOut(this);
  }
};

req.logout = req.logOut;

/**
 * Test if request is authenticated.
 *
 * @return {Boolean}
 * @api public
 */
req.isAuthenticated = function isAuthenticated() {
  let property = 'user';
  if (this._passport && this._passport.instance) {
    property = this._passport.instance._userProperty || 'user';
  }

  return !!(this[property]);
};

/**
 * Test if request is unauthenticated.
 *
 * @return {Boolean}
 * @api public
 */
req.isUnauthenticated = function isUnauthenticated() {
  return !this.isAuthenticated();
};
