export default Authenticator;
export type Strategy = import("@passport-next/passport-strategy").Strategy;
export type Request = import("@passport-next/passport-types").Request;
export type User = import("@passport-next/passport-types").User;
export type AuthInfo = import("@passport-next/passport-types").AuthInfo;
export type ConnectExpress = import("./framework/connect.js").ConnectExpress;
export type InitializeMiddleware = import("./middleware/initialize.js").InitializeMiddleware;
export type AuthenticateOptions = import("./middleware/authenticate.js").AuthenticateOptions;
export type AuthenticateCallback = import("./middleware/authenticate.js").AuthenticateCallback;
export type AuthenticateMiddleware = import("./middleware/authenticate.js").AuthenticateMiddleware;
export type SessionStrategyDeserializeUser = import("./strategies/session.js").SessionStrategyDeserializeUser;
export type SessionManagerSerializeUser = import("./sessionmanager.js").SessionManagerSerializeUser;
/**
 * At module scope rather than on the class so that {@link SessionManager} may
 * import it.
 */
export type SerializeUserDoneCallback = (err: null | Error | "pass", serializedUser?: string | false | 0 | null | undefined) => void;
export type SerializeUserPass = (index: number, error?: false | Error | "pass" | null | undefined, serializedUser?: string | false | 0 | null | undefined) => Promise<string | 0 | false | null | void | Error>;
export type DeserializeUserPass = (index: number, error?: Error | "pass" | null | undefined, user?: string | false | import("@passport-next/passport-types").User | null | undefined) => Promise<string | User | false | void | Error>;
export type TransformAuthInfoPass = (index: number, error?: Error | "pass" | null | undefined, info?: import("@passport-next/passport-types").AuthInfo | undefined) => Promise<AuthInfo | void | Error>;
/**
 * The `Authenticator` constructor.
 * @public
 */
declare class Authenticator {
    /**
     * @typedef {Strategy & {name?: string}} StrategyWithName
     */
    _key: string;
    /** @type {SessionManager|undefined} */
    _sm: SessionManager | undefined;
    /** @type {SerializeUserMiddleware[]} */
    _serializers: ((req: Request | undefined, user: User, serialized: SerializeUserDoneCallback) => void | "pass" | string | false | null | 0 | Promise<void | string | 0 | null | false>)[];
    /** @type {DeserializeUserMiddleware[]} */
    _deserializers: ((req: Request | undefined, obj: string | User | 0, deserialized: (err: null | Error | "pass", user?: string | false | import("@passport-next/passport-types").User | null | undefined) => void) => string | User | void | null | false | Promise<string | User | void | null | false>)[];
    /** @type {TransformAuthMiddleware[]} */
    _infoTransformers: ((req: Request | undefined, tinfo: AuthInfo, transformed: (err: null | Error | "pass", obj?: import("@passport-next/passport-types").AuthInfo | undefined) => void) => void | "pass" | AuthInfo | Error | Promise<AuthInfo>)[];
    /**
     * @type {Record<string, StrategyWithName>}
     */
    _strategies: Record<string, import("@passport-next/passport-strategy").Strategy & {
        name?: string;
    }>;
    /** @type {ConnectExpress|null} */
    _framework: ConnectExpress | null;
    _userProperty: string;
    /**
     * Initialize authenticator. Sets framework internally with return of
     *   {@link GetConnectExpress} though this can be overridden.
     * @returns {void}
     * @protected
     */
    protected init(): void;
    /**
     * @overload
     * @param {string} name
     * @param {Strategy} [strategy] The framework supplied by default will augment an
     *   instance made from this strategy instance or prototype with the methods,
     *   `success`, `fail`, `redirect`, `pass`, and `error`. See the source of
     *   {@link authenticate}.
     * @returns {Authenticator} for chaining
     */
    public use(name: string, strategy?: import("@passport-next/passport-strategy").Strategy | undefined): Authenticator;
    /**
     * @overload
     * @param {Strategy} strategy The framework supplied by default will augment an
     *   instance made from this strategy instance or prototype with the methods,
     *   `success`, `fail`, `redirect`, `pass`, and `error`. See the source of
     *   {@link authenticate}.
     * @returns {Authenticator} for chaining
     */
    public use(strategy: Strategy): Authenticator;
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
    public unuse(name: string): Authenticator;
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
    public framework(fw: ConnectExpress): Authenticator;
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
    public initialize(options?: import("./types.js").GenericObject & {
        successRedirect?: string;
        successMessage?: import("./middleware/authenticate.js").MessageOption;
        successFlash?: import("./middleware/authenticate.js").MessageOption;
        failureRedirect?: string;
        failureMessage?: import("./middleware/authenticate.js").MessageOption;
        failureFlash?: import("./middleware/authenticate.js").MessageOption;
        failWithError?: boolean;
        assignProperty?: string;
        successReturnToOrRedirect?: string;
        authInfo?: boolean;
    } & {
        /**
         * Property to set on `req` upon login
         */
        userProperty?: string | undefined;
    }): InitializeMiddleware;
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
    public authenticate(strategy: string | Strategy, options?: AuthenticateOptions, callback?: AuthenticateCallback): AuthenticateMiddleware;
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
    public authorize(strategy: string | Strategy, options?: AuthenticateOptions, callback?: AuthenticateCallback): AuthenticateMiddleware;
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
    public session(options?: AuthenticateOptions): AuthenticateMiddleware;
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
    public sessionManager(mgr: SessionManager): Authenticator;
    /**
     * @overload
     * @param {SerializeUserMiddleware} fn
     * @returns {void}
     */
    public serializeUser(fn: (req: Request | undefined, user: User, serialized: SerializeUserDoneCallback) => void | "pass" | string | false | null | 0 | Promise<void | string | 0 | null | false>): void;
    /**
     * @overload
     * @param {User} user
     * @returns {Promise<string | 0 | void>}
     */
    public serializeUser(user: User): Promise<string | 0 | void>;
    /**
     * @overload
     * @param {User} user
     * @param {SerializeUserDoneCallback} done
     * @returns {Promise<string | 0 | void | Error>}
     */
    public serializeUser(user: User, done: SerializeUserDoneCallback): Promise<string | 0 | void | Error>;
    /**
     * @overload
     * @param {User} user
     * @param {Request} request
     * @returns {Promise<string | 0 | void>}
     */
    public serializeUser(user: User, request: Request): Promise<string | 0 | void>;
    /**
     * @overload
     * @param {User} user
     * @param {Request} request
     * @param {SerializeUserDoneCallback} done
     * @returns {Promise<string | 0 | void | Error>}
     */
    public serializeUser(user: User, request: Request, done: SerializeUserDoneCallback): Promise<string | 0 | void | Error>;
    /**
     * @overload
     * @param {DeserializeUserMiddleware} fn
     * @returns {void}
     */
    public deserializeUser(fn: (req: Request | undefined, obj: string | User | 0, deserialized: (err: null | Error | "pass", user?: string | false | import("@passport-next/passport-types").User | null | undefined) => void) => string | User | void | null | false | Promise<string | User | void | null | false>): void;
    /**
     * @overload
     * @param {User | string | 0} serializedUser
     * @returns {Promise<string | User | false | void>}
     */
    public deserializeUser(serializedUser: User | string | 0): Promise<string | User | false | void>;
    /**
     * @overload
     * @param {User | string | 0} serializedUser
     * @param {DeserializeUserDoneCallback} done
     * @returns {Promise<string | User | false | void | Error>}
     */
    public deserializeUser(serializedUser: User | string | 0, done: (err: null | Error | "pass", user?: string | false | import("@passport-next/passport-types").User | null | undefined) => void): Promise<string | User | false | void | Error>;
    /**
     * @overload
     * @param {User | string | 0} serializedUser
     * @param {Request} request
     * @returns {Promise<string | User | false | void>}
     */
    public deserializeUser(serializedUser: User | string | 0, request: Request): Promise<string | User | false | void>;
    /**
     * @overload
     * @param {User | string | 0} serializedUser
     * @param {Request} request
     * @param {DeserializeUserDoneCallback} done
     * @returns {Promise<string | User | false | void | Error>}
     */
    public deserializeUser(serializedUser: User | string | 0, request: Request, done: (err: null | Error | "pass", user?: string | false | import("@passport-next/passport-types").User | null | undefined) => void): Promise<string | User | false | void | Error>;
    /**
     * @overload
     * @param {TransformAuthMiddleware} fn
     * @returns {number}
     */
    public transformAuthInfo(fn: (req: Request | undefined, tinfo: AuthInfo, transformed: (err: null | Error | "pass", obj?: import("@passport-next/passport-types").AuthInfo | undefined) => void) => void | "pass" | AuthInfo | Error | Promise<AuthInfo>): number;
    /**
     * @overload
     * @param {AuthInfo} fn
     * @param {TransformAuthDoneCallback} req
     * @returns {Promise<AuthInfo | void | Error>}
     */
    public transformAuthInfo(fn: AuthInfo, req: (err: null | Error | "pass", obj?: import("@passport-next/passport-types").AuthInfo | undefined) => void): Promise<AuthInfo | void | Error>;
    /**
     * @overload
     * @param {AuthInfo} fn
     * @param {Request} req
     * @param {TransformAuthDoneCallback} [done]
     * @returns {Promise<AuthInfo | void | Error>}
     */
    public transformAuthInfo(fn: AuthInfo, req: Request, done?: ((err: null | Error | "pass", obj?: import("@passport-next/passport-types").AuthInfo | undefined) => void) | undefined): Promise<AuthInfo | void | Error>;
    /**
     * Return strategy with given `name`.
     * @param {string} name
     * @returns {Strategy}
     * @package
     */
    _strategy(name: string): Strategy;
}
import SessionManager from './sessionmanager.js';
