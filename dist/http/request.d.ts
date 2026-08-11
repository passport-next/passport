export default req;
export type User = import("@passport-next/passport-types").User;
export type Request = import("@passport-next/passport-types").Request;
export type GenericObject = import("../types.js").GenericObject;
export type LogoutCallback = import("../sessionmanager.js").LogoutCallback;
export type LoginDoneCallback = (error?: Error | undefined) => void;
export type LogInOptions = {
    /**
     * Save login state in session.
     */
    session?: boolean | undefined;
};
export type LogIn = (((user: User, done?: LoginDoneCallback) => Promise<void>) & ((user: User, options?: LogInOptions, done?: LoginDoneCallback) => Promise<void>));
export type HttpRequest = Request & GenericObject & {
    _passport?: {
        instance: {
            _userProperty?: string;
            _sm: import("../sessionmanager.js").default;
        };
    };
    logIn: LogIn;
    login: LogIn;
    logOut: (done?: LogoutCallback) => void;
    logout: (done?: LogoutCallback) => void;
    isAuthenticated: () => boolean;
    isUnauthenticated: () => boolean;
};
/**
 * @file Module dependencies.
 */
/**
 * @typedef {import('@passport-next/passport-types').User} User
 */
/**
 * @typedef {import('@passport-next/passport-types').Request} Request
 */
/**
 * @typedef {import('../types.js').GenericObject} GenericObject
 */
/**
 * @typedef {import('../sessionmanager.js').LogoutCallback} LogoutCallback
 */
/**
 * @callback LoginDoneCallback
 * @param {Error} [error]
 * @returns {void}
 */
/**
 * @typedef {object} LogInOptions
 * @property {boolean} [session=true] Save login state in session.
 */
/**
 * @typedef {(
 *   ((user: User, done?: LoginDoneCallback) => Promise<void>) &
 *   ((user: User, options?: LogInOptions, done?: LoginDoneCallback) => Promise<void>)
 * )} LogIn
 */
/**
 * @typedef {Request & GenericObject & {
 *   _passport?: {
 *     instance: {
 *       _userProperty?: string,
 *       _sm: import('../sessionmanager.js').default
 *     }
 *   },
 *   logIn: LogIn,
 *   login: LogIn,
 *   logOut: (done?: LogoutCallback) => void,
 *   logout: (done?: LogoutCallback) => void,
 *   isAuthenticated: () => boolean,
 *   isUnauthenticated: () => boolean
 * }} HttpRequest
 */
declare const req: HttpRequest;
