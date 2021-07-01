'use strict';

/**
 * The `AuthenticationError` error.
 * @class AuthenticationError
 * @private
 */
class AuthenticationError extends Error {
  /**
   *
   * @param {string} message
   * @param {Integer} status
   */
  constructor(message, status) {
    super(message);
    Error.captureStackTrace(this, AuthenticationError);
    this.name = 'AuthenticationError';
    this.status = status || 401;
  }
}

// Expose constructor.
module.exports = AuthenticationError;
