export default authenticate;
export type ConnectMiddleware = import("../index.js").ConnectMiddleware;
export type Authenticator = import("../authenticator.js").default;
export type User = import("@passport-next/passport-types").User;
export type AuthInfo = import("@passport-next/passport-types").AuthInfo;
export type StrategyLike = import("@passport-next/passport-strategy").StrategyLike;
export type GenericObject = import("../types.js").GenericObject;
export type AuthenticateMiddleware = ConnectMiddleware;
export type MessageInfo = GenericObject & {
    type?: string;
    message?: string;
};
export type MessageOption = boolean | string | MessageInfo;
export type AuthenticateRequest = import("../index.js").ConnectRequest & import("@passport-next/passport-types").Request & GenericObject & {
    session?: GenericObject & {
        messages?: string[];
        returnTo?: string;
        save?: (done: () => void) => void;
    };
    flash: (type: string, message: string) => void;
    logIn: (user: User, options: AuthenticateOptions) => Promise<void>;
};
export type AuthenticateResponse = import("@passport-next/http-types").ConnectResponse & {
    redirect: (url: string) => void;
};
export type Failure = {
    challenge?: string | MessageInfo;
    status?: number;
};
export type AuthenticateCallback = (error: Error | null, user?: false | import("@passport-next/passport-types").User | undefined, info?: unknown, status?: number | (number | undefined)[] | undefined) => void;
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
 */
export type AuthenticateOptions = GenericObject & {
    successRedirect?: string;
    successMessage?: MessageOption;
    successFlash?: MessageOption;
    failureRedirect?: string;
    failureMessage?: MessageOption;
    failureFlash?: MessageOption;
    failWithError?: boolean;
    assignProperty?: string;
    successReturnToOrRedirect?: string;
    authInfo?: boolean;
};
/**
 * @overload
 * @param {Authenticator} passport
 * @param {string | StrategyLike | Array<string | StrategyLike>} name
 * @param {AuthenticateOptions} [options]
 * @param {AuthenticateCallback} [callback]
 * @returns {AuthenticateMiddleware}
 */
declare function authenticate(passport: Authenticator, name: string | StrategyLike | Array<string | StrategyLike>, options?: AuthenticateOptions | undefined, callback?: AuthenticateCallback | undefined): AuthenticateMiddleware;
/**
 * @overload
 * @param {Authenticator} passport
 * @param {string | StrategyLike | Array<string | StrategyLike>} name
 * @param {AuthenticateCallback} callback
 * @returns {AuthenticateMiddleware}
 */
declare function authenticate(passport: Authenticator, name: string | StrategyLike | Array<string | StrategyLike>, callback: AuthenticateCallback): AuthenticateMiddleware;
