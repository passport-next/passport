/* eslint-disable unicorn/no-this-outside-of-class -- Convenient */
/**
 * @file Module dependencies.
 */


/**
 * @typedef {import('@passport-next/passport-types').User} User
 */

/**
 * @typedef {import('@passport-next/passport-types').Request} Request
 */

/**
 * @typedef {import('../types.js').GenericObject} GenericObject
 */

/**
 * @typedef {import('../sessionmanager.js').LogoutCallback} LogoutCallback
 */

/**
 * @callback LoginDoneCallback
 * @param {Error} [error]
 * @returns {void}
 */

/**
 * @typedef {object} LogInOptions
 * @property {boolean} [session=true] Save login state in session.
 */

/**
 * @typedef {(
 *   ((user: User, done?: LoginDoneCallback) => Promise<void>) &
 *   ((user: User, options?: LogInOptions, done?: LoginDoneCallback) => Promise<void>)
 * )} LogIn
 */

/**
 * @typedef {Request & GenericObject & {
 *   _passport?: {
 *     instance: {
 *       _userProperty?: string,
 *       _sm: import('../sessionmanager.js').default
 *     }
 *   },
 *   logIn: LogIn,
 *   login: LogIn,
 *   logOut: (done?: LogoutCallback) => void,
 *   logout: (done?: LogoutCallback) => void,
 *   isAuthenticated: () => boolean,
 *   isUnauthenticated: () => boolean
 * }} HttpRequest
 */

const req = /** @type {HttpRequest} */ ({ logIn: function logIn(user, options, done) {
  if (typeof options === 'function') {
    done = options;
    options = {};
  }
  options ||= {};

  const property = this._passport && this._passport.instance ? this._passport.instance._userProperty || 'user' : 'user';
  const session = (options.session === undefined) ? true : options.session;

  /** @type {Record<string, User | null | undefined>} */ (this)[property] = user;
  if (session) {
    if (!this._passport) {
      throw new Error('passport.initialize() middleware not in use');
    }
    const passportState = this._passport;

    // We don't use async above in order to be able to throw early there
    return (async () => {
      try {
        // `this._passport.instance` (and `_sm`) set by `initialize`
        await passportState.instance._sm.logIn(this, user);
        if (done) {
          done();
        }
      } catch (err) {
        /** @type {Record<string, User | null | undefined>} */ (this)[property] = null;
        if (done) {
          done(/** @type {Error} */ (err));
        } else {
          throw err;
        }
      }
    })();
  }
  if (done) {
    done();
  }
  return Promise.resolve();
} });

/**
 * Initiate a login session for `user`.
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

req.login = req.logIn;

/**
 * Terminate an existing login session.
 * @function HttpRequest#logOut
 * @param {LogoutCallback} [done]
 * @returns {void}
 * @public
 */
req.logOut = function logOut(done) {
  const property = this._passport && this._passport.instance ? this._passport.instance._userProperty || 'user' : 'user';

  /** @type {Record<string, User | null | undefined>} */ (this)[property] = null;
  if (this._passport && this._passport.instance) {
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
  const property = this._passport && this._passport.instance ? this._passport.instance._userProperty || 'user' : 'user';

  return Boolean(
    // eslint-disable-next-line unicorn/no-computed-property-existence-check -- Compatibility
    /** @type {Record<string, User | null | undefined>} */ (this)[property]
  );
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

export default req;
