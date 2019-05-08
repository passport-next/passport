/**
 * `AuthenticationError` error.
 *
 * @api private
 */
class AuthenticationError extends Error {
  constructor(message, status) {
    super();
    Error.captureStackTrace(this, AuthenticationError);
    this.name = 'AuthenticationError';
    this.message = message;
    this.status = status || 401;
  }
}

// Expose constructor.
module.exports = AuthenticationError;
