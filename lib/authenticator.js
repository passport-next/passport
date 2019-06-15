'use strict';

/**
 * Module dependencies.
 */

const SessionStrategy = require('./strategies/session');
const SessionManager = require('./sessionmanager');
const connect = require('./framework/connect');


/**
 * The `Authenticator` constructor.
 *
 * @public
 */
class Authenticator {
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
   * Initialize authenticator.
   * @returns {void}
   * @protected
   */
  init() {
    this.framework(connect());
    this.use(new SessionStrategy(this.deserializeUser.bind(this)));
    this._sm = new SessionManager({ key: this._key }, this.serializeUser.bind(this));
  }

  /**
   * Utilize the given `strategy` with optional `name`, overridding the strategy's
   * default name.
   *
   * @example
   *
   *     passport.use(new TwitterStrategy(...args));
   *
   *     passport.use('api', new http.BasicStrategy(...args));
   *
   * @param {string|Strategy} name
   * @param {Strategy} strategy
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
   * @param {object} fw
   * @returns {Authenticator} for chaining
   * @public
   */
  framework(fw) {
    this._framework = fw;
    return this;
  }

  /**
  * @typedef {Object} AuthenticatorInitializeOptions
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
   * @returns {GenericCallback} middleware
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
   * @param {object} options
   * @param {GenericCallback} callback
   * @returns {GenericCallback} middleware
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
   * @param {object} options
   * @param {GenericCallback} callback
   * @returns {GenericCallback} middleware
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
   *     app.use(connect.cookieParser());
   *     app.use(connect.session({ secret: 'keyboard cat' }));
   *     app.use(passport.initialize());
   *     app.use(passport.session());
   *
   * @param {object} options
   * @returns {GenericCallback} middleware
   * @public
   */
  session(options) {
    return this.authenticate('session', options);
  }

  /**
   * Sets a custom SessionManager
   *
   * @example
   *
   *     passport.sessionManager = new CustomSessionManager();
   *
   * @public
   */

  sessionManager(mgr) {
    this._sm = mgr;
    return this;
  }

  /**
   * Registers a function used to serialize user objects into the session.
   *
   * @example
   *
   *     passport.serializeUser(function(user, done) {
   *       done(null, user.id);
   *     });
   *
   * @public
   */

  // eslint-disable-next-line consistent-return
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
    // eslint-disable-next-line consistent-return
    (function pass(i, err, obj) {
      // serializers use 'pass' as an error to skip processing
      if (err === 'pass') {
        err = undefined;
      }
      // an error or serialized object was obtained, done
      if (err || obj || obj === 0) { return done(err, obj); }

      const layer = stack[i];
      if (!layer) {
        return done(new Error('Failed to serialize user into session'));
      }


      // eslint-disable-next-line jsdoc/require-jsdoc
      function serialized(e, o) {
        pass(i + 1, e, o);
      }

      try {
        const arity = layer.length;
        if (arity === 3) {
          layer(req, user, serialized);
        } else {
          layer(user, serialized);
        }
      } catch (e) {
        return done(e);
      }
    }(0));
  }

  /**
   * Registers a function used to deserialize user objects out of the session.
   *
   * @example
   *
   *     passport.deserializeUser(function(id, done) {
   *       User.findById(id, function (err, user) {
   *         done(err, user);
   *       });
   *     });
   *
   * @public
   */

  // eslint-disable-next-line consistent-return
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
    // eslint-disable-next-line consistent-return
    (function pass(i, err, user) {
      // deserializers use 'pass' as an error to skip processing
      if (err === 'pass') {
        err = undefined;
      }
      // an error or deserialized user was obtained, done
      if (err || user) { return done(err, user); }
      // a valid user existed when establishing the session, but that user has
      // since been removed
      if (user === null || user === false) { return done(null, false); }

      const layer = stack[i];
      if (!layer) {
        return done(new Error('Failed to deserialize user out of session'));
      }


      // eslint-disable-next-line jsdoc/require-jsdoc
      function deserialized(e, u) {
        pass(i + 1, e, u);
      }

      try {
        const arity = layer.length;
        if (arity === 3) {
          layer(req, obj, deserialized);
        } else {
          layer(obj, deserialized);
        }
      } catch (e) {
        return done(e);
      }
    }(0));
  }

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
   *     passport.transformAuthInfo(function(info, done) {
   *       Client.findById(info.clientID, function (err, client) {
   *         info.client = client;
   *         done(err, info);
   *       });
   *     });
   *
   * @public
   */

  // eslint-disable-next-line consistent-return
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
    // eslint-disable-next-line consistent-return
    (function pass(i, err, tinfo) {
      // transformers use 'pass' as an error to skip processing
      if (err === 'pass') {
        err = undefined;
      }
      // an error or transformed info was obtained, done
      if (err || tinfo) { return done(err, tinfo); }

      const layer = stack[i];
      if (!layer) {
        // if no transformers are registered (or they all pass), the default
        // behavior is to use the un-transformed info as-is
        return done(null, info);
      }


      // eslint-disable-next-line jsdoc/require-jsdoc
      function transformed(e, t) {
        pass(i + 1, e, t);
      }

      try {
        const arity = layer.length;
        if (arity === 1) {
          // sync
          const t = layer(info);
          transformed(null, t);
        } else if (arity === 3) {
          layer(req, info, transformed);
        } else {
          layer(info, transformed);
        }
      } catch (e) {
        return done(e);
      }
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
