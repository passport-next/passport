export default SessionManager;
export type Request = import("@passport-next/passport-types").Request;
export type User = import("@passport-next/passport-types").User;
export type GenericObject = import("./types.js").GenericObject;
export type SerializeUserDoneCallback = import("./authenticator.js").SerializeUserDoneCallback;
export type PassportSession = GenericObject & {
    user?: unknown;
};
export type PassportState = GenericObject & {
    session?: PassportSession;
};
export type SessionRequest = Request & GenericObject & {
    session?: GenericObject;
    _passport?: PassportState;
};
export type InitializedSessionRequest = SessionRequest & {
    _passport: PassportState;
};
export type SessionManagerOptions = {
    key?: string | undefined;
};
/**
 * At module scope rather than on the class so that {@link HttpRequest} may
 * import it.
 */
export type LogoutCallback = () => void;
export type SessionManagerSerializeUser = (user: User, req: Request, done?: import("./authenticator.js").SerializeUserDoneCallback | undefined) => string | void | Error | Promise<string | void | 0>;
/**
 * @typedef {import('@passport-next/passport-types').Request} Request
 */
/**
 * @typedef {import('@passport-next/passport-types').User} User
 */
/**
 * @typedef {import('./types.js').GenericObject} GenericObject
 */
/**
 * @typedef {import('./authenticator.js').SerializeUserDoneCallback}
 *   SerializeUserDoneCallback
 */
/**
 * @typedef {GenericObject & {user?: unknown}} PassportSession
 */
/**
 * @typedef {GenericObject & {session?: PassportSession}} PassportState
 */
/**
 * @typedef {Request & GenericObject & {
 *   session?: GenericObject,
 *   _passport?: PassportState
 * }} SessionRequest
 */
/**
 * @typedef {SessionRequest & {_passport: PassportState}}
 *   InitializedSessionRequest
 */
/**
 * @typedef {object} SessionManagerOptions
 * @property {string} [key="passport"]
 */
/**
 * At module scope rather than on the class so that {@link HttpRequest} may
 * import it.
 * @callback LogoutCallback
 * @returns {void}
 */
/**
 * @callback SessionManagerSerializeUser
 * @param {User} user
 * @param {Request} req
 * @param {SerializeUserDoneCallback} [done]
 * @returns {string|void|Error|Promise<string|void|0>}
 */
/**
 * Manages login and logout of sessions.
 */
declare class SessionManager {
    /**
     * @overload
     * @param {SessionManagerSerializeUser} serializeUser
     */
    constructor(serializeUser: SessionManagerSerializeUser);
    /**
     * @overload
     * @param {SessionManagerOptions} options
     * @param {SessionManagerSerializeUser} serializeUser
     */
    constructor(options: SessionManagerOptions, serializeUser: SessionManagerSerializeUser);
    _key: string;
    _serializeUser: SessionManagerSerializeUser;
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
    logIn(req: Request, user: User, cb?: (err?: Error | undefined) => void): Promise<void>;
    /**
     *
     * @param {Request} req
     * @param {LogoutCallback} [cb]
     * @returns {void}
     */
    logOut(req: Request, cb?: LogoutCallback): void;
}
