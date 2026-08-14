/* eslint-disable no-multi-assign */
/**
 * Module dependencies.
 */

'use strict';

const Passport = require('./authenticator.js');
const SessionStrategy = require('./strategies/session.js');

/**
 * Middleware function passed `req`, `res`, and `next`
 * @external ConnectMiddleware
 * @see https://github.com/senchalabs/connect#appusefn
*/

/**
* @external HttpIncomingMessage
* @see https://nodejs.org/docs/latest/api/http.html#http_class_http_incomingmessage
*/

/**
* @external HttpServerResponse
* @see https://nodejs.org/docs/latest/api/http.html#http_class_http_serverresponse
*/

/**
* @typedef {external:HttpIncomingMessage} Request
*/

/**
* @typedef {external:HttpServerResponse} Response
*/

/**
* @external ConnectNextCallback
*/

/**
 * This middleware conforms to Connect/Express middleware by
 * the arguments it accepts.
 * @see Conforms to {@link external:ConnectMiddleware}
 * @callback ConnectMiddleware
 * @param {Request} req
 * @param {Response} res
 * @param {ConnectNextCallback} next
 * @returns {void}
*/

/**
 * Export default singleton.
 *
 * @public
 */
exports = module.exports = new Passport();

// Expose constructors.
exports.Passport = exports.Authenticator = Passport;
exports.Strategy = require('@passport-next/passport-strategy');

// Expose strategies.
exports.strategies = {};
exports.strategies.SessionStrategy = SessionStrategy;
