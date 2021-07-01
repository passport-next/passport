'use strict';

/**
 * @file Module dependencies.
 */

const initialize = require('../middleware/initialize.js');
const authenticate = require('../middleware/authenticate.js');

/**
* @typedef {PlainObject} ConnectExpress
* @property {initialize} initialize
* @property {authenticate} authenticate
* @property {authenticate} [authorize]
*/

/* eslint-disable no-multi-assign, func-names */
/**
 * Framework support for Connect/Express.
 *
 * This module provides support for using Passport with Express.  It exposes
 * middleware that conform to the `fn(req, res, next)` signature.
 * @callback GetConnectExpress
 * @returns {ConnectExpress}
 * @protected
 */
exports = module.exports = function () {
  /* eslint-enable no-multi-assign, func-names */
  return {
    initialize,
    authenticate
  };
};
