'use strict';
/**
 * @file Module dependencies.
 */

const Strategy = require('@passport-next/passport-strategy');

/**
 * Not presently in use.
 * @typedef {GenericObject} SessionStrategyOptions
*/

/**
* @callback SessionStrategyDeserializeUser
* @param {string|0} user
* @param {Request} req
* @returns {Promise<User>}
*/

/**
 * The `SessionStrategy` constructor.
 *
 * @public
 */
class SessionStrategy extends Strategy {
  /**
   *
   * @param {SessionStrategyOptions} [options]
   * @param {SessionStrategyDeserializeUser} deserializeUser
   */
  constructor(options, deserializeUser) {
    if (typeof options === 'function') {
      deserializeUser = options;
      options = undefined;
    }
    options = options || {};

    super();
    this.name = 'session';
    this._deserializeUser = deserializeUser;
  }

  /**
   * Not currently in use.
   * @typedef {GenericObject} SessionStrategyAuthenticateOptions
  */

  /**
   * Authenticate request based on the current session state.
   *
   * The session authentication strategy uses the session to restore any login
   * state across requests.  If a login session has been established, `req.user`
   * will be populated with the current user.
   *
   * This strategy is registered automatically by Passport.
   *
   * @param {Request} req
   * @param {SessionStrategyAuthenticateOptions} options
   * @protected
   * @returns {Promise<void>} May return value of `this.error()`
   */
  async authenticate(req, options) {
    if (!req._passport) {
      return this.error(new Error('passport.initialize() middleware not in use'));
    }
    // eslint-disable-next-line no-unused-vars
    options = options || {};

    let su;

    if (req._passport.session) {
      su = req._passport.session.user;
    }

    if (su || su === 0) {
      let user;
      try {
        user = await this._deserializeUser(su, req);
      } catch (err) {
        return this.error(err);
      }
      if (!user) {
        delete req._passport.session.user;
      } else {
        // TODO: Remove instance access (set by `initialize`)
        const property = req._passport.instance._userProperty || 'user';
        req[property] = user;
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
module.exports = SessionStrategy;

/* vim: set tabstop=2 shiftwidth=2 softtabstop=0 expandtab smarttab */
