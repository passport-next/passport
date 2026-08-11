export namespace strategies {
    export { SessionStrategy };
}
export default index;
export type ConnectRequest = import("@passport-next/http-types").ConnectRequest & import("@passport-next/passport-types").Request;
export type Response = import("@passport-next/http-types").ConnectResponse;
export type ConnectNextCallback = import("@passport-next/http-types").NextFunction;
/**
 * This middleware conforms to Connect/Express middleware by
 * the arguments it accepts.
 */
export type ConnectMiddleware = (req: ConnectRequest, res: Response, next: ConnectNextCallback) => void;
export type AugmentedPassport = Passport & {
    Authenticator: typeof Authenticator;
    Passport: typeof Passport;
    Strategy: typeof Strategy;
    strategies: typeof strategies;
};
import Passport from './authenticator.js';
export const Authenticator: typeof Passport;
import { Strategy } from '@passport-next/passport-strategy';
import { EnhancedStrategy } from '@passport-next/passport-strategy';
import SessionStrategy from './strategies/session.js';
/**
 * Middleware function passed `req`, `res`, and `next`
 * @external ConnectMiddleware
 * @see https://github.com/senchalabs/connect#appusefn
 */
/**
 * @typedef {import('@passport-next/http-types').ConnectRequest &
 *   import('@passport-next/passport-types').Request} ConnectRequest
 */
/**
 * @typedef {import('@passport-next/http-types').ConnectResponse} Response
 */
/**
 * @typedef {import('@passport-next/http-types').NextFunction} ConnectNextCallback
 */
/**
 * This middleware conforms to Connect/Express middleware by
 * the arguments it accepts.
 * @see Conforms to {@link external:ConnectMiddleware}
 * @callback ConnectMiddleware
 * @param {ConnectRequest} req
 * @param {Response} res
 * @param {ConnectNextCallback} next
 * @returns {void}
 */
/**
 * @typedef {Passport & {
 *   Authenticator: typeof Authenticator,
 *   Passport: typeof Passport,
 *   Strategy: typeof Strategy,
 *   strategies: typeof strategies
 * }} AugmentedPassport
 */
/**
 * Export default singleton.
 * @type {AugmentedPassport}
 * @public
 */
declare const index: AugmentedPassport;
export { Passport, Strategy, EnhancedStrategy };
