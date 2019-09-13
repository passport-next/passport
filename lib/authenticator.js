/* eslint-disable promise/prefer-await-to-then */
/* eslint no-unused-expressions: ["error", {allowShortCircuit: true}] */
'use strict';

/**
 * @file Module dependencies.
 */

const SessionStrategy = require('./strategies/session');
const SessionManager = require('./sessionmanager');
const connect = require('./framework/connect');

const isThenable = (obj) => {
  return obj && typeof obj.then === 'function';
};

/**
 * The `Authenticator` constructor.
 * @public
 */
class Authenticator {
  /**
   * Sets up initial framework (via {@link GetConnectExpress}) and with
   *   {@link SessionStrategy} and {@link SessionManager}.
   */
  constructor() {
    this._key = 'passport';
    this._strategies = {};
    this._serializers = [];
    this._deserializers = [];
    this._infoTransformers = [];
    this._framework = null;
    this._userProperty = 'user';

    this.init();
  }

  /**
   * Initialize authenticator. Sets framework internally with return of
   *   {@link GetConnectExpress} though this can be overridden.
   * @returns {void}
   * @protected
   */
  init() {
    this.framework(connect());
    this.use(new SessionStrategy(this.deserializeUser.bind(this)));
    this._sm = new SessionManager({ key: this._key }, this.serializeUser.bind(this));
  }

  /**
   * Utilize the given `strategy` with optional `name`, overriding the strategy's
   * default name.
   *
   * @example
   *
   *     passport.use(new TwitterStrategy(...args));
   *
   *     passport.use('api', new http.BasicStrategy(...args));
   *
   * @param {string|Strategy} [name]
   * @param {Strategy} strategy The framework supplied by default will augment an
   *   instance made from this strategy instance or prototype with the methods,
   *   `success`, `fail`, `redirect`, `pass`, and `error`. See the source of
   *   {@link authenticate}.
   * @returns {Authenticator} for chaining
   * @public
   */
  use(name, strategy) {
    if (!strategy) {
      strategy = name;
      ({ name } = strategy);
    }
    if (!name) { throw new Error('Authentication strategies must have a name'); }

    this._strategies[name] = strategy;
    return this;
  }

  /**
   * Un-utilize the `strategy` with given `name`.
   *
   * In typical applications, the necessary authentication strategies are static,
   * configured once and always available.  As such, there is often no need to
   * invoke this function.
   *
   * However, in certain situations, applications may need dynamically configure
   * and de-configure authentication strategies.  The `use()`/`unuse()`
   * combination satisfies these scenarios.
   *
   * @example
   *
   *     passport.unuse('legacy-api');
   *
   * @param {string} name
   * @returns {Authenticator} for chaining
   * @public
   */
  unuse(name) {
    delete this._strategies[name];
    return this;
  }

  /**
   * Setup Passport to be used under framework.
   *
   * By default, Passport exposes middleware that operate using Connect-style
   * middleware using a `fn(req, res, next)` signature.  Other popular frameworks
   * have different expectations, and this function allows Passport to be adapted
   * to operate within such environments.
   *
   * If you are using a Connect-compatible framework, including Express, there is
   * no need to invoke this function.
   *
   * @example
   *
   *     passport.framework(require('hapi-passport')());
   *
   * @param {ConnectExpress} fw
   * @returns {Authenticator} for chaining
   * @public
   */
  framework(fw) {
    this._framework = fw;
    return this;
  }

  /**
  * @typedef {AuthenticateOptions} AuthenticatorInitializeOptions
  * @property {string} [userProperty="user"]  Property to set on `req` upon login
  */

  /**
   * Passport's primary initialization middleware.
   *
   * This middleware must be in use by the Connect/Express application for
   * Passport to operate.
   *
   * @example
   *
   *     app.use(passport.initialize());
   *
   *     app.use(passport.initialize({ userProperty: 'currentUser' }));
   *
   * @param {AuthenticatorInitializeOptions} options
   * @returns {InitializeMiddleware} middleware
   * @public
   */
  initialize(options) {
    options = options || {};
    this._userProperty = options.userProperty || 'user';

    return this._framework.initialize(this, options);
  }

  /**
   * Middleware that will authenticate a request using the given `strategy` name,
   * with optional `options` and `callback`.
   *
   * @example
   *
   *     passport.authenticate('local', {
   *        successRedirect: '/',
   *        failureRedirect: '/login'
   *     })(req, res);
   *
   *     passport.authenticate('local', (err, user) => {
   *       if (err) { next(err); return; }
   *       if (!user) { res.redirect('/login'); return; }
   *       res.end('Authenticated!');
   *     })(req, res);
   *
   *     passport.authenticate('basic', { session: false })(req, res);
   *
   *     app.get('/auth/twitter', passport.authenticate('twitter'), (req, res) => {
   *       // request will be redirected to Twitter
   *     });
   *     app.get('/auth/twitter/callback', passport.authenticate('twitter'), (req, res) => {
   *       res.json(req.user);
   *     });
   *
   * @param {string} strategy
   * @param {AuthenticateOptions} options
   * @param {AuthenticateCallback} callback
   * @returns {AuthenticateMiddleware} middleware
   * @public
   */
  authenticate(strategy, options, callback) {
    return this._framework.authenticate(this, strategy, options, callback);
  }

  /**
   * Middleware that will authorize a third-party account using the given
   * `strategy` name, with optional `options`.
   *
   * If authorization is successful, the result provided by the strategy's verify
   * callback will be assigned to `req.account`.  The existing login session and
   * `req.user` will be unaffected.
   *
   * This function is particularly useful when connecting third-party accounts
   * to the local account of a user that is currently authenticated.
   *
   * @example
   *
   *    passport.authorize('twitter-authz', { failureRedirect: '/account' });
   *
   * @param {string} strategy
   * @param {AuthenticateOptions} options
   * @param {AuthenticateCallback} callback
   * @returns {AuthenticateMiddleware} middleware
   * @public
   */
  authorize(strategy, options, callback) {
    options = options || {};
    options.assignProperty = 'account';

    const fn = this._framework.authorize || this._framework.authenticate;
    return fn(this, strategy, options, callback);
  }

  /**
   * Middleware that will restore login state from a session.
   *
   * Web applications typically use sessions to maintain login state between
   * requests.  For example, a user will authenticate by entering credentials into
   * a form which is submitted to the server.  If the credentials are valid, a
   * login session is established by setting a cookie containing a session
   * identifier in the user's web browser.  The web browser will send this cookie
   * in subsequent requests to the server, allowing a session to be maintained.
   *
   * If sessions are being utilized, and a login session has been established,
   * this middleware will populate `req.user` with the current user.
   *
   * Note that sessions are not strictly required for Passport to operate.
   * However, as a general rule, most web applications will make use of sessions.
   * An exception to this rule would be an API server, which expects each HTTP
   * request to provide credentials in an Authorization header.
   *
   * @example
   *
   *     app.use(expressSession({ secret: 'keyboard cat' }));
   *     app.use(passport.initialize());
   *     app.use(passport.session());
   *
   * @param {AuthenticateOptions} options
   * @returns {AuthenticateMiddleware} middleware
   * @public
   */
  session(options) {
    return this.authenticate('session', options);
  }

  /**
   * Sets a custom SessionManager.
   *
   * @example
   *
   *     passport.sessionManager = new CustomSessionManager();
   *
   * @public
   * @param {SessionManager} mgr
   * @returns {Authenticator}
   */
  sessionManager(mgr) {
    this._sm = mgr;
    return this;
  }

  /**
  * @typedef {PlainObject} User
  */

  /**
  * @callback SerializeUserDoneCallback
  * @param {null|Error} err
  * @param {0|string} serializedUser
  * @returns {void}
  */

  /**
  * @callback SerializeUserMiddleware
  * @param {Request} req
  * @param {User} user
  * @param {SerializeUserDoneCallback} serialized
  * @returns {void|"pass"|string|Error|Promise<string|void>}
  */

  /**
   * Registers a function used to serialize user objects into the session.
   *
   * @example
   *
   *     passport.serializeUser(function (user, done) {
   *       done(null, user.id);
   *     });
   *
   * @public
   * @param {SerializeUserMiddleware} fn
   * @param {Request} req
   * @param {SerializeUserDoneCallback} [done]
   * @returns {void|"pass"|string|Error|Promise<string|void|0>}
   */
  serializeUser(fn, req, done) {
    if (typeof fn === 'function') {
      return this._serializers.push(fn);
    }

    // private implementation that traverses the chain of serializers, attempting
    // to serialize a user
    const user = fn;

    // For backwards compatibility
    if (typeof req === 'function') {
      done = req;
      req = undefined;
    }

    const stack = this._serializers;

    // Todo: Refactor to use promises exclusively
    return (async function pass(i, err, serializedUser) {
      // serializers use 'pass' as an error to skip processing
      if (err === 'pass' || (err && err.message === 'pass')) {
        err = undefined;
      }
      // an error or serialized object was obtained, done
      if (err || serializedUser || serializedUser === 0) {
        done && done(err, serializedUser);
        if (!done && err) {
          throw err;
        }
        return err || serializedUser;
      }

      const layer = stack[i];
      if (!layer) {
        const error = new Error('Failed to serialize user into session');
        done && done(error);
        if (!done && error) {
          throw error;
        }
        return error;
      }

      let serializedRet;
      /**
       *
       * @param {Error} [e]
       * @param {void|"pass"|string} [o]
       * @returns {void|"pass"|string|Error|Promise<string|void|0>}
       */
      function serialized(e, o) {
        serializedRet = pass(i + 1, e, o);
        return serializedRet;
      }

      let ret;
      try {
        ret = layer(req, user, serialized);
      } catch (serializeError) {
        return serialized(serializeError);
      }
      if (isThenable(ret)) {
        try {
          const serializedObject = await ret;
          return serialized(null, serializedObject);
        } catch (serializeError) {
          return serialized(serializeError);
        }
      }
      if (ret !== undefined) {
        return serialized(null, ret);
      }
      if (serializedRet === undefined) {
        pass(i + 1);
      }
      return serializedRet;
    }(0));
  }

  /**
  * @callback DeserializeUserDoneCallback
  * @param {null|Error} err
  * @param {User} user
  * @returns {void}
  */

  /**
  * @callback DeserializeUserMiddleware
  * @param {Request} req
  * @param {string} obj
  * @param {DeserializeUserDoneCallback} deserialized
  * @returns {void|null|false|"pass"|Error|Promise<string|null|false>}
  */

  /**
   * Registers a function used to deserialize user objects out of the session.
   *
   * @example
   *
   *     passport.deserializeUser(function (id, done) {
   *       User.findById(id, function (err, user) {
   *         done(err, user);
   *       });
   *     });
   *
   * @public
   * @param {DeserializeUserMiddleware} fn
   * @param {Request} req
   * @param {DeserializeUserDoneCallback} [done]
   * @returns {Promise<User|void|false>}
   */
  deserializeUser(fn, req, done) {
    if (typeof fn === 'function') {
      return this._deserializers.push(fn);
    }

    // private implementation that traverses the chain of deserializers,
    // attempting to deserialize a user
    const obj = fn;

    // For backwards compatibility
    if (typeof req === 'function') {
      done = req;
      req = undefined;
    }

    const stack = this._deserializers;

    // Todo: Refactor to use promises exclusively
    return (async function pass(i, err, user) {
      // deserializers use 'pass' as an error to skip processing
      if (err === 'pass' || (err && err.message === 'pass')) {
        err = undefined;
      }
      // an error or deserialized user was obtained, done
      if (err || user) {
        done && done(err, user);
        if (!done && err) {
          throw err;
        }
        return err || user;
      }
      // a valid user existed when establishing the session, but that user has
      // since been removed
      if (user === null || user === false) {
        done && done(null, false);
        return false;
      }

      const layer = stack[i];
      if (!layer) {
        const error = new Error('Failed to deserialize user out of session');
        done && done(error);
        if (!done && error) {
          throw error;
        }
        return error;
      }

      let deserializedRet;
      /**
       *
       * @param {Error} [e]
       * @param {User|void|"pass"|false} [u]
       * @returns {User|void|null|false|Error|Promise<User|void|null|false>}
       */
      function deserialized(e, u) {
        deserializedRet = pass(i + 1, e, u);
        return deserializedRet;
      }

      let ret;
      try {
        ret = layer(req, obj, deserialized);
      } catch (deserializeError) {
        return deserialized(deserializeError);
      }
      if (isThenable(ret)) {
        try {
          const u = await ret;
          return deserialized(null, u);
        } catch (deserializeError) {
          return deserialized(deserializeError);
        }
      }
      if (ret !== undefined) {
        return deserialized(null, ret);
      }
      if (deserializedRet === undefined) {
        pass(i + 1);
      }
      return deserializedRet;
    }(0));
  }

  /**
  * @typedef {PlainObject} AuthInfo
  */

  /**
  * @callback TransformAuthDoneCallback
  * @param {null|Error} err
  * @param {AuthInfo} obj
  * @returns {void}
  */

  /**
  * @callback TransformAuthMiddleware
  * @param {Request} req
  * @param {AuthInfo} tinfo
  * @param {TransformAuthDoneCallback} transformed
  * @returns {void|"pass"|AuthInfo|Error|Promise<AuthInfo>}
  */

  /**
   * Registers a function used to transform auth info.
   *
   * In some circumstances authorization details are contained in authentication
   * credentials or loaded as part of verification.
   *
   * For example, when using bearer tokens for API authentication, the tokens may
   * encode (either directly or indirectly in a database), details such as scope
   * of access or the client to which the token was issued.
   *
   * Such authorization details should be enforced separately from authentication.
   * Because Passport deals only with the latter, this is the responsiblity of
   * middleware or routes further along the chain.  However, it is not optimal to
   * decode the same data or execute the same database query later.  To avoid
   * this, Passport accepts optional `info` along with the authenticated `user`
   * in a strategy's `success()` action.  This info is set at `req.authInfo`,
   * where said later middlware or routes can access it.
   *
   * Optionally, applications can register transforms to proccess this info,
   * which take effect prior to `req.authInfo` being set.  This is useful, for
   * example, when the info contains a client ID.  The transform can load the
   * client from the database and include the instance in the transformed info,
   * allowing the full set of client properties to be convieniently accessed.
   *
   * If no transforms are registered, `info` supplied by the strategy will be left
   * unmodified.
   *
   * @example
   *
   *     passport.transformAuthInfo(function (info, done) {
   *       Client.findById(info.clientID, function (err, client) {
   *         info.client = client;
   *         done(err, info);
   *       });
   *     });
   *
   * @public
   * @param {TransformAuthMiddleware} fn
   * @param {Request} req
   * @param {TransformAuthDoneCallback} [done]
   * @returns {Promise<AuthInfo|void>}
   */
  transformAuthInfo(fn, req, done) {
    if (typeof fn === 'function') {
      return this._infoTransformers.push(fn);
    }

    // private implementation that traverses the chain of transformers,
    // attempting to transform auth info
    const info = fn;

    // For backwards compatibility
    if (typeof req === 'function') {
      done = req;
      req = undefined;
    }

    const stack = this._infoTransformers;

    // Todo: Refactor to use promises exclusively
    return (async function pass(i, err, tinfo) {
      // transformers use 'pass' as an error to skip processing
      if (err === 'pass' || (err && err.message === 'pass')) {
        err = undefined;
      }
      // an error or transformed info was obtained, done
      if (err || tinfo) {
        done && done(err, tinfo);
        if (!done && err) {
          throw err;
        }
        return err || tinfo;
      }

      const layer = stack[i];
      if (!layer) {
        // if no transformers are registered (or they all pass), the default
        // behavior is to use the un-transformed info as-is
        done && done(null, info);
        return info;
      }


      let transformedRet;
      /**
       *
       * @param {Error} [e]
       * @param {AuthInfo|void|"pass"} [t]
       * @returns {AuthInfo|void|Promise<AuthInfo|void>}
       */
      function transformed(e, t) {
        transformedRet = pass(i + 1, e, t);
        return transformedRet;
      }

      let ret;
      try {
        ret = layer(req, info, transformed);
      } catch (transformError) {
        return transformed(transformError);
      }
      if (isThenable(ret)) {
        try {
          const t = await ret;
          return transformed(null, t);
        } catch (transformError) {
          return transformed(transformError);
        }
      }
      if (ret !== undefined) {
        return transformed(null, ret);
      }
      if (transformedRet === undefined) {
        pass(i + 1);
      }
      return transformedRet;
    }(0));
  }

  /**
   * Return strategy with given `name`.
   *
   * @param {string} name
   * @returns {Strategy}
   * @private
   */
  _strategy(name) {
    return this._strategies[name];
  }
}

/**
 * Expose `Authenticator`.
 */
module.exports = Authenticator;
