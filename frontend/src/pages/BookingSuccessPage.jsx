import { useParams } from "react-router";

import BookingConfirmation from "../components/BookingConfirmation.jsx";
import ErrorState from "../components/ErrorState.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import useBookingDetails from "../hooks/useBookingDetails.js";


/**
 * Retrieve and display the successfully created booking.
 *
 * @returns {JSX.Element} Loading, error, or persisted booking confirmation.
 */
function BookingSuccessPage() {
    const { bookingId } = useParams();
    const { booking, isLoading, error, retry } = useBookingDetails(bookingId);

    return (
        <main className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
            {isLoading && <LoadingSpinner label="Confirming your booking" />}

            {!isLoading && error && (
                <div className="mx-auto max-w-3xl">
                    <ErrorState
                        title={
                            error.status === 404
                                ? "Booking not found"
                                : "We could not load this booking"
                        }
                        message={error.message}
                        onRetry={retry}
                    />
                </div>
            )}

            {!isLoading && !error && booking && (
                <BookingConfirmation booking={booking} />
            )}
        </main>
    );
}


export default BookingSuccessPage;
