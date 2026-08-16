import { useState } from "react";


const LABOR_CATEGORIES = [
    "AC Technician",
    "Carpenter",
    "Cleaner",
    "Electrician",
    "Gardener",
    "Mason",
    "Painter",
    "Plumber",
];

const SORT_OPTIONS = [
    { value: "highest_rated", label: "Highest rated" },
    { value: "lowest_wage", label: "Lowest wage" },
    { value: "highest_wage", label: "Highest wage" },
    { value: "most_reviewed", label: "Most reviewed" },
];


/**
 * Display category, rating, wage, and sorting controls.
 *
 * @param {object} props Component properties.
 * @param {object} props.initialValues Currently applied filter values.
 * @param {Function} props.onApply Apply validated filters.
 * @param {Function} props.onReset Clear all filters and sorting.
 * @returns {JSX.Element} Responsive labor filter form.
 */
function LaborFilters({ initialValues, onApply, onReset }) {
    const [category, setCategory] = useState(initialValues.category);
    const [rating, setRating] = useState(initialValues.rating);
    const [minimumWage, setMinimumWage] = useState(initialValues.min_wage);
    const [maximumWage, setMaximumWage] = useState(initialValues.max_wage);
    const [sort, setSort] = useState(initialValues.sort);
    const [errors, setErrors] = useState({});

    function _validateWages() {
        const nextErrors = {};
        const parsedMinimum = Number(minimumWage);
        const parsedMaximum = Number(maximumWage);

        if (minimumWage !== "" && (!Number.isFinite(parsedMinimum) || parsedMinimum < 0)) {
            nextErrors.min_wage = "Enter a non-negative minimum wage.";
        }
        if (maximumWage !== "" && (!Number.isFinite(parsedMaximum) || parsedMaximum < 0)) {
            nextErrors.max_wage = "Enter a non-negative maximum wage.";
        }
        if (
            !nextErrors.min_wage
            && !nextErrors.max_wage
            && minimumWage !== ""
            && maximumWage !== ""
            && parsedMinimum > parsedMaximum
        ) {
            nextErrors.max_wage = "Maximum wage must not be below minimum wage.";
        }

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    }

    function _handleSubmit(event) {
        event.preventDefault();
        if (!_validateWages()) {
            return;
        }

        onApply({
            category,
            rating,
            min_wage: minimumWage.trim(),
            max_wage: maximumWage.trim(),
            sort,
        });
    }

    function _handleReset() {
        setCategory("");
        setRating("");
        setMinimumWage("");
        setMaximumWage("");
        setSort("highest_rated");
        setErrors({});
        onReset();
    }

    return (
        <form
            onSubmit={_handleSubmit}
            className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200 sm:p-5"
            noValidate
        >
            <div className="flex items-center justify-between gap-4">
                <h2 className="font-semibold text-slate-900">
                    Filter and sort
                </h2>
                <button
                    type="button"
                    onClick={_handleReset}
                    className="text-sm font-semibold text-brand-700 transition hover:text-brand-800"
                >
                    Reset
                </button>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <label className="text-sm font-medium text-slate-700">
                    Category
                    <select
                        value={category}
                        onChange={(event) => setCategory(event.target.value)}
                        className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none focus:border-brand-500 focus:ring-3 focus:ring-brand-100"
                    >
                        <option value="">All categories</option>
                        {LABOR_CATEGORIES.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="text-sm font-medium text-slate-700">
                    Minimum rating
                    <select
                        value={rating}
                        onChange={(event) => setRating(event.target.value)}
                        className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none focus:border-brand-500 focus:ring-3 focus:ring-brand-100"
                    >
                        <option value="">Any rating</option>
                        <option value="3">3.0 and above</option>
                        <option value="4">4.0 and above</option>
                        <option value="4.5">4.5 and above</option>
                    </select>
                </label>

                <label className="text-sm font-medium text-slate-700">
                    Minimum wage
                    <input
                        type="number"
                        min="0"
                        step="50"
                        value={minimumWage}
                        onChange={(event) => setMinimumWage(event.target.value)}
                        placeholder="৳0"
                        aria-invalid={Boolean(errors.min_wage)}
                        className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none placeholder:text-slate-400 focus:border-brand-500 focus:ring-3 focus:ring-brand-100"
                    />
                    {errors.min_wage && (
                        <span className="mt-1 block text-xs text-red-700">
                            {errors.min_wage}
                        </span>
                    )}
                </label>

                <label className="text-sm font-medium text-slate-700">
                    Maximum wage
                    <input
                        type="number"
                        min="0"
                        step="50"
                        value={maximumWage}
                        onChange={(event) => setMaximumWage(event.target.value)}
                        placeholder="No maximum"
                        aria-invalid={Boolean(errors.max_wage)}
                        className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none placeholder:text-slate-400 focus:border-brand-500 focus:ring-3 focus:ring-brand-100"
                    />
                    {errors.max_wage && (
                        <span className="mt-1 block text-xs text-red-700">
                            {errors.max_wage}
                        </span>
                    )}
                </label>

                <label className="text-sm font-medium text-slate-700">
                    Sort by
                    <select
                        value={sort}
                        onChange={(event) => setSort(event.target.value)}
                        className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none focus:border-brand-500 focus:ring-3 focus:ring-brand-100"
                    >
                        {SORT_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            <div className="mt-5 flex justify-end">
                <button
                    type="submit"
                    className="w-full rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 sm:w-auto"
                >
                    Apply filters
                </button>
            </div>
        </form>
    );
}


export default LaborFilters;
