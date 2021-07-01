'use strict';

const IncomingMessageExt = require('../http/request.js');

/**
* @callback InitializeMiddleware
* @type {ConnectMiddleware}
*/

/**
 * Passport initialization.
 *
 * Intializes Passport for incoming requests, allowing authentication strategies
 * to be applied.
 *
 * If sessions are being utilized, applications must set up Passport with
 * functions to serialize a user into and out of a session.  For example, a
 * common pattern is to serialize just the user ID into the session (due to the
 * fact that it is desirable to store the minimum amount of data in a session).
 * When a subsequent request arrives for the session, the full User object can
 * be loaded from the database by ID.
 *
 * Note that additional middleware is required to persist login state, so we
 * must use the `connect.session()` middleware _before_ `passport.initialize()`.
 *
 * If sessions are being used, this middleware must be in use by the
 * Connect/Express application for Passport to operate.  If the application is
 * entirely stateless (not using sessions), this middleware is not necessary,
 * but its use will not have any adverse impact.
 *
 * Sets the following on `request` (first four from {@link HttpRequest}):
 * 1. `logIn` (and `login`)
 * 2. `logOut` (and `logout`)
 * 3. `isAuthenticated`
 * 4. `isUnauthenticated`
 * 5. `_passport` (with `instance` property set to `passport` and
 *    `session` property set to `req.session[passport._key]`, as potentially
 *    set by {@link SessionManager#logIn}).
 *
 * As per #5, `request` may also have `session` set later.
 *
 * @callback initialize
 * @example
 *
 *     app.use(expressSession({ secret: 'keyboard cat' }));
 *     app.use(passport.initialize());
 *     app.use(passport.session());
 *
 *     passport.serializeUser(function (user) {
 *       return user.id;
 *     });
 *
 *     passport.deserializeUser(async function (id) {
 *       const user = await User.findById(id);
 *       return user;
 *     });
 * @param {Authenticator} passport
 * @returns {InitializeMiddleware}
 * @public
 */
module.exports = function initialize(passport) {
  // Do not refactor to return an async method as is middleware calling `next`
  /* eslint-disable-next-line no-shadow */
  return function initialize(req, res, next) {
    req._passport = {};
    req._passport.instance = passport;

    if (req.session && req.session[passport._key]) {
      // load data from existing session
      req._passport.session = req.session[passport._key];
    }

    req.logIn = IncomingMessageExt.logIn;
    req.login = IncomingMessageExt.logIn;
    req.logOut = IncomingMessageExt.logOut;
    req.logout = IncomingMessageExt.logOut;
    req.isAuthenticated = IncomingMessageExt.isAuthenticated;
    req.isUnauthenticated = IncomingMessageExt.isUnauthenticated;

    next();
  };
};
