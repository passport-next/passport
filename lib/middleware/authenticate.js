/* eslint-disable no-shadow -- Convenient */

/**
 * @file Module dependencies.
 */

// @ts-ignore -- Production declarations intentionally exclude Node types.
import http from 'node:http';
import AuthenticationError from '../errors/authenticationerror.js';

/**
 * @typedef {import('../index.js').ConnectMiddleware} ConnectMiddleware
 */

/**
 * @typedef {import('../authenticator.js').default} Authenticator
 */

/**
 * @typedef {import('@passport-next/passport-types').User} User
 */

/**
 * @typedef {import('@passport-next/passport-types').AuthInfo} AuthInfo
 */

/**
 * @typedef {import('@passport-next/passport-strategy').StrategyLike} StrategyLike
 */

/**
 * @typedef {import('../types.js').GenericObject} GenericObject
 */

/** @typedef {ConnectMiddleware} AuthenticateMiddleware */

/**
 * @typedef {GenericObject & {type?: string, message?: string}} MessageInfo
 */

/** @typedef {boolean | string | MessageInfo} MessageOption */

/**
 * @typedef {import('../index.js').ConnectRequest &
 *   import('@passport-next/passport-types').Request & GenericObject & {
 *   session?: GenericObject & {
 *     messages?: string[],
 *     returnTo?: string,
 *     save?: (done: () => void) => void
 *   },
 *   flash: (type: string, message: string) => void,
 *   logIn: (user: User, options: AuthenticateOptions) => Promise<void>
 * }} AuthenticateRequest
 */

/**
 * @typedef {import('@passport-next/http-types').ConnectResponse & {
 *   redirect: (url: string) => void
 * }} AuthenticateResponse
 */

/**
 * @typedef {{challenge?: string | MessageInfo, status?: number}} Failure
 */

/**
 * @callback AuthenticateCallback
 * @param {Error|null} error
 * @param {false|User} [user] Set to the authenticated user on a successful
 *   authentication attempt, or `false` otherwise.
 * @param {unknown} [info] Contains additional details provided by the strategy's verify
 * callback - this could be information about a successful authentication or a
 * challenge message for a failed authentication.
 * @param {number | Array<number | undefined>} [status] Passed when authentication fails - this
 *   could be an HTTP response code for a remote authentication failure or similar.
 * @returns {void}
 * @example
 *     app.get('/protected', function (req, res, next) {
 *       passport.authenticate('local', function (err, user, info, status) {
 *         if (err) { next(err); return; }
 *         if (!user) { res.redirect('/signin'); return; }
 *         res.redirect('/account');
 *       })(req, res, next);
 *     });
 *
 */

/**
 * `successRedirect` is an optional string. After successful login, redirect to given URL
 * `successMessage` is an optional `MessageOption`. True to store success message in
 *  `req.session.messages`, or a string to use as override message for success.
 * `successFlash` is an optional `MessageOption`. True to flash success messages or a string
 *   to use as a flash message for success (overrides any from the strategy itself).
 * `failureRedirect` is an optional string. After failed login, redirect to given URL
 * `failureMessage` is an optional `MessageOption`. True to store failure message in
 * `req.session.messages`, or a string to use as override
 *  message for failure.
 * `failureFlash` is an optional `MessageOption`. True to flash failure messages or a string to
 *  use as a flash message for failures (overrides any from the strategy itself).
 * `failWithError` is an optional boolean. Passes on an {@link AuthenticationError}
 * `assignProperty` is an optional string. Assign the object provided by the verify callback
 *   to given property
 * `successReturnToOrRedirect` is an optional string. Redirect URL; overridden if
 *   `req.session.returnTo` is truthy
 * `authInfo` is an optional, default-true boolean. Set to `false` to disable setting of `autoInfo`
 *   on `req` through `transformAuthInfo`
 * @typedef {GenericObject & {
 *   successRedirect?: string,
 *   successMessage?: MessageOption,
 *   successFlash?: MessageOption,
 *   failureRedirect?: string,
 *   failureMessage?: MessageOption,
 *   failureFlash?: MessageOption,
 *   failWithError?: boolean,
 *   assignProperty?: string,
 *   successReturnToOrRedirect?: string,
 *   authInfo?: boolean
 * }} AuthenticateOptions
 */

// Todo: Reenable after this may be merged https://github.com/gajus/eslint-plugin-jsdoc/pull/270
/**
 * @overload
 * @param {Authenticator} passport
 * @param {string | StrategyLike | Array<string | StrategyLike>} name
 * @param {AuthenticateOptions} [options]
 * @param {AuthenticateCallback} [callback]
 * @returns {AuthenticateMiddleware}
 */

/**
 * @overload
 * @param {Authenticator} passport
 * @param {string | StrategyLike | Array<string | StrategyLike>} name
 * @param {AuthenticateCallback} callback
 * @returns {AuthenticateMiddleware}
 */

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
 * @example
 *
 *     passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login' });
 *
 *     passport.authenticate('basic', { session: false });
 *
 *     passport.authenticate('twitter');
 *
 * @param {Authenticator} passport
 * @param {string | StrategyLike | Array<string | StrategyLike>} name
 * @param {AuthenticateOptions | AuthenticateCallback} [options]
 * @param {AuthenticateCallback} [callback]
 * @returns {AuthenticateMiddleware}
 * @public
 */
function authenticate(passport, name, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  options ||= {};
  const authenticateOptions = options;

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
  let layers = name;
  if (!Array.isArray(layers)) {
    layers = [layers];
    multi = false;
  }

  // Do not refactor to return an async method as is middleware calling `next`
  return function authenticate(req, res, next) {
    const request = /** @type {AuthenticateRequest} */ (
      /** @type {unknown} */ (req)
    );
    const response = /** @type {AuthenticateResponse} */ (res);
    // accumulator for failures from each strategy in the chain
    /** @type {Failure[]} */
    const failures = [];

    /**
     * @param {string} url
     * @returns {void}
     * @see https://expressjs.com/en/api.html#res.redirect
     */
    function redirect(url) {
      if (request.session && request.session.save && typeof request.session.save === 'function') {
        request.session.save(() => response.redirect(url));
        return;
      }
      response.redirect(url);
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
      const challengeInfo = typeof challenge === 'object' ? challenge : {};

      if (authenticateOptions.failureFlash) {
        const flashOption = authenticateOptions.failureFlash;
        const flash = typeof flashOption === 'string'
          ? { type: 'error', message: flashOption }
          : typeof flashOption === 'boolean' ? {} : flashOption;
        if (typeof flashOption !== 'boolean') {
          flash.type ||= 'error';
        }

        const type = flash.type || challengeInfo.type || 'error';
        const msg = flash.message || challengeInfo.message || challenge;
        if (typeof msg === 'string') {
          request.flash(type, msg);
        }
      }
      if (authenticateOptions.failureMessage) {
        let msg = authenticateOptions.failureMessage;
        if (typeof msg === 'boolean') {
          msg = challengeInfo.message || challenge;
        }
        if (typeof msg === 'string') {
          request.session ||= {};
          request.session.messages ||= [];
          request.session.messages.push(msg);
        }
      }
      if (authenticateOptions.failureRedirect) {
        redirect(authenticateOptions.failureRedirect);
        return;
      }

      // When failure handling is not delegated to the application, the default
      // is to respond with 401 Unauthorized.  Note that the WWW-Authenticate
      // header will be set according to the strategies in use (see
      // actions#fail).  If multiple strategies failed, each of their challenges
      // will be included in the response.
      /** @type {string[]} */
      const rchallenge = [];
      let rstatus;
      failures.forEach(({ challenge, status }) => {
        rstatus ||= status;
        if (typeof challenge === 'string') {
          rchallenge.push(challenge);
        }
      });

      response.statusCode = rstatus || 401;
      if (response.statusCode === 401 && rchallenge.length) {
        response.setHeader('WWW-Authenticate', rchallenge);
      }
      if (authenticateOptions.failWithError) {
        next(new AuthenticationError(
          /** @type {string} */ (http.STATUS_CODES[response.statusCode]),
          rstatus
        ));
        return;
      }
      response.end(http.STATUS_CODES[response.statusCode]);
    }

    (function attempt(i) {
      const layer = layers[i];
      // If no more strategies exist in the chain, authentication has failed.
      if (!layer) {
        allFailed();
        return;
      }

      // Get the strategy, which will be used as prototype from which to create
      // a new instance.  Action functions will then be bound to the strategy
      // within the context of the HTTP request/response pair.
      /** @type {StrategyLike} */
      let strategy;
      if (typeof layer !== 'string') {
        strategy = layer;
      } else {
        const prototype = passport._strategy(layer);
        if (!prototype) {
          next(new Error(`Unknown authentication strategy "${layer}"`));
          return;
        }

        strategy = Object.create(prototype);
      }

      // ----- BEGIN STRATEGY AUGMENTATION -----
      // Augment the new strategy instance with action functions.  These action
      // functions are bound via closure the the request/response pair.  The end
      // goal of the strategy is to invoke *one* of these action methods, in
      // order to indicate successful or failed authentication, redirect to a
      // third-party identity provider, etc.

      /**
       * @typedef {AuthInfo & MessageInfo} SuccessInfo
       */

      /**
       * Authenticate `user`, with optional `info`.
       *
       * Strategies should call this function to successfully authenticate a
       * user.  `user` should be an object supplied by the application after it
       * has been given an opportunity to verify credentials.  `info` is an
       * optional argument containing additional user information.  This is
       * useful for third-party authentication strategies to pass profile
       * details.
       * @param {User} user
       * @param {SuccessInfo} [info]
       * @public
       * @returns {Promise<void>}
       */
      strategy.success = async function success(user, info) {
        if (callback) {
          callback(null, user, info);
          return;
        }

        info ||= {};

        if (authenticateOptions.successFlash) {
          const flashOption = authenticateOptions.successFlash;
          const flash = typeof flashOption === 'string'
            ? { type: 'success', message: flashOption }
            : typeof flashOption === 'boolean' ? {} : flashOption;
          if (typeof flashOption !== 'boolean') {
            flash.type ||= 'success';
          }

          const type = flash.type || info.type || 'success';
          const msg = flash.message || info.message || info;
          if (typeof msg === 'string') {
            request.flash(type, msg);
          }
        }
        if (authenticateOptions.successMessage) {
          let msg = authenticateOptions.successMessage;
          if (typeof msg === 'boolean') {
            msg = info.message || info;
          }
          if (typeof msg === 'string') {
            request.session ||= {};
            request.session.messages ||= [];
            request.session.messages.push(msg);
          }
        }
        if (authenticateOptions.assignProperty) {
          request[authenticateOptions.assignProperty] = user;
          next();
          return;
        }

        try {
          await request.logIn(user, authenticateOptions);
        } catch (err) {
          next(err);
          return;
        }

        /**
         *
         * @returns {void}
         */
        function complete() {
          if (authenticateOptions.successReturnToOrRedirect) {
            let url = authenticateOptions.successReturnToOrRedirect;
            if (request.session && request.session.returnTo) {
              url = request.session.returnTo;
              delete request.session.returnTo;
            }
            redirect(url);
            return;
          }
          if (authenticateOptions.successRedirect) {
            redirect(authenticateOptions.successRedirect);
            return;
          }
          next();
        }

        if (authenticateOptions.authInfo !== false) {
          try {
            const tinfo = await passport.transformAuthInfo(info, request);
            request.authInfo = /** @type {AuthInfo | undefined} */ (tinfo);
            complete();
          } catch (err) {
            next(err);
            // eslint-disable-next-line no-useless-return -- Guard
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
       * @param {string} [challenge]
       * @param {number} [status]
       * @returns {void}
       * @public
       */
      const fail = function fail(challenge, status) {
        if (typeof challenge === 'number') {
          status = challenge;
          challenge = undefined;
        }

        // push this failure into the accumulator and attempt authentication
        // using the next strategy
        failures.push({ challenge, status });
        attempt(i + 1);
      };
      strategy.fail = /** @type {NonNullable<StrategyLike['fail']>} */ (fail);

      /**
       * Redirect to `url` with optional `status`, defaulting to 302.
       *
       * Strategies should call this function to redirect the user (via their
       * user agent) to a third-party website for authentication.
       * @param {string} url
       * @param {number} [status]
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

        response.statusCode = status || 302;
        response.setHeader('Location', url);
        response.setHeader('Content-Length', '0');
        response.end();
      };

      /**
       * Pass without making a success or fail decision.
       *
       * Under most circumstances, Strategies should not need to call this
       * function.  It exists primarily to allow previous authentication state
       * to be restored, for example from an HTTP session.
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

      strategy.authenticate(request, authenticateOptions);
    }(0)); // attempt
  };
}

export default authenticate;
