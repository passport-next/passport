export default connect;
export type ConnectExpress = {
    initialize: (passport: import("../authenticator.js").default, options?: unknown) => import("../middleware/initialize.js").InitializeMiddleware;
    authenticate: typeof authenticate;
    authorize?: typeof authenticate | undefined;
};
/**
 * Framework support for Connect/Express.
 *
 * This module provides support for using Passport with Express.  It exposes
 * middleware that conform to the `fn(req, res, next)` signature.
 */
export type GetConnectExpress = () => ConnectExpress;
/**
 * @typedef {object} ConnectExpress
 * @property {(
 *   passport: import('../authenticator.js').default,
 *   options?: unknown
 * ) => import('../middleware/initialize.js').InitializeMiddleware} initialize
 * @property {typeof authenticate} authenticate
 * @property {typeof authenticate} [authorize]
 */
/**
 * Framework support for Connect/Express.
 *
 * This module provides support for using Passport with Express.  It exposes
 * middleware that conform to the `fn(req, res, next)` signature.
 * @callback GetConnectExpress
 * @returns {ConnectExpress}
 * @protected
 */
declare function connect(): {
    initialize: typeof initialize;
    authenticate: typeof authenticate;
};
import authenticate from '../middleware/authenticate.js';
import initialize from '../middleware/initialize.js';
