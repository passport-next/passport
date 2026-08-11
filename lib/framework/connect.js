/**
 * @file Module dependencies.
 */

import initialize from '../middleware/initialize.js';
import authenticate from '../middleware/authenticate.js';

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
function connect() {
  return {
    initialize,
    authenticate
  };
}

export default connect;
