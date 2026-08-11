
/**
 * @file Module dependencies.
 */

import SessionStrategy from './strategies/session.js';
import SessionManager from './sessionmanager.js';
import connect from './framework/connect.js';

/**
 * @param {number} fn
 * @param {string} [req]
 * @returns {void}
 */

/**
 * @typedef {import('@passport-next/passport-strategy').Strategy} Strategy
 */

/**
 * @typedef {import('@passport-next/passport-types').Request} Request
 */

/**
 * @typedef {import('@passport-next/passport-types').User} User
 */

/**
 * @typedef {import('@passport-next/passport-types').AuthInfo} AuthInfo
 */

/**
 * @typedef {import('./framework/connect.js').ConnectExpress} ConnectExpress
 */

/**
 * @typedef {import('./middleware/initialize.js').InitializeMiddleware} InitializeMiddleware
 */

/**
 * @typedef {import('./middleware/authenticate.js').AuthenticateOptions} AuthenticateOptions
 */

/**
 * @typedef {import('./middleware/authenticate.js').AuthenticateCallback} AuthenticateCallback
 */

/**
 * @typedef {import('./middleware/authenticate.js').AuthenticateMiddleware} AuthenticateMiddleware
 */

/**
 * @typedef {import('./strategies/session.js').SessionStrategyDeserializeUser}
 *   SessionStrategyDeserializeUser
 */

/**
 * @typedef {import('./sessionmanager.js').SessionManagerSerializeUser}
 *   SessionManagerSerializeUser
 */

/**
 * At module scope rather than on the class so that {@link SessionManager} may
 * import it.
 * @callback SerializeUserDoneCallback
 * @param {null | Error | "pass"} err
 * @param {0|string|false|null} [serializedUser]
 * @returns {void}
 */

/**
 * @callback SerializeUserPass
 * @param {number} index
 * @param {Error | "pass" | false | null} [error]
 * @param {string | 0 | false | null} [serializedUser]
 * @returns {Promise<string | 0 | false | null | void | Error>}
 */

/**
 * @callback DeserializeUserPass
 * @param {number} index
 * @param {Error | "pass" | null} [error]
 * @param {string | User | false | null} [user]
 * @returns {Promise<string | User | false | void | Error>}
 */

/**
 * @callback TransformAuthInfoPass
 * @param {number} index
 * @param {Error | "pass" | null} [error]
 * @param {AuthInfo} [info]
 * @returns {Promise<AuthInfo | void | Error>}
 */

/**
 * @param {unknown} obj
 */
const isThenable = (obj) => {
  return obj && typeof obj === 'object' && 'then' in obj && typeof obj.then === 'function';
};

const protectedRequestProperties = new Set([
  '__proto__',
  '_passport',
  'constructor',
  'isAuthenticated',
  'isUnauthenticated',
  'logIn',
  'logOut',
  'login',
  'logout',
  'prototype'
]);

/**
 * The `Authenticator` constructor.
 * @public
 */
class Authenticator {
  /**
   * @typedef {Strategy & {name?: string}} StrategyWithName
   */

  /* eslint-disable unicorn/prefer-private-class-fields -- Cloning issue? */
  _key = 'passport';

  /** @type {SessionManager|undefined} */
  _sm;

  /** @type {SerializeUserMiddleware[]} */
  _serializers = [];

  /** @type {DeserializeUserMiddleware[]} */
  _deserializers = [];

  /** @type {TransformAuthMiddleware[]} */
  _infoTransformers = [];

  /**
   * @type {Record<string, StrategyWithName>}
   */
  _strategies = {};

  /** @type {ConnectExpress|null} */
  _framework = null;
  _userProperty = 'user';

  /* eslint-enable unicorn/prefer-private-class-fields -- Cloning issue? */

  /**
   * Sets up initial framework (via {@link GetConnectExpress}) and with
   *   {@link SessionStrategy} and {@link SessionManager}.
   */
  constructor() {
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
    const deserializeUser = /** @type {SessionStrategyDeserializeUser} */ (
      /** @type {unknown} */ (this.deserializeUser.bind(this))
    );
    const serializeUser = /** @type {SessionManagerSerializeUser} */ (
      /** @type {unknown} */ (this.serializeUser.bind(this))
    );

    this.use(new SessionStrategy(deserializeUser));
    this._sm = new SessionManager({ key: this._key }, serializeUser);
  }

  /**
   * @overload
   * @param {string} name
   * @param {Strategy} [strategy] The framework supplied by default will augment an
   *   instance made from this strategy instance or prototype with the methods,
   *   `success`, `fail`, `redirect`, `pass`, and `error`. See the source of
   *   {@link authenticate}.
   * @returns {Authenticator} for chaining
   */

  /**
   * @overload
   * @param {Strategy} strategy The framework supplied by default will augment an
   *   instance made from this strategy instance or prototype with the methods,
   *   `success`, `fail`, `redirect`, `pass`, and `error`. See the source of
   *   {@link authenticate}.
   * @returns {Authenticator} for chaining
   */

  /**
   * Utilize the given `strategy` with optional `name`, overriding the strategy's
   * default name.
   * @example
   *
   *     passport.use(new TwitterStrategy(...args));
   *
   *     passport.use('api', new http.BasicStrategy(...args));
   *
   * @param {string|StrategyWithName|undefined} name
   * @param {StrategyWithName} [strategy] The framework supplied by default will augment an
   *   instance made from this strategy instance or prototype with the methods,
   *   `success`, `fail`, `redirect`, `pass`, and `error`. See the source of
   *   {@link authenticate}.
   * @returns {Authenticator} for chaining
   * @public
   */
  use(name, strategy) {
    if (typeof name !== 'string') {
      strategy = name;
      if (strategy) {
        ({ name } = strategy);
      }
    }
    if (typeof name !== 'string') {
      throw new TypeError('Authentication strategies must have a name');
    }
    if (!strategy || typeof strategy !== 'object') {
      throw new TypeError('You must supply a strategy function to `use`');
    }

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
   * @example
   *
   *     import hapiPassport from 'hapi-passport';
   *     passport.framework(hapiPassport());
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
   * @typedef {object} AuthenticatorInitializeOwnOptions
   * @property {string} [userProperty="user"]  Property to set on `req` upon login
   */

  /**
   * An intersection rather than a `@typedef` of `AuthenticateOptions` carrying
   * its own `@property` tags, as the latter silently drops them.
   * @typedef {AuthenticateOptions & AuthenticatorInitializeOwnOptions}
   *   AuthenticatorInitializeOptions
   */

  /**
   * Passport's primary initialization middleware.
   *
   * This middleware must be in use by the Connect/Express application for
   * Passport to operate.
   * @example
   *
   *     app.use(passport.initialize());
   *
   *     app.use(passport.initialize({ userProperty: 'currentUser' }));
   *
   * @param {AuthenticatorInitializeOptions} [options]
   * @returns {InitializeMiddleware} middleware
   * @public
   */
  initialize(options) {
    options ||= {};
    const userProperty = options.userProperty || 'user';
    if (protectedRequestProperties.has(userProperty)) {
      throw new TypeError(`Invalid user property: ${userProperty}`);
    }
    this._userProperty = userProperty;

    return /** @type {ConnectExpress} */ (this._framework).initialize(this, options);
  }

  /**
   * Middleware that will authenticate a request using the given `strategy` name,
   * with optional `options` and `callback`.
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
   * @param {string | Strategy} strategy
   * @param {AuthenticateOptions} [options]
   * @param {AuthenticateCallback} [callback]
   * @returns {AuthenticateMiddleware} middleware
   * @public
   */
  authenticate(strategy, options, callback) {
    return /** @type {ConnectExpress} */ (
      this._framework
    ).authenticate(this, strategy, options, callback);
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
   * @example
   *
   *    passport.authorize('twitter-authz', { failureRedirect: '/account' });
   *
   * @param {string | Strategy} strategy
   * @param {AuthenticateOptions} [options]
   * @param {AuthenticateCallback} [callback]
   * @returns {AuthenticateMiddleware} middleware
   * @public
   */
  authorize(strategy, options, callback) {
    options ||= {};
    options.assignProperty = 'account';

    const framework = /** @type {ConnectExpress} */ (this._framework);

    const fn = framework.authorize || framework.authenticate;
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
   * @example
   *
   *     app.use(expressSession({ secret: 'keyboard cat' }));
   *     app.use(passport.initialize());
   *     app.use(passport.session());
   *
   * @param {AuthenticateOptions} [options]
   * @returns {AuthenticateMiddleware} middleware
   * @public
   */
  session(options) {
    return this.authenticate('session', options);
  }

  /**
   * Sets a custom SessionManager.
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
   * @callback SerializeUserMiddleware
   * @param {Request | undefined} req
   * @param {User} user
   * @param {SerializeUserDoneCallback} serialized
   * @returns {void | "pass" | string | false | null |
   *   0 | Promise<void | string | 0 | null | false>}
   */

  /**
   * @overload
   * @param {SerializeUserMiddleware} fn
   * @returns {void}
   */

  /**
   * @overload
   * @param {User} user
   * @returns {Promise<string | 0 | void>}
   */

  /**
   * @overload
   * @param {User} user
   * @param {SerializeUserDoneCallback} done
   * @returns {Promise<string | 0 | void | Error>}
   */

  /**
   * @overload
   * @param {User} user
   * @param {Request} request
   * @returns {Promise<string | 0 | void>}
   */

  /**
   * @overload
   * @param {User} user
   * @param {Request} request
   * @param {SerializeUserDoneCallback} done
   * @returns {Promise<string | 0 | void | Error>}
   */

  /**
   * Registers a function used to serialize user objects into the session.
   * @example
   *
   *     passport.serializeUser(function (user, done) {
   *       done(null, user.id);
   *     });
   *
   * @public
   * @param {SerializeUserMiddleware | User} fn
   * @param {Request | SerializeUserDoneCallback} [req]
   * @param {SerializeUserDoneCallback} [done]
   * @returns {void|"pass"|string|Error|Promise<string|void|0|null|false|Error>}
   */
  serializeUser(fn, req, done) {
    if (typeof fn === 'function') {
      this._serializers.push(/** @type {SerializeUserMiddleware} */ (fn));
      return undefined;
    }

    // private implementation that traverses the chain of serializers, attempting
    // to serialize a user
    const user = /** @type {User} */ (fn);

    // For backwards compatibility
    if (typeof req === 'function') {
      done = req;
      req = undefined;
    }
    const request = /** @type {Request | undefined} */ (req);

    const stack = this._serializers;

    // Todo: Refactor to use promises exclusively
    const pass = /** @type {SerializeUserPass} */ (async function pass(
      i, err, serializedUser
    ) {
      // serializers use 'pass' as an error to skip processing
      if (err === 'pass' || (err && err.message === 'pass')) {
        err = undefined;
      }
      // an error or serialized object was obtained, done
      if (err || serializedUser || serializedUser === 0) {
        if (done) {
          done(err || null, serializedUser);
        }
        if (!done && err) {
          throw err;
        }
        return err || serializedUser;
      }

      const layer = stack[i];
      if (!layer) {
        const error = new Error('Failed to serialize user into session');
        if (done) {
          done(error);
        } else if (error) {
          throw error;
        }
        return error;
      }

      /** @type {ReturnType<SerializeUserPass> | undefined} */
      let serializedRet;
      /**
       *
       * @param {Error | "pass" | false | null} [e]
       * @param {string | 0 | false | null} [o]
       * @returns {ReturnType<SerializeUserPass>}
       */
      function serialized(e, o) {
        serializedRet = pass(i + 1, e, o);
        return serializedRet;
      }

      let ret;
      try {
        ret = layer(request, user, serialized);
      } catch (serializeError) {
        return serialized(/** @type {Error} */ (serializeError));
      }
      if (isThenable(ret)) {
        try {
          const serializedObject = await ret;
          return serialized(
            null,
            /** @type {string | 0 | false | undefined} */ (serializedObject)
          );
        } catch (serializeError) {
          return serialized(/** @type {Error} */ (serializeError));
        }
      }
      if (ret !== undefined) {
        return serialized(null, /** @type {string | 0} */ (ret));
      }
      if (serializedRet === undefined) {
        pass(i + 1, undefined, undefined);
      }
      return serializedRet;
    });
    return pass(0);
  }

  /**
   * @callback DeserializeUserDoneCallback
   * @param {null | Error | "pass"} err
   * @param {string|User|false|null} [user]
   * @returns {void}
   */

  /**
   * @callback DeserializeUserMiddleware
   * @param {Request | undefined} req
   * @param {string | User | 0} obj
   * @param {DeserializeUserDoneCallback} deserialized
   * @returns {string | User | void | null | false | Promise<string | User | void | null | false>}
   */

  /**
   * @overload
   * @param {DeserializeUserMiddleware} fn
   * @returns {void}
   */

  /**
   * @overload
   * @param {User | string | 0} serializedUser
   * @returns {Promise<string | User | false | void>}
   */

  /**
   * @overload
   * @param {User | string | 0} serializedUser
   * @param {DeserializeUserDoneCallback} done
   * @returns {Promise<string | User | false | void | Error>}
   */

  /**
   * @overload
   * @param {User | string | 0} serializedUser
   * @param {Request} request
   * @returns {Promise<string | User | false | void>}
   */

  /**
   * @overload
   * @param {User | string | 0} serializedUser
   * @param {Request} request
   * @param {DeserializeUserDoneCallback} done
   * @returns {Promise<string | User | false | void | Error>}
   */

  /**
   * Registers a function used to deserialize user objects out of the session.
   * @example
   *
   *     passport.deserializeUser(function (id, done) {
   *       User.findById(id, function (err, user) {
   *         done(err, user);
   *       });
   *     });
   *
   * @public
   * @param {DeserializeUserMiddleware | User | string | 0} fn
   * @param {Request | DeserializeUserDoneCallback} [req]
   * @param {DeserializeUserDoneCallback} [done]
   * @returns {void|Promise<string|User|void|false|Error>}
   */
  deserializeUser(fn, req, done) {
    if (typeof fn === 'function') {
      this._deserializers.push(
        /** @type {DeserializeUserMiddleware} */ (fn)
      );
      return undefined;
    }

    // private implementation that traverses the chain of deserializers,
    // attempting to deserialize a user
    const obj = /** @type {string | 0} */ (fn);

    // For backwards compatibility
    if (typeof req === 'function') {
      done = req;
      req = undefined;
    }
    const request = /** @type {Request | undefined} */ (req);

    const stack = this._deserializers;

    // Todo: Refactor to use promises exclusively
    const pass = /** @type {DeserializeUserPass} */ (async function pass(
      i, err, user
    ) {
      // deserializers use 'pass' as an error to skip processing
      if (err === 'pass' || (err && err.message === 'pass')) {
        err = undefined;
      }
      // an error or deserialized user was obtained, done
      if (err || user) {
        if (done) {
          done(err || null, user || undefined);
        } else if (err) {
          throw err;
        }
        return /** @type {Error | string | User} */ (err || user);
      }
      // a valid user existed when establishing the session, but that user has
      // since been removed
      if (user === null || user === false) {
        if (done) {
          done(null, false);
        }
        return false;
      }

      const layer = stack[i];
      if (!layer) {
        const error = new Error('Failed to deserialize user out of session');
        if (done) {
          done(error);
        } else if (error) {
          throw error;
        }
        return error;
      }

      /** @type {ReturnType<DeserializeUserPass> | undefined} */
      let deserializedRet;
      /**
       *
       * @param {Error | "pass" | null} [e]
       * @param {string | User | false | null} [u]
       * @returns {ReturnType<DeserializeUserPass>}
       */
      function deserialized(e, u) {
        deserializedRet = pass(i + 1, e, u);
        return /** @type {ReturnType<DeserializeUserPass>} */ (deserializedRet);
      }

      let ret;
      try {
        ret = layer(request, obj, deserialized);
      } catch (deserializeError) {
        return deserialized(/** @type {Error} */ (deserializeError));
      }
      if (isThenable(ret)) {
        try {
          const u = await ret;
          return deserialized(
            null,
            /** @type {string | User | false | null | undefined} */ (u)
          );
        } catch (deserializeError) {
          return deserialized(/** @type {Error} */ (deserializeError));
        }
      }
      if (ret !== undefined) {
        return deserialized(
          null,
          /** @type {string | User | false | null} */ (ret)
        );
      }
      if (deserializedRet === undefined) {
        pass(i + 1, undefined, undefined);
      }
      return deserializedRet;
    });
    return pass(0);
  }

  /**
   * @callback TransformAuthDoneCallback
   * @param {null | Error | "pass"} err
   * @param {AuthInfo} [obj]
   * @returns {void}
   */

  /**
   * @callback TransformAuthMiddleware
   * @param {Request | undefined} req
   * @param {AuthInfo} tinfo
   * @param {TransformAuthDoneCallback} transformed
   * @returns {void|"pass"|AuthInfo|Error|Promise<AuthInfo>}
   */

  /**
   * @overload
   * @param {TransformAuthMiddleware} fn
   * @returns {number}
   */

  /**
   * @overload
   * @param {AuthInfo} fn
   * @param {TransformAuthDoneCallback} req
   * @returns {Promise<AuthInfo | void | Error>}
   */

  /**
   * @overload
   * @param {AuthInfo} fn
   * @param {Request} req
   * @param {TransformAuthDoneCallback} [done]
   * @returns {Promise<AuthInfo | void | Error>}
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
   * @param {TransformAuthMiddleware | AuthInfo} fn
   * @param {Request | TransformAuthDoneCallback} [req]
   * @param {TransformAuthDoneCallback} [done]
   * @returns {number | Promise<AuthInfo | void | Error>}
   */
  transformAuthInfo(fn, req, done) {
    if (typeof fn === 'function') {
      this._infoTransformers.push(
        /** @type {TransformAuthMiddleware} */ (fn)
      );
      return this._infoTransformers.length; // Necessary?
    }

    // private implementation that traverses the chain of transformers,
    // attempting to transform auth info
    const info = /** @type {AuthInfo} */ (fn);

    // For backwards compatibility
    if (typeof req === 'function') {
      done = req;
      req = undefined;
    }
    const request = /** @type {Request | undefined} */ (req);

    const stack = this._infoTransformers;

    // Todo: Refactor to use promises exclusively
    const pass = /** @type {TransformAuthInfoPass} */ (async function pass(
      i, err, tinfo
    ) {
      // transformers use 'pass' as an error to skip processing
      if (err === 'pass' || (err && err.message === 'pass')) {
        err = undefined;
      }
      // an error or transformed info was obtained, done
      if (err || tinfo) {
        if (done) {
          done(err || null, tinfo);
        } else if (err) {
          throw err;
        }
        return err || tinfo;
      }

      const layer = stack[i];
      if (!layer) {
        // if no transformers are registered (or they all pass), the default
        // behavior is to use the un-transformed info as-is
        if (done) {
          done(null, info);
        }
        return info;
      }


      /** @type {ReturnType<TransformAuthInfoPass> | undefined} */
      let transformedRet;
      /**
       *
       * @param {Error | "pass" | null} [e]
       * @param {AuthInfo} [t]
       * @returns {ReturnType<TransformAuthInfoPass>}
       */
      function transformed(e, t) {
        transformedRet = pass(i + 1, e, t);
        return transformedRet;
      }

      let ret;
      try {
        ret = layer(request, info, transformed);
      } catch (transformError) {
        return transformed(/** @type {Error} */ (transformError));
      }
      if (isThenable(ret)) {
        try {
          const t = await ret;
          return transformed(null, /** @type {AuthInfo | undefined} */ (t));
        } catch (transformError) {
          return transformed(/** @type {Error} */ (transformError));
        }
      }
      if (ret !== undefined) {
        return transformed(null, /** @type {AuthInfo} */ (ret));
      }
      if (transformedRet === undefined) {
        pass(i + 1, undefined, undefined);
      }
      return transformedRet;
    });
    return pass(0);
  }

  /* eslint-disable unicorn/prefer-private-class-fields -- Need to copy with `Object.create` */
  /**
   * Return strategy with given `name`.
   * @param {string} name
   * @returns {Strategy}
   * @package
   */
  _strategy(name) {
    /* eslint-enable unicorn/prefer-private-class-fields -- Need to copy with `Object.create` */
    return this._strategies[name];
  }
}

/**
 * Expose `Authenticator`.
 */
export default Authenticator;
