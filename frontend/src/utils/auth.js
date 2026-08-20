/**
 * @file Access token storage helpers.
 *
 * The JWT returned by /api/users/login/ is kept in localStorage so it survives
 * a page reload. apiClient.js reads it through getToken() and attaches it as a
 * Bearer header on every request.
 */

const ACCESS_TOKEN_KEY = "accessToken";

/**
 * Persist the JWT access token.
 *
 * @param {string} token The access token returned by the login endpoint.
 * @returns {void}
 */
export const saveToken = (token) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
};

/**
 * Read the stored JWT access token.
 *
 * @returns {string|null} The token, or null when the user is signed out.
 */
export const getToken = () => {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
};

/**
 * Clear the stored JWT access token.
 *
 * @returns {void}
 */
export const removeToken = () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
};
