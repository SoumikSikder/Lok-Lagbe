import API_CLIENT from "./apiClient.js";

async function createBooking(bookingData) {
    const response = await API_CLIENT.post("bookings/", bookingData);
    return response.data;
}

async function getBookingById(bookingId, signal) {
    const response = await API_CLIENT.get(
        `bookings/${encodeURIComponent(bookingId)}/`,
        { signal },
    );
    return response.data;
}

/**
 * Fetch booking / hire history for the authenticated user.
 *
 * @param {Object} [parameters] Query parameters e.g. { status: 'pending' }.
 * @param {AbortSignal} [signal] Optional abort signal.
 * @returns {Promise<Array>} List of booking objects.
 */
async function getBookingHistory(parameters = {}, signal) {
    const response = await API_CLIENT.get("bookings/history/", {
        params: parameters,
        signal,
    });
    return response.data;
}

export { createBooking, getBookingById, getBookingHistory };
