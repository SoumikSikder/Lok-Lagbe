/**
 * API service for communicating with LokLagbe backend.
 */

const API_BASE_URL = "http://127.0.0.1:8000/api";


/**
 * Login user.
 *
 * @param {Object} credentials - Username and password.
 * @returns {Promise<Object>} JWT token response.
 */
export const loginUser = async (credentials) => {

    const response = await fetch(
        `${API_BASE_URL}/login/`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify(credentials),
        }
    );


    return await response.json();
};



/**
 * Get logged-in user profile.
 *
 * @param {string} token - JWT access token.
 * @returns {Promise<Object>} User profile information.
 */
export const getProfile = async (token) => {

    const response = await fetch(
        `${API_BASE_URL}/profile/`,
        {
            method: "GET",

            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );


    return await response.json();
};



/**
 * Update user profile.
 *
 * @param {string} token - JWT access token.
 * @param {Object} data - Updated profile data.
 * @returns {Promise<Object>} Updated profile response.
 */
export const updateProfile = async (
    token,
    data
) => {

    const response = await fetch(
        `${API_BASE_URL}/profile/`,
        {
            method: "PUT",

            headers: {
                "Content-Type": "application/json",

                Authorization: `Bearer ${token}`,
            },

            body: JSON.stringify(data),
        }
    );


    return await response.json();
};