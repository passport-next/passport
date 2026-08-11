/**
 * @file Module dependencies.
 */

import { EnhancedStrategy } from '@passport-next/passport-strategy';

/**
 * @typedef {import('@passport-next/passport-types').Request} Request
 */

/**
 * @typedef {import('@passport-next/passport-types').User} User
 */

/**
 * @typedef {import('../types.js').GenericObject} GenericObject
 */

/**
 * @typedef {GenericObject & {user?: string | 0}} PassportSession
 */

/**
 * @typedef {Request & GenericObject & {
 *   _passport?: {
 *     instance: {_userProperty?: string},
 *     session?: PassportSession
 *   }
 * }} SessionRequest
 */

/* eslint-disable jsdoc/require-property -- Not in use */
/**
 * Not presently in use.
 * @typedef {object} SessionStrategyOptions
 */
/* eslint-enable jsdoc/require-property -- Not in use */

/**
 * @callback SessionStrategyDeserializeUser
 * @param {string|0} user
 * @param {Request} req
 * @returns {User | false | Promise<User | false>}
 */

/**
 * The `SessionStrategy` constructor.
 * @public
 */
class SessionStrategy extends EnhancedStrategy {
  /** @overload */

  /**
   * @overload
   * @param {SessionStrategyDeserializeUser} deserializeUser
   */

  /**
   * @overload
   * @param {SessionStrategyOptions} options
   * @param {SessionStrategyDeserializeUser} deserializeUser
   */

  /**
   * @param {SessionStrategyOptions | SessionStrategyDeserializeUser} [options]
   * @param {SessionStrategyDeserializeUser} [deserializeUser]
   */
  constructor(options, deserializeUser) {
    if (typeof options === 'function') {
      deserializeUser = /** @type {SessionStrategyDeserializeUser} */ (options);
      // options = undefined;
    }

    // Not in use
    // options ||= {};

    super();
    this.name = 'session';
    this._deserializeUser = /** @type {SessionStrategyDeserializeUser} */ (
      deserializeUser
    );
  }

  /**
   * Not currently in use.
   * @typedef {GenericObject} SessionStrategyAuthenticateOptions
   */

  /* eslint-disable no-unused-vars -- API */
  /**
   * Authenticate request based on the current session state.
   *
   * The session authentication strategy uses the session to restore any login
   * state across requests.  If a login session has been established, `req.user`
   * will be populated with the current user.
   *
   * This strategy is registered automatically by Passport.
   * @param {Request} req
   * @param {SessionStrategyAuthenticateOptions} options
   * @returns {Promise<void>} May return value of `this.error()`
   */
  async authenticate(req, options) {
    /* eslint-enable no-unused-vars -- API */
    const request = /** @type {SessionRequest} */ (req);

    if (!request._passport) {
      return this.error(new Error('passport.initialize() middleware not in use'));
    }

    // Not in use
    // options ||= {};

    const passportState = request._passport;
    const { session } = passportState;
    let su;

    if (session) {
      su = session.user;
    }

    if (su || su === 0) {
      let user;
      try {
        user = await this._deserializeUser(su, request);
      } catch (err) {
        return this.error(/** @type {Error} */ (err));
      }
      if (!user) {
        delete /** @type {PassportSession} */ (session).user;
      } else {
        // TODO: Remove instance access (set by `initialize`)
        const property = passportState.instance._userProperty || 'user';
        request[property] = user;
      }
      this.pass();
    } else {
      this.pass();
    }
    return undefined;
  }
}


/**
 * Expose `SessionStrategy`.
 */
export default SessionStrategy;

/* vim: set tabstop=2 shiftwidth=2 softtabstop=0 expandtab smarttab */
