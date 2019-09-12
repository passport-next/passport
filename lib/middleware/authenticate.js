/* eslint-disable no-shadow */
'use strict';

/**
 * @file Module dependencies.
 */

const http = require('http');
const AuthenticationError = require('../errors/authenticationerror');

/**
* @callback AuthenticateMiddleware
* @type {ConnectMiddleware}
*/

/**
* @callback AuthenticateCallback
* @param {Error|null} error
* @param {false|User} user Set to the authenticated user on a successful
*   authentication attempt, or `false` otherwise.
* @param {any} [info] Contains additional details provided by the strategy's verify
* callback - this could be information about a successful authentication or a
* challenge message for a failed authentication.
* @param {any} [status] Passed when authentication fails - this could
*   be an HTTP response code for a remote authentication failure or similar.
* @returns {void}
* @example
*     app.get('/protected', function (req, res, next) {
*       passport.authenticate('local', function (err, user, info, status) {
*         if (err) { next(err); return; }
*         if (!user) { res.redirect('/signin'); return; }
*         res.redirect('/account');
*       })(req, res, next);
*     });
*/

/**
 * @typedef {PlainObject} AuthenticateOptions
 * @property {string} [successRedirect] After successful login, redirect to given URL
 * @property {boolean|string} [successMessage] True to store success message in
 *  `req.session.messages`, or a string to use as override message for success.
 * @property {boolean|string} [successFlash] True to flash success messages or a string
 *   to use as a flash message for success (overrides any from the strategy itself).
 * @property {string} [failureRedirect] After failed login, redirect to given URL
 * @property {boolean|string} [failureMessage] True to store failure message in
 * `req.session.messages`, or a string to use as override
 *  message for failure.
 * @property {boolean|string} [failureFlash] True to flash failure messages or a string to
 *  use as a flash message for failures (overrides any from the strategy itself).
 * @property {boolean} [failWithError] Passes on an {@link AuthenticationError}
 * @property {string} [assignProperty] Assign the object provided by the verify callback
 *   to given property
 * @property {string} [successReturnToOrRedirect] Redirect URL; overridden if
 *   `req.session.returnTo` is truthy
 * @property {boolean} [authInfo=true] Set to `false` to disable setting of `autoInfo`
 *   on `req` through `transformAuthInfo`
*/

// Todo: Reenable after this may be merged https://github.com/gajus/eslint-plugin-jsdoc/pull/270
/**
 * Authenticates requests.
 *
 * Applies the `name`ed strategy (or strategies) to the incoming request, in
 * order to authenticate the request.  If authentication is successful, the user
 * will be logged in and populated at `req.user` and a session will be
 * established by default.  If authentication fails, an unauthorized response
 * will be sent.
 *
 * An optional `callback` can be supplied to allow the application to override
 * the default manner in which authentication attempts are handled.
 *
 * Note that if a callback is supplied, it becomes the application's
 * responsibility to log-in the user, establish a session, and otherwise perform
 * the desired operations.
 *
 * Note that its redirecting behavior relies on `res.redirect` (available in
 * Express but not Connect).
 *
 * @callback authenticate
 * @example
 *
 *     passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login' });
 *
 *     passport.authenticate('basic', { session: false });
 *
 *     passport.authenticate('twitter');
 *
 * @param {Authenticator} passport
 * @param {string|string[]} name
 * @param {AuthenticateOptions} options
 * @param {AuthenticateCallback} [callback]
 * @returns {AuthenticateMiddleware}
 * @public
 */
module.exports = function authenticate(passport, name, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  options = options || {};

  let multi = true;

  // Cast `name` to an array, allowing authentication to pass through a chain of
  // strategies.  The first strategy to succeed, redirect, or error will halt
  // the chain.  Authentication failures will proceed through each strategy in
  // series, ultimately failing if all strategies fail.
  //
  // This is typically used on API endpoints to allow clients to authenticate
  // using their preferred choice of Basic, Digest, token-based schemes, etc.
  // It is not feasible to construct a chain of multiple strategies that involve
  // redirection (for example both Facebook and Twitter), since the first one to
  // redirect will halt the chain.
  if (!Array.isArray(name)) {
    name = [name];
    multi = false;
  }

  // Do not refactor to return an async method as is middleware calling `next`
  return function authenticate(req, res, next) {
    // accumulator for failures from each strategy in the chain
    const failures = [];

    /**
     * @param {string} url
     * @returns {void}
     * @see https://expressjs.com/en/api.html#res.redirect
     */
    function redirect(url) {
      if (req.session && req.session.save && typeof req.session.save === 'function') {
        req.session.save(() => res.redirect(url));
        return;
      }
      res.redirect(url);
    }

    /**
     *
     * @returns {void}
     */
    function allFailed() {
      if (callback) {
        if (!multi && failures[0]) {
          callback(null, false, failures[0].challenge, failures[0].status);
          return;
        }
        const challenges = failures.map(f => f.challenge);
        const statuses = failures.map(f => f.status);
        callback(null, false, challenges, statuses);
        return;
      }

      // Strategies are ordered by priority.  For the purpose of flashing a
      // message, the first failure will be displayed.
      const failure = failures[0] || {};
      const challenge = failure.challenge || {};

      if (options.failureFlash) {
        let flash = options.failureFlash;
        if (typeof flash === 'string') {
          flash = { type: 'error', message: flash };
        }
        if (typeof flash !== 'boolean') {
          flash.type = flash.type || 'error';
        }

        const type = flash.type || challenge.type || 'error';
        const msg = flash.message || challenge.message || challenge;
        if (typeof msg === 'string') {
          req.flash(type, msg);
        }
      }
      if (options.failureMessage) {
        let msg = options.failureMessage;
        if (typeof msg === 'boolean') {
          msg = challenge.message || challenge;
        }
        if (typeof msg === 'string') {
          req.session.messages = req.session.messages || [];
          req.session.messages.push(msg);
        }
      }
      if (options.failureRedirect) {
        redirect(options.failureRedirect);
        return;
      }

      // When failure handling is not delegated to the application, the default
      // is to respond with 401 Unauthorized.  Note that the WWW-Authenticate
      // header will be set according to the strategies in use (see
      // actions#fail).  If multiple strategies failed, each of their challenges
      // will be included in the response.
      const rchallenge = [];
      let rstatus;
      failures.forEach(({ challenge, status }) => {
        rstatus = rstatus || status;
        if (typeof challenge === 'string') {
          rchallenge.push(challenge);
        }
      });

      res.statusCode = rstatus || 401;
      if (res.statusCode === 401 && rchallenge.length) {
        res.setHeader('WWW-Authenticate', rchallenge);
      }
      if (options.failWithError) {
        next(new AuthenticationError(http.STATUS_CODES[res.statusCode], rstatus));
        return;
      }
      res.end(http.STATUS_CODES[res.statusCode]);
    }

    (function attempt(i) {
      const layer = name[i];
      // If no more strategies exist in the chain, authentication has failed.
      if (!layer) {
        allFailed();
        return;
      }

      // Get the strategy, which will be used as prototype from which to create
      // a new instance.  Action functions will then be bound to the strategy
      // within the context of the HTTP request/response pair.
      const prototype = passport._strategy(layer);
      if (!prototype) {
        next(new Error(`Unknown authentication strategy "${layer}"`));
        return;
      }

      const strategy = Object.create(prototype);

      /**
      * @typedef {PlainObject} SuccessInfo
      * @property {string} [type="success"]
      * @property {string} [message]
      */


      // ----- BEGIN STRATEGY AUGMENTATION -----
      // Augment the new strategy instance with action functions.  These action
      // functions are bound via closure the the request/response pair.  The end
      // goal of the strategy is to invoke *one* of these action methods, in
      // order to indicate successful or failed authentication, redirect to a
      // third-party identity provider, etc.

      /**
       * Authenticate `user`, with optional `info`.
       *
       * Strategies should call this function to successfully authenticate a
       * user.  `user` should be an object supplied by the application after it
       * has been given an opportunity to verify credentials.  `info` is an
       * optional argument containing additional user information.  This is
       * useful for third-party authentication strategies to pass profile
       * details.
       *
       * @param {User} user
       * @param {SuccessInfo} [info]
       * @public
       * @returns {void}
       */
      strategy.success = async function success(user, info) {
        if (callback) {
          callback(null, user, info);
          return;
        }

        info = info || {};

        if (options.successFlash) {
          let flash = options.successFlash;
          if (typeof flash === 'string') {
            flash = { type: 'success', message: flash };
          }
          if (typeof flash !== 'boolean') {
            flash.type = flash.type || 'success';
          }

          const type = flash.type || info.type || 'success';
          const msg = flash.message || info.message || info;
          if (typeof msg === 'string') {
            req.flash(type, msg);
          }
        }
        if (options.successMessage) {
          let msg = options.successMessage;
          if (typeof msg === 'boolean') {
            msg = info.message || info;
          }
          if (typeof msg === 'string') {
            req.session.messages = req.session.messages || [];
            req.session.messages.push(msg);
          }
        }
        if (options.assignProperty) {
          req[options.assignProperty] = user;
          next();
          return;
        }

        try {
          await req.logIn(user, options);
        } catch (err) {
          next(err);
          return;
        }

        /**
         *
         * @returns {void}
         */
        function complete() {
          if (options.successReturnToOrRedirect) {
            let url = options.successReturnToOrRedirect;
            if (req.session && req.session.returnTo) {
              url = req.session.returnTo;
              delete req.session.returnTo;
            }
            redirect(url);
            return;
          }
          if (options.successRedirect) {
            redirect(options.successRedirect);
            return;
          }
          next();
        }

        if (options.authInfo !== false) {
          try {
            const tinfo = await passport.transformAuthInfo(info, req);
            req.authInfo = tinfo;
            complete();
          } catch (err) {
            next(err);
            // eslint-disable-next-line no-useless-return
            return;
          }
        } else {
          complete();
        }
      };

      /**
       * Fail authentication, with optional `challenge` and `status`, defaulting
       * to 401.
       *
       * Strategies should call this function to fail an authentication attempt.
       *
       * @param {string} [challenge]
       * @param {number} [status]
       * @returns {void}
       * @public
       */
      strategy.fail = function fail(challenge, status) {
        if (typeof challenge === 'number') {
          status = challenge;
          challenge = undefined;
        }

        // push this failure into the accumulator and attempt authentication
        // using the next strategy
        failures.push({ challenge, status });
        attempt(i + 1);
      };

      /**
       * Redirect to `url` with optional `status`, defaulting to 302.
       *
       * Strategies should call this function to redirect the user (via their
       * user agent) to a third-party website for authentication.
       *
       * @param {string} url
       * @param {number} [status=302]
       * @returns {void}
       * @public
       */
      strategy.redirect = function redirect(url, status) {
        // NOTE: Do not use `res.redirect` from Express, because it can't decide
        //       what it wants.
        //
        //       Express 2.x: res.redirect(url, status)
        //       Express 3.x: res.redirect(status, url) -OR- res.redirect(url, status)
        //         - as of 3.14.0, deprecated warnings are issued if res.redirect(url, status)
        //           is used
        //       Express 4.x: res.redirect(status, url)
        //         - all versions (as of 4.8.7) continue to accept res.redirect(url, status)
        //           but issue deprecated versions

        res.statusCode = status || 302;
        res.setHeader('Location', url);
        res.setHeader('Content-Length', '0');
        res.end();
      };

      /**
       * Pass without making a success or fail decision.
       *
       * Under most circumstances, Strategies should not need to call this
       * function.  It exists primarily to allow previous authentication state
       * to be restored, for example from an HTTP session.
       *
       * @returns {void}
       * @public
       */
      strategy.pass = function pass() {
        next();
      };

      /**
       * Internal error while performing authentication.
       *
       * Strategies should call this function when an internal error occurs
       * during the process of performing authentication; for example, if the
       * user directory is not available.
       *
       * @param {Error} err
       * @public
       * @returns {void}
       */
      strategy.error = function error(err) {
        if (callback) {
          callback(err);
          return;
        }

        next(err);
      };

      // ----- END STRATEGY AUGMENTATION -----

      strategy.authenticate(req, options);
    }(0)); // attempt
  };
};
