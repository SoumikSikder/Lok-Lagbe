import LaborPhoto from "./LaborPhoto.jsx";
import RatingDisplay from "./RatingDisplay.jsx";


const CURRENCY_FORMATTER = new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
});


/**
 * Summarize the laborer selected for a new booking.
 *
 * @param {object} props Component properties.
 * @param {object} props.labor Selected labor detail record.
 * @returns {JSX.Element} Sticky booking summary card.
 */
function HireLaborSummary({ labor }) {
    return (
        <aside className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200 lg:sticky lg:top-24">
            <div className="aspect-4/3 overflow-hidden bg-brand-100">
                <LaborPhoto
                    labor={labor}
                    className="size-full object-cover text-5xl"
                />
            </div>
            <div className="p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">
                    You are hiring
                </p>
                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                    {labor.name}
                </h2>
                <p className="mt-1 font-semibold text-brand-700">
                    {labor.profession}
                </p>
                <p className="mt-3 text-sm text-slate-600">
                    <span aria-hidden="true">⌖</span> {labor.location}
                </p>
                <div className="mt-4">
                    <RatingDisplay
                        rating={labor.rating}
                        reviewCount={labor.review_count}
                    />
                </div>
                <p className="mt-5 text-2xl font-bold text-slate-900">
                    {CURRENCY_FORMATTER.format(labor.hourly_wage)}
                    <span className="ml-2 text-sm font-normal text-slate-500">
                        per hour
                    </span>
                </p>
            </div>
        </aside>
    );
}


export default HireLaborSummary;
