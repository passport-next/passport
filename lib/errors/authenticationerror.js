/**
 * The `AuthenticationError` error.
 * @class AuthenticationError
 * @private
 */
class AuthenticationError extends Error {
  /* eslint-disable unicorn/custom-error-definition -- Convenient */
  /**
   *
   * @param {string} message
   * @param {number} [status]
   */
  constructor(message, status) {
    /* eslint-enable unicorn/custom-error-definition -- Convenient */
    super(message);

    this.name = 'AuthenticationError';
    this.status = status || 401;
  }
}

// Expose constructor.
export default AuthenticationError;
