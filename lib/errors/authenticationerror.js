'use strict';

/**
 * The `AuthenticationError` error.
 *
 * @private
 */
class AuthenticationError extends Error {
  constructor(message, status) {
    super(message);
    Error.captureStackTrace(this, AuthenticationError);
    this.name = 'AuthenticationError';
    this.status = status || 401;
  }
}

// Expose constructor.
module.exports = AuthenticationError;
