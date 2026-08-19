import API_CLIENT from "./apiClient.js";

/**
 * Sends a registration request to the Django backend API.
 *
 * Uses the shared API_CLIENT so the request honours VITE_API_BASE_URL,
 * the 10 second timeout, and the shared ApiError normalisation.
 *
 * @param {string} username
 * @param {string} email
 * @param {string} password
 * @param {string} phone_number
 * @param {string} address
 * @param {number} avatar
 * @returns {Promise<object>} The response data from the API.
 * @throws {ApiError} If the registration request fails.
 */
const _registerUser = async (
    username,
    email,
    password,
    phone_number,
    address,
    avatar
) => {
    const response = await API_CLIENT.post("users/register/", {
        username,
        email,
        password,
        phone_number,
        address,
        avatar,
    });
    return response.data;
};

/**
 * Authenticates a user and returns the JWT token pair.
 *
 * @param {object} credentials
 * @param {string} credentials.username
 * @param {string} credentials.password
 * @returns {Promise<object>} An object containing access, refresh and message.
 * @throws {ApiError} If the credentials are rejected or the request fails.
 */
const _loginUser = async ({ username, password }) => {
    const response = await API_CLIENT.post("users/login/", {
        username,
        password,
    });
    return response.data;
};

/**
 * Fetches the signed-in user's profile.
 *
 * The Authorization header is attached by the API_CLIENT request interceptor,
 * so the token does not need to be threaded through the call.
 *
 * @returns {Promise<object>} The user's profile fields.
 * @throws {ApiError} If the user is not authenticated or the request fails.
 */
const _getProfile = async () => {
    const response = await API_CLIENT.get("users/profile/");
    return response.data;
};

/**
 * Updates the signed-in user's profile.
 *
 * @param {object} data Partial profile fields to update.
 * @returns {Promise<object>} An object containing message and the updated data.
 * @throws {ApiError} If validation fails or the request fails.
 */
const _updateProfile = async (data) => {
    const response = await API_CLIENT.put("users/profile/", data);
    return response.data;
};

export { _registerUser, _loginUser, _getProfile, _updateProfile };
