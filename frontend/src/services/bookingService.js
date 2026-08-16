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


export { createBooking, getBookingById };
