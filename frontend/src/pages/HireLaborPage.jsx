import { Link, useNavigate, useParams } from "react-router";

import ErrorState from "../components/ErrorState.jsx";
import HireForm from "../components/HireForm.jsx";
import HireLaborSummary from "../components/HireLaborSummary.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import useLaborDetails from "../hooks/useLaborDetails.js";
import { createBooking } from "../services/bookingService.js";


/**
 * Fetch the selected laborer and render the hiring form.
 *
 * @returns {JSX.Element} Loading, error, unavailable, or hiring form content.
 */
function HireLaborPage() {
    const { laborId } = useParams();
    const navigate = useNavigate();
    const { labor, isLoading, error, retry } = useLaborDetails(laborId);

    async function _handleValidSubmit(bookingData) {
        const booking = await createBooking({
            labor: labor.id,
            ...bookingData,
        });

        navigate(`/bookings/${booking.id}/success`, { replace: true });
    }

    return (
        <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            {isLoading && <LoadingSpinner label="Preparing hiring form" />}

            {!isLoading && error && (
                <ErrorState
                    title={
                        error.status === 404
                            ? "Labor profile not found"
                            : "We could not prepare the hiring form"
                    }
                    message={error.message}
                    onRetry={retry}
                />
            )}

            {!isLoading && !error && labor && !labor.available && (
                <section className="rounded-3xl border border-amber-200 bg-amber-50 px-6 py-12 text-center">
                    <h1 className="text-2xl font-bold text-amber-950">
                        {labor.name} is currently unavailable
                    </h1>
                    <p className="mx-auto mt-3 max-w-xl text-amber-800">
                        Return to the profile or choose another available
                        laborer before creating a booking.
                    </p>
                    <Link
                        to={`/labors/${labor.id}`}
                        className="mt-6 inline-flex rounded-xl bg-amber-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-800"
                    >
                        Return to profile
                    </Link>
                </section>
            )}

            {!isLoading && !error && labor?.available && (
                <>
                    <Link
                        to={`/labors/${labor.id}`}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 transition hover:text-brand-800"
                    >
                        <span aria-hidden="true">←</span>
                        Back to labor profile
                    </Link>
                    <div className="mt-6 grid items-start gap-8 lg:grid-cols-3">
                        <HireLaborSummary labor={labor} />
                        <div className="lg:col-span-2">
                            <HireForm
                                laborId={labor.id}
                                onValidSubmit={_handleValidSubmit}
                            />
                        </div>
                    </div>
                </>
            )}
        </main>
    );
}


export default HireLaborPage;
