'use strict';

/**
 * Module dependencies.
 */

const initialize = require('../middleware/initialize');
const authenticate = require('../middleware/authenticate');

/**
 * Framework support for Connect/Express.
 *
 * This module provides support for using Passport with Express.  It exposes
 * middleware that conform to the `fn(req, res, next)` signature.
 *
 * @return {Object}
 * @protected
 */

// eslint-disable-next-line no-multi-assign, func-names
exports = module.exports = function () {
  return {
    initialize,
    authenticate
  };
};
