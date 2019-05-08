/**
 * Module dependencies.
 */

const Strategy = require('@passport-next/passport-strategy');

/**
 * `SessionStrategy` constructor.
 *
 * @api public
 */
class SessionStrategy extends Strategy {
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
   * Authenticate request based on the current session state.
   *
   * The session authentication strategy uses the session to restore any login
   * state across requests.  If a login session has been established, `req.user`
   * will be populated with the current user.
   *
   * This strategy is registered automatically by Passport.
   *
   * @param {Object} req
   * @param {Object} options
   * @api protected
   */

  // eslint-disable-next-line consistent-return, no-unused-vars
  authenticate(req, options) {
    if (!req._passport) { return this.error(new Error('passport.initialize() middleware not in use')); }
    options = options || {};

    const self = this;
    let su;

    if (req._passport.session) {
      su = req._passport.session.user;
    }

    if (su || su === 0) {
      // eslint-disable-next-line consistent-return
      this._deserializeUser(su, req, (err, user) => {
        if (err) { return self.error(err); }
        if (!user) {
          delete req._passport.session.user;
        } else {
          // TODO: Remove instance access
          const property = req._passport.instance._userProperty || 'user';
          req[property] = user;
        }
        self.pass();
      });
    } else {
      self.pass();
    }
  }
}


/**
 * Expose `SessionStrategy`.
 */
module.exports = SessionStrategy;

/* vim: set tabstop=2 shiftwidth=2 softtabstop=0 expandtab smarttab */
