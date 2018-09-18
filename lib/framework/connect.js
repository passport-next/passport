/**
 * Module dependencies.
 */
/* eslint-disable camelcase, no-proto, no-shadow */

const http = require('http');
const initialize = require('../middleware/initialize');
const authenticate = require('../middleware/authenticate');
const IncomingMessageExt = require('../http/request');

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
  // HTTP extensions.
  exports.__monkeypatchNode();

  return {
    initialize,
    authenticate,
  };
};

exports.__monkeypatchNode = function __monkeypatchNode() {
  http.IncomingMessage.prototype.logIn = IncomingMessageExt.logIn;
  http.IncomingMessage.prototype.login = http.IncomingMessage.prototype.logIn;

  http.IncomingMessage.prototype.logOut = IncomingMessageExt.logOut;
  http.IncomingMessage.prototype.logout = http.IncomingMessage.prototype.logOut;

  http.IncomingMessage.prototype.isAuthenticated = IncomingMessageExt.isAuthenticated;
  http.IncomingMessage.prototype.isUnauthenticated = IncomingMessageExt.isUnauthenticated;
};
