import { useState } from "react";
import { useParams } from "react-router";

import ErrorState from "../components/ErrorState.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import PaymentMethodForm from "../components/PaymentMethodForm.jsx";
import PaymentSuccess from "../components/PaymentSuccess.jsx";
import PaymentSummary from "../components/PaymentSummary.jsx";
import useBookingDetails from "../hooks/useBookingDetails.js";


/**
 * Verify a booking and manage its frontend-only payment simulation.
 *
 * @returns {JSX.Element} Loading, error, payment selection, or success state.
 */
function PaymentPage() {
    const { bookingId } = useParams();
    const { booking, isLoading, error, retry } = useBookingDetails(bookingId);
    const [confirmedMethod, setConfirmedMethod] = useState(null);

    async function _handleConfirm(method) {
        await Promise.resolve();
        setConfirmedMethod(method);
    }

    return (
        <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            {isLoading && <LoadingSpinner label="Preparing payment" />}

            {!isLoading && error && (
                <ErrorState
                    title={
                        error.status === 404
                            ? "Booking not found"
                            : "We could not prepare this payment"
                    }
                    message={error.message}
                    onRetry={retry}
                />
            )}

            {!isLoading && !error && booking && confirmedMethod && (
                <PaymentSuccess
                    booking={booking}
                    method={confirmedMethod}
                />
            )}

            {!isLoading && !error && booking && !confirmedMethod && (
                <div className="grid items-start gap-8 lg:grid-cols-3">
                    <PaymentSummary booking={booking} />
                    <div className="lg:col-span-2">
                        <PaymentMethodForm onConfirm={_handleConfirm} />
                    </div>
                </div>
            )}
        </main>
    );
}


export default PaymentPage;
