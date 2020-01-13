'use strict';

/**
* @typedef {PlainObject} SessionManagerOptions
* @property {string} [key="passport"]
*/

/**
* @callback SessionManagerSerializeUser
* @param {User} user
* @param {Request} req
* @param {SerializeUserDoneCallback} done
* @returns {Promise<GenericObject>}
*/

class SessionManager {
  /**
   *
   * @param {SessionManagerOptions} [options]
   * @param {SessionManagerSerializeUser} serializeUser
   */
  constructor(options, serializeUser) {
    if (typeof options === 'function') {
      serializeUser = options;
      options = undefined;
    }
    options = options || {};

    this._key = options.key || 'passport';
    this._serializeUser = serializeUser;
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
    let obj;
    try {
      obj = await this._serializeUser(user, req);
    } catch (err) {
      // eslint-disable-next-line no-unused-expressions, callback-return
      cb && cb(err);
      if (!cb) {
        throw err;
      }
      return;
    }
    if (!req._passport.session) {
      req._passport.session = {};
    }
    req._passport.session.user = obj;
    if (!req.session) {
      req.session = {};
    }
    req.session[this._key] = req._passport.session;
    // eslint-disable-next-line no-unused-expressions
    cb && cb();
  }

  /**
  * @callback LogoutCallback
  * @returns {void}
  */

  /* eslint-disable class-methods-use-this */
  /**
   *
   * @param {Request} req
   * @param {LogoutCallback} [cb]
   * @returns {void}
   */
  logOut(req, cb) {
    /* eslint-enable class-methods-use-this */
    if (req._passport && req._passport.session) {
      delete req._passport.session.user;
    }
    // eslint-disable-next-line no-unused-expressions
    cb && cb();
  }
}

module.exports = SessionManager;
