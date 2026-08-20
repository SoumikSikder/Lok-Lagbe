import { Link } from "react-router";


const DATE_FORMATTER = new Intl.DateTimeFormat("en-BD", {
    day: "numeric",
    month: "long",
    year: "numeric",
});
const TIME_FORMATTER = new Intl.DateTimeFormat("en-BD", {
    hour: "numeric",
    minute: "2-digit",
});


/**
 * Format an API date without shifting it across time zones.
 *
 * @param {string} value Date formatted as YYYY-MM-DD.
 * @returns {string} Human-readable work date.
 */
function _formatDate(value) {
    const date = new Date(`${value}T00:00:00`);
    return Number.isNaN(date.getTime())
        ? "Date unavailable"
        : DATE_FORMATTER.format(date);
}


/**
 * Format an API time value for the user's locale.
 *
 * @param {string} value Time formatted as HH:MM or HH:MM:SS.
 * @returns {string} Human-readable start time.
 */
function _formatTime(value) {
    const [hours, minutes] = value.split(":").map(Number);
    const date = new Date(2000, 0, 1, hours, minutes);
    return Number.isNaN(date.getTime())
        ? "Time unavailable"
        : TIME_FORMATTER.format(date);
}


/**
 * Display the persisted booking returned by Django.
 *
 * @param {object} props Component properties.
 * @param {object} props.booking Booking detail API record.
 * @returns {JSX.Element} Booking success message, summary, and next actions.
 */
function BookingConfirmation({ booking }) {
    const duration = Number(booking.duration);
    const durationLabel = `${duration} ${duration === 1 ? "hour" : "hours"}`;

    return (
        <section className="mx-auto max-w-3xl rounded-3xl bg-white p-6 text-center shadow-sm ring-1 ring-slate-200 sm:p-10">
            <div
                className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-100 text-3xl font-bold text-emerald-700"
                aria-hidden="true"
            >
                ✓
            </div>
            <p className="mt-5 text-sm font-semibold uppercase tracking-wider text-emerald-700">
                Booking successful
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
                Booking #{booking.id}
            </h1>
            <p className="mx-auto mt-3 max-w-xl leading-7 text-slate-600">
                Your request to hire {booking.labor_name} was created and is
                waiting for confirmation.
            </p>

            <dl className="mt-8 grid gap-4 text-left sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-4">
                    <dt className="text-sm text-slate-500">Status</dt>
                    <dd className="mt-1 font-bold text-amber-700">
                        {booking.status_display}
                    </dd>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                    <dt className="text-sm text-slate-500">Laborer</dt>
                    <dd className="mt-1 font-bold text-slate-900">
                        {booking.labor_name}
                    </dd>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                    <dt className="text-sm text-slate-500">Work date</dt>
                    <dd className="mt-1 font-bold text-slate-900">
                        {_formatDate(booking.work_date)}
                    </dd>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                    <dt className="text-sm text-slate-500">Start time</dt>
                    <dd className="mt-1 font-bold text-slate-900">
                        {_formatTime(booking.start_time)}
                    </dd>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4 sm:col-span-2">
                    <dt className="text-sm text-slate-500">Duration</dt>
                    <dd className="mt-1 font-bold text-slate-900">
                        {durationLabel}
                    </dd>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4 sm:col-span-2">
                    <dt className="text-sm text-slate-500">Job address</dt>
                    <dd className="mt-1 font-bold text-slate-900">
                        {booking.address}
                    </dd>
                </div>
                {booking.notes && (
                    <div className="rounded-2xl bg-slate-50 p-4 sm:col-span-2">
                        <dt className="text-sm text-slate-500">Notes</dt>
                        <dd className="mt-1 whitespace-pre-wrap text-slate-700">
                            {booking.notes}
                        </dd>
                    </div>
                )}
            </dl>

            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
                <Link
                    to="/labors"
                    className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                    Browse laborers
                </Link>
                <Link
                    to={`/bookings/${booking.id}/payment`}
                    className="inline-flex items-center justify-center rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
                >
                    Continue to payment
                </Link>
            </div>
        </section>
    );
}


export default BookingConfirmation;
