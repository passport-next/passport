/**
 * @typedef {import('@passport-next/passport-types').Request} Request
 */

/**
 * @typedef {import('@passport-next/passport-types').User} User
 */

/**
 * @typedef {import('./types.js').GenericObject} GenericObject
 */

/**
 * @typedef {import('./authenticator.js').SerializeUserDoneCallback}
 *   SerializeUserDoneCallback
 */

/**
 * @typedef {GenericObject & {user?: unknown}} PassportSession
 */

/**
 * @typedef {GenericObject & {session?: PassportSession}} PassportState
 */

/**
 * @typedef {Request & GenericObject & {
 *   session?: GenericObject,
 *   _passport?: PassportState
 * }} SessionRequest
 */

/**
 * @typedef {SessionRequest & {_passport: PassportState}}
 *   InitializedSessionRequest
 */

/**
 * @typedef {object} SessionManagerOptions
 * @property {string} [key="passport"]
 */

/**
 * At module scope rather than on the class so that {@link HttpRequest} may
 * import it.
 * @callback LogoutCallback
 * @returns {void}
 */

/**
 * @callback SessionManagerSerializeUser
 * @param {User} user
 * @param {Request} req
 * @param {SerializeUserDoneCallback} [done]
 * @returns {string|void|Error|Promise<string|void|0>}
 */

/**
 * Manages login and logout of sessions.
 */
class SessionManager {
  /**
   * @overload
   * @param {SessionManagerSerializeUser} serializeUser
   */

  /**
   * @overload
   * @param {SessionManagerOptions} options
   * @param {SessionManagerSerializeUser} serializeUser
   */

  /**
   * @param {SessionManagerOptions | SessionManagerSerializeUser} [options]
   * @param {SessionManagerSerializeUser} [serializeUser]
   */
  constructor(options, serializeUser) {
    if (typeof options === 'function') {
      serializeUser = /** @type {SessionManagerSerializeUser} */ (options);
      options = undefined;
    }
    options ||= {};

    this._key = options.key || 'passport';
    this._serializeUser = /** @type {SessionManagerSerializeUser} */ (
      serializeUser
    );
  }

  /**
   * @callback LogInCallback
   * @param {Error} [err]
   * @returns {void}
   */

  /**
   * Will set:
   *  1. `request._passport.session` object if not (with `.user` object as subproperty)
   *  2. `request.session` (with `_key` subproperty set to `request._passport.session`).
   * @param {Request} req
   * @param {User} user
   * @param {LogInCallback} [cb]
   * @returns {Promise<void>}
   */
  async logIn(req, user, cb) {
    const request = /** @type {InitializedSessionRequest} */ (req);
    let obj;
    try {
      obj = await this._serializeUser(user, request);
    } catch (err) {
      if (cb) {
        // eslint-disable-next-line n/callback-return -- Convenient
        cb(/** @type {Error} */ (err));
      } else {
        throw err;
      }
      return;
    }
    if (!request._passport.session) {
      request._passport.session = {};
    }
    request._passport.session.user = obj;
    if (!request.session) {
      request.session = {};
    }
    request.session[this._key] = request._passport.session;
    if (cb) {
      // eslint-disable-next-line n/callback-return -- Convenient
      cb();
    }
  }

  /* eslint-disable class-methods-use-this -- Convenient*/
  /**
   *
   * @param {Request} req
   * @param {LogoutCallback} [cb]
   * @returns {void}
   */
  logOut(req, cb) {
    /* eslint-enable class-methods-use-this -- Convenient */
    const request = /** @type {SessionRequest} */ (req);
    if (request._passport && request._passport.session) {
      delete request._passport.session.user;
    }
    if (cb) {
      // eslint-disable-next-line n/callback-return -- Convenient
      cb();
    }
  }
}

export default SessionManager;
