import { Link } from "react-router";

import FavoriteButton from "./FavoriteButton.jsx";
import LaborPhoto from "./LaborPhoto.jsx";
import RatingDisplay from "./RatingDisplay.jsx";

const CURRENCY_FORMATTER = new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
});

/**
 * Display one labor profile as a responsive horizontal listing row.
 *
 * @param {object} props Component properties.
 * @param {object} props.labor Labor listing API record.
 * @returns {JSX.Element} Profile photo, information, summary, and actions.
 */
function LaborCard({ labor }) {
    const experience = Number(labor.experience) || 0;
    const experienceLabel = `${experience} ${
        experience === 1 ? "year" : "years"
    } experience`;

    return (
        <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-brand-200 hover:shadow-md">
            <div className="grid sm:grid-cols-[180px_minmax(0,1fr)] lg:grid-cols-[190px_minmax(0,1fr)_260px]">
                <div className="aspect-4/3 overflow-hidden bg-brand-100 sm:aspect-auto sm:min-h-56 relative">
                    <LaborPhoto
                        labor={labor}
                        className="size-full object-cover text-5xl transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 sm:hidden">
                        <FavoriteButton labor={labor} />
                    </div>
                </div>

                <div className="flex min-w-0 flex-col p-5 sm:p-6">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">
                                {labor.name}
                            </h2>
                            <p className="mt-1 font-semibold text-brand-700">
                                {labor.profession}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <FavoriteButton labor={labor} className="hidden sm:inline-flex" />
                            <span
                                className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${
                                    labor.available
                                        ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                                        : "bg-slate-100 text-slate-600 ring-slate-200"
                                }`}
                            >
                                {labor.available ? "Available" : "Unavailable"}
                            </span>
                        </div>
                    </div>

                    <p className="mt-3 flex items-center gap-2 text-sm text-slate-600">
                        <span aria-hidden="true">⌖</span>
                        {labor.location}
                    </p>

                    <div className="mt-3">
                        <RatingDisplay
                            rating={labor.rating}
                            reviewCount={labor.review_count}
                        />
                    </div>

                    <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-600">
                        {labor.description || "No description is available."}
                    </p>

                    <span className="mt-auto pt-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                        {labor.category}
                    </span>
                </div>

                <div className="flex flex-col justify-between border-t border-slate-100 bg-slate-50/70 p-5 sm:col-start-2 sm:p-6 lg:col-start-auto lg:border-l lg:border-t-0">
                    <div className="space-y-4">
                        <p className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                            <span
                                className="flex size-9 items-center justify-center rounded-lg bg-white text-brand-700 ring-1 ring-slate-200"
                                aria-hidden="true"
                            >
                                ▣
                            </span>
                            {experienceLabel}
                        </p>
                        <p className="flex items-center gap-3">
                            <span
                                className="flex size-9 items-center justify-center rounded-lg bg-white font-bold text-brand-700 ring-1 ring-slate-200"
                                aria-hidden="true"
                            >
                                ৳
                            </span>
                            <span>
                                <strong className="block text-xl text-slate-900">
                                    {CURRENCY_FORMATTER.format(
                                        labor.hourly_wage,
                                    )}
                                </strong>
                                <span className="text-xs text-slate-500">
                                    per hour
                                </span>
                            </span>
                        </p>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-1">
                        <Link
                            to={`/labors/${labor.id}`}
                            className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-brand-400 hover:text-brand-700"
                        >
                            View profile
                        </Link>
                        {labor.available ? (
                            <Link
                                to={`/labors/${labor.id}/hire`}
                                className="inline-flex items-center justify-center rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
                            >
                                Hire now
                            </Link>
                        ) : (
                            <button
                                type="button"
                                disabled
                                className="cursor-not-allowed rounded-xl bg-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-500"
                            >
                                Hire now
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </article>
    );
}


export default LaborCard;
