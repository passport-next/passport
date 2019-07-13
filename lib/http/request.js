/**
 * Module dependencies.
 */
'use strict';

// const http = require('http')
//  , req = http.IncomingMessage.prototype;

/* eslint-disable no-multi-assign */
const req = exports = module.exports = {};
/* eslint-enable no-multi-assign */

/**
* @typedef {Object} LogInOptions
* @property {boolean} [session] Save login state in session, defaults to _true_
*/

/**
 * Initiate a login session for `user`.
 *
 *
 * @example
 *
 *     req.logIn(user, { session: false });
 *
 *     req.logIn(user, (err) => {
 *       if (err) { throw err; }
 *       // session saved
 *     });
 *
 * @param {User} user
 * @param {LogInOptions} options
 * @param {GenericCallback} done
 * @returns {void}
 * @public
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
    if (typeof done !== 'function') { throw new TypeError('req#login requires a callback function'); }

    // eslint-disable-next-line consistent-return
    this._passport.instance._sm.logIn(this, user, (err) => {
      if (err) { this[property] = null; return done(err); }
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
 * @param {GenericCallback} done
 * @returns {void}
 * @public
 */
req.logOut = function logOut(done) {
  let property = 'user';
  if (this._passport && this._passport.instance) {
    property = this._passport.instance._userProperty || 'user';
  }

  this[property] = null;
  if (this._passport) {
    this._passport.instance._sm.logOut(this, done);
  }
};

req.logout = req.logOut;

/**
 * Test if request is authenticated.
 *
 * @returns {boolean}
 * @public
 */
req.isAuthenticated = function isAuthenticated() {
  let property = 'user';
  if (this._passport && this._passport.instance) {
    property = this._passport.instance._userProperty || 'user';
  }

  return Boolean(this[property]);
};

/**
 * Test if request is unauthenticated.
 *
 * @returns {boolean}
 * @public
 */
req.isUnauthenticated = function isUnauthenticated() {
  return !this.isAuthenticated();
};
