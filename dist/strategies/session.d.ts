export default SessionStrategy;
export type Request = import("@passport-next/passport-types").Request;
export type User = import("@passport-next/passport-types").User;
export type GenericObject = import("../types.js").GenericObject;
export type PassportSession = GenericObject & {
    user?: string | 0;
};
export type SessionRequest = Request & GenericObject & {
    _passport?: {
        instance: {
            _userProperty?: string;
        };
        session?: PassportSession;
    };
};
/**
 * Not presently in use.
 */
export type SessionStrategyOptions = object;
export type SessionStrategyDeserializeUser = (user: string | 0, req: Request) => User | false | Promise<User | false>;
/**
 * @typedef {import('@passport-next/passport-types').Request} Request
 */
/**
 * @typedef {import('@passport-next/passport-types').User} User
 */
/**
 * @typedef {import('../types.js').GenericObject} GenericObject
 */
/**
 * @typedef {GenericObject & {user?: string | 0}} PassportSession
 */
/**
 * @typedef {Request & GenericObject & {
 *   _passport?: {
 *     instance: {_userProperty?: string},
 *     session?: PassportSession
 *   }
 * }} SessionRequest
 */
/**
 * Not presently in use.
 * @typedef {object} SessionStrategyOptions
 */
/**
 * @callback SessionStrategyDeserializeUser
 * @param {string|0} user
 * @param {Request} req
 * @returns {User | false | Promise<User | false>}
 */
/**
 * The `SessionStrategy` constructor.
 * @public
 */
declare class SessionStrategy extends EnhancedStrategy {
    /** @overload */
    constructor();
    /**
     * @overload
     * @param {SessionStrategyDeserializeUser} deserializeUser
     */
    constructor(deserializeUser: SessionStrategyDeserializeUser);
    /**
     * @overload
     * @param {SessionStrategyOptions} options
     * @param {SessionStrategyDeserializeUser} deserializeUser
     */
    constructor(options: SessionStrategyOptions, deserializeUser: SessionStrategyDeserializeUser);
    name: string;
    _deserializeUser: SessionStrategyDeserializeUser;
    /**
     * Not currently in use.
     * @typedef {GenericObject} SessionStrategyAuthenticateOptions
     */
    /**
     * Authenticate request based on the current session state.
     *
     * The session authentication strategy uses the session to restore any login
     * state across requests.  If a login session has been established, `req.user`
     * will be populated with the current user.
     *
     * This strategy is registered automatically by Passport.
     * @param {Request} req
     * @param {SessionStrategyAuthenticateOptions} options
     * @returns {Promise<void>} May return value of `this.error()`
     */
    authenticate(req: Request, options: import("../types.js").GenericObject): Promise<void>;
}
import { EnhancedStrategy } from '@passport-next/passport-strategy';
