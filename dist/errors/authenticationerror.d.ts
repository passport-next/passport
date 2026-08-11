export default AuthenticationError;
/**
 * The `AuthenticationError` error.
 * @class AuthenticationError
 * @private
 */
declare class AuthenticationError extends Error {
    /**
     *
     * @param {string} message
     * @param {number} [status]
     */
    constructor(message: string, status?: number);
    status: number;
}
