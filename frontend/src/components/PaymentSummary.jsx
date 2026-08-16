import { _calculateBookingTotal } from "../services/paymentSimulation.js";


const CURRENCY_FORMATTER = new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
});


/**
 * Display the booking and estimated payment amount.
 *
 * @param {object} props Component properties.
 * @param {object} props.booking Booking detail API record.
 * @returns {JSX.Element} Compact payment summary.
 */
function PaymentSummary({ booking }) {
    const total = _calculateBookingTotal(booking);
    const duration = Number(booking.duration);

    return (
        <aside className="rounded-3xl bg-slate-900 p-6 text-white shadow-sm sm:p-8 lg:sticky lg:top-24">
            <p className="text-sm font-semibold uppercase tracking-wider text-brand-300">
                Payment summary
            </p>
            <h2 className="mt-2 text-2xl font-bold">
                Booking #{booking.id}
            </h2>

            <dl className="mt-6 space-y-4 text-sm">
                <div className="flex items-start justify-between gap-4 border-b border-slate-700 pb-4">
                    <dt className="text-slate-400">Laborer</dt>
                    <dd className="text-right font-semibold">
                        {booking.labor_name}
                    </dd>
                </div>
                <div className="flex items-start justify-between gap-4 border-b border-slate-700 pb-4">
                    <dt className="text-slate-400">Hourly wage</dt>
                    <dd className="text-right font-semibold">
                        {CURRENCY_FORMATTER.format(
                            booking.labor_hourly_wage,
                        )}
                    </dd>
                </div>
                <div className="flex items-start justify-between gap-4 border-b border-slate-700 pb-4">
                    <dt className="text-slate-400">Duration</dt>
                    <dd className="text-right font-semibold">
                        {duration} {duration === 1 ? "hour" : "hours"}
                    </dd>
                </div>
                <div className="flex items-end justify-between gap-4 pt-2">
                    <dt className="font-semibold text-slate-200">
                        Estimated total
                    </dt>
                    <dd className="text-3xl font-bold text-brand-300">
                        {CURRENCY_FORMATTER.format(total)}
                    </dd>
                </div>
            </dl>

            <p className="mt-6 text-xs leading-5 text-slate-400">
                This is a project simulation. No real money will be charged.
            </p>
        </aside>
    );
}


export default PaymentSummary;
