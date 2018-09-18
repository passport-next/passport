/**
 * Module dependencies.
 */
/* eslint-disable camelcase, no-proto, no-shadow */

const initialize = require('../middleware/initialize');
const authenticate = require('../middleware/authenticate');
/**
 * Framework support for Connect/Express.
 *
 * This module provides support for using Passport with Express.  It exposes
 * middleware that conform to the `fn(req, res, next)` signature and extends
 * Node's built-in HTTP request object with useful authentication-related
 * functions.
 *
 * @return {Object}
 * @api protected
 */

// eslint-disable-next-line no-multi-assign, func-names
exports = module.exports = function () {
  return {
    initialize,
    authenticate,
  };
};
