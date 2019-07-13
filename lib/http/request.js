/**
 * @file Module dependencies.
 */
'use strict';

/* eslint-disable no-multi-assign */
/**
 * @namespace {PlainObject} HttpRequest
 */
const req = exports = module.exports = {};
/* eslint-enable no-multi-assign */

/**
* @callback LoginDoneCallback
* @param {Error} [error]
*/

/**
* @typedef {PlainObject} LogInOptions
* @property {boolean} [session=true] Save login state in session.
*/

/**
 * Initiate a login session for `user`.
 *
 * @function HttpRequest#logIn
 * @example
 *
 *    req.logIn(user, { session: false });
 *
 *    (async () => {
 *    try {
 *     await req.logIn(user);
 *    } catch (err) {
 *     console.error(err);
 *     throw err;
 *    }
 *    // session saved
 *    })();
 *
 * @param {User} user
 * @param {LogInOptions} options
 * @param {LoginDoneCallback} done
 * @returns {Promise<void>}
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

    // We don't use async above in order to be able to throw early there
    return (async () => {
      try {
        // `this._passport.instance` (and `_sm`) set by `initialize`
        await this._passport.instance._sm.logIn(this, user);
        // eslint-disable-next-line no-unused-expressions
        done && done();
      } catch (err) {
        this[property] = null;
        if (done) {
          done(err);
        } else {
          throw err;
        }
      }
    })();
  } else if (done) {
    done();
  }
  return Promise.resolve();
};

req.login = req.logIn;

/**
 * Terminate an existing login session.
 * @function HttpRequest#logOut
 * @param {LogoutCallback} done
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
 * @function HttpRequest#isAuthenticated
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
 * @function HttpRequest#isUnauthenticated
 * @returns {boolean}
 * @public
 */
req.isUnauthenticated = function isUnauthenticated() {
  return !this.isAuthenticated();
};
