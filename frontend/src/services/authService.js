import axios from "axios";

/**
 * Base URL for all API requests to the Django backend.
 * @constant {string}
 */
const API_URL = "http://localhost:8000/api/users";

/**
 * Sends a registration request to the Django backend API.
 * @param {string} username
 * @param {string} email
 * @param {string} password
 * @param {string} phone_number
 * @param {string} address
 * @param {number} avatar
 * @returns {Promise<object>} The response data from the API.
 * @throws {Error} If the registration request fails.
 */
const _registerUser = async (
    username,
    email,
    password,
    phone_number,
    address,
    avatar
) => {
    const response = await axios.post(`${API_URL}/register/`, {
        username,
        email,
        password,
        phone_number,
        address,
        avatar,
    });
    return response.data;
};

export { _registerUser };