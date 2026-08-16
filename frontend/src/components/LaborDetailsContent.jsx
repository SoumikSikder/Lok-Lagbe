import { Link } from "react-router";

import LaborPhoto from "./LaborPhoto.jsx";
import RatingDisplay from "./RatingDisplay.jsx";
import ReviewForm from "./ReviewForm.jsx";
import ReviewList from "./ReviewList.jsx";


const CURRENCY_FORMATTER = new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
});


/**
 * Render the complete labor profile returned by the detail API.
 *
 * @param {object} props Component properties.
 * @param {object} props.labor Complete labor detail API record.
 * @param {Function} props.onReviewSubmit Callback creating a review.
 * @param {string} [props.reviewSuccessMessage] Review confirmation text.
 * @returns {JSX.Element} Labor profile, skills, actions, and reviews.
 */
function LaborDetailsContent({
    labor,
    onReviewSubmit,
    reviewSuccessMessage = "",
}) {
    const skills = Array.isArray(labor.skills) ? labor.skills : [];
    const reviews = Array.isArray(labor.reviews) ? labor.reviews : [];
    const experienceLabel = `${labor.experience} ${
        labor.experience === 1 ? "year" : "years"
    }`;

    return (
        <>
            <Link
                to="/labors"
                className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 transition hover:text-brand-800"
            >
                <span aria-hidden="true">←</span>
                Back to labor listings
            </Link>

            <article className="mt-6 overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
                <div className="grid lg:grid-cols-2">
                    <div className="aspect-4/3 overflow-hidden bg-brand-100 lg:min-h-full">
                        <LaborPhoto
                            labor={labor}
                            className="size-full object-cover text-7xl"
                        />
                    </div>

                    <div className="flex flex-col p-6 sm:p-8 lg:p-10">
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 ring-1 ring-brand-200">
                                {labor.category}
                            </span>
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

                        <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                            {labor.name}
                        </h1>
                        <p className="mt-2 text-lg font-semibold text-brand-700">
                            {labor.profession}
                        </p>
                        <p className="mt-3 text-sm text-slate-600">
                            <span aria-hidden="true">⌖</span> {labor.location}
                        </p>

                        <div className="mt-5">
                            <RatingDisplay
                                rating={labor.rating}
                                reviewCount={labor.review_count}
                            />
                        </div>

                        <p className="mt-6 text-3xl font-bold text-slate-900">
                            {CURRENCY_FORMATTER.format(labor.hourly_wage)}
                            <span className="ml-2 text-base font-normal text-slate-500">
                                per hour
                            </span>
                        </p>

                        <p className="mt-6 leading-7 text-slate-600">
                            {labor.description}
                        </p>

                        <div className="mt-8">
                            {labor.available ? (
                                <Link
                                    to={`/labors/${labor.id}/hire`}
                                    className="inline-flex w-full items-center justify-center rounded-xl bg-brand-600 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 sm:w-auto"
                                >
                                    Hire now
                                </Link>
                            ) : (
                                <button
                                    type="button"
                                    disabled
                                    className="w-full cursor-not-allowed rounded-xl bg-slate-200 px-6 py-3.5 text-sm font-semibold text-slate-500 sm:w-auto"
                                >
                                    Currently unavailable
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </article>

            <div className="mt-8 grid gap-8 lg:grid-cols-3">
                <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 lg:col-span-2">
                    <h2 className="text-xl font-bold text-slate-900">
                        Experience and skills
                    </h2>
                    <div className="mt-5 rounded-xl bg-brand-50 p-4">
                        <p className="text-sm text-brand-700">Work experience</p>
                        <p className="mt-1 text-xl font-bold text-brand-900">
                            {experienceLabel}
                        </p>
                    </div>
                    <h3 className="mt-6 font-semibold text-slate-900">Skills</h3>
                    <ul className="mt-3 flex flex-wrap gap-2">
                        {skills.length > 0 ? (
                            skills.map((skill) => (
                                <li
                                    key={skill}
                                    className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700"
                                >
                                    {skill}
                                </li>
                            ))
                        ) : (
                            <li className="text-sm text-slate-500">
                                No skills have been listed.
                            </li>
                        )}
                    </ul>
                </section>

                <aside className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                    <h2 className="text-xl font-bold text-slate-900">
                        Contact details
                    </h2>
                    <dl className="mt-5 space-y-5">
                        <div>
                            <dt className="text-sm text-slate-500">Phone</dt>
                            <dd className="mt-1 font-semibold text-slate-900">
                                <a
                                    href={`tel:${labor.phone}`}
                                    className="transition hover:text-brand-700"
                                >
                                    {labor.phone}
                                </a>
                            </dd>
                        </div>
                        <div>
                            <dt className="text-sm text-slate-500">Email</dt>
                            <dd className="mt-1 break-all font-semibold text-slate-900">
                                <a
                                    href={`mailto:${labor.email}`}
                                    className="transition hover:text-brand-700"
                                >
                                    {labor.email}
                                </a>
                            </dd>
                        </div>
                    </dl>
                </aside>
            </div>

            <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
                <div className="mb-6">
                    <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">
                        Customer feedback
                    </p>
                    <h2 className="mt-2 text-2xl font-bold text-slate-900">
                        Reviews and ratings
                    </h2>
                </div>
                <ReviewForm
                    onSubmit={onReviewSubmit}
                    successMessage={reviewSuccessMessage}
                />
                <div className="mt-8">
                    <h3 className="mb-4 text-lg font-bold text-slate-900">
                        Community reviews
                    </h3>
                    <ReviewList reviews={reviews} />
                </div>
            </section>
        </>
    );
}


export default LaborDetailsContent;
