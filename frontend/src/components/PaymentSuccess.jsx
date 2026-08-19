import { Link } from "react-router";


/**
 * Confirm completion of the frontend-only payment simulation.
 *
 * @param {object} props Component properties.
 * @param {object} props.booking Persisted booking detail record.
 * @param {object} props.method Selected payment method.
 * @returns {JSX.Element} Payment success message and navigation action.
 */
function PaymentSuccess({ booking, method }) {
    return (
        <section className="mx-auto max-w-2xl rounded-3xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200 sm:p-12">
            <div
                className="mx-auto flex size-20 items-center justify-center rounded-full bg-emerald-100 text-4xl font-bold text-emerald-700"
                aria-hidden="true"
            >
                ✓
            </div>
            <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-emerald-700">
                Simulation complete
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
                Payment Successful
            </h1>
            <p className="mx-auto mt-4 max-w-lg leading-7 text-slate-600">
                {method.name} was confirmed for booking #{booking.id}. No real
                payment was processed.
            </p>
            <Link
                to="/labors"
                className="mt-8 inline-flex rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
            >
                Return to labor listings
            </Link>
        </section>
    );
}


export default PaymentSuccess;
