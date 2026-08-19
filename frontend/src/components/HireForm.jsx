import { Link } from "react-router";

import useHireForm from "../hooks/useHireForm.js";
import FormFieldError from "./FormFieldError.jsx";


const INPUT_CLASSES =
    "mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-3 focus:ring-brand-100";


/**
 * Render and validate the fields required to hire a laborer.
 *
 * @param {object} props Component properties.
 * @param {string|number} props.laborId Selected labor database ID.
 * @param {Function} props.onValidSubmit Callback for validated booking data.
 * @returns {JSX.Element} Responsive controlled hiring form.
 */
function HireForm({ laborId, onValidSubmit }) {
    const {
        values,
        errors,
        submitError,
        isSubmitting,
        minimumDate,
        handleChange,
        handleSubmit,
    } = useHireForm(onValidSubmit);

    return (
        <form
            className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8"
            onSubmit={handleSubmit}
            noValidate
        >
            <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">
                    Booking information
                </p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                    Schedule the work
                </h1>
                <p className="mt-3 leading-7 text-slate-600">
                    Tell the laborer when and where the work should take place.
                </p>
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-2">
                <div>
                    <label
                        htmlFor="work_date"
                        className="text-sm font-semibold text-slate-800"
                    >
                        Work date <span className="text-red-600">*</span>
                    </label>
                    <input
                        id="work_date"
                        name="work_date"
                        type="date"
                        min={minimumDate}
                        required
                        value={values.work_date}
                        onChange={handleChange}
                        aria-invalid={Boolean(errors.work_date)}
                        aria-describedby={
                            errors.work_date ? "work-date-error" : undefined
                        }
                        className={INPUT_CLASSES}
                    />
                    <FormFieldError
                        id="work-date-error"
                        message={errors.work_date}
                    />
                </div>

                <div>
                    <label
                        htmlFor="start_time"
                        className="text-sm font-semibold text-slate-800"
                    >
                        Start time <span className="text-red-600">*</span>
                    </label>
                    <input
                        id="start_time"
                        name="start_time"
                        type="time"
                        required
                        value={values.start_time}
                        onChange={handleChange}
                        aria-invalid={Boolean(errors.start_time)}
                        aria-describedby={
                            errors.start_time ? "start-time-error" : undefined
                        }
                        className={INPUT_CLASSES}
                    />
                    <FormFieldError
                        id="start-time-error"
                        message={errors.start_time}
                    />
                </div>

                <div className="sm:col-span-2">
                    <label
                        htmlFor="duration"
                        className="text-sm font-semibold text-slate-800"
                    >
                        Duration in hours <span className="text-red-600">*</span>
                    </label>
                    <input
                        id="duration"
                        name="duration"
                        type="number"
                        min="0.5"
                        max="24"
                        step="0.5"
                        inputMode="decimal"
                        required
                        placeholder="Example: 2.5"
                        value={values.duration}
                        onChange={handleChange}
                        aria-invalid={Boolean(errors.duration)}
                        aria-describedby={
                            errors.duration
                                ? "duration-help duration-error"
                                : "duration-help"
                        }
                        className={INPUT_CLASSES}
                    />
                    <p id="duration-help" className="mt-2 text-sm text-slate-500">
                        Minimum 0.5 hour and maximum 24 hours.
                    </p>
                    <FormFieldError
                        id="duration-error"
                        message={errors.duration}
                    />
                </div>

                <div className="sm:col-span-2">
                    <label
                        htmlFor="address"
                        className="text-sm font-semibold text-slate-800"
                    >
                        Job address <span className="text-red-600">*</span>
                    </label>
                    <input
                        id="address"
                        name="address"
                        type="text"
                        maxLength="255"
                        autoComplete="street-address"
                        required
                        placeholder="House, road, area, and city"
                        value={values.address}
                        onChange={handleChange}
                        aria-invalid={Boolean(errors.address)}
                        aria-describedby={
                            errors.address ? "address-error" : undefined
                        }
                        className={INPUT_CLASSES}
                    />
                    <FormFieldError
                        id="address-error"
                        message={errors.address}
                    />
                </div>

                <div className="sm:col-span-2">
                    <label
                        htmlFor="notes"
                        className="text-sm font-semibold text-slate-800"
                    >
                        Notes <span className="font-normal text-slate-500">(optional)</span>
                    </label>
                    <textarea
                        id="notes"
                        name="notes"
                        rows="4"
                        placeholder="Describe the job, required tools, or access instructions"
                        value={values.notes}
                        onChange={handleChange}
                        className={`${INPUT_CLASSES} resize-y`}
                    />
                </div>
            </div>

            {submitError && (
                <div
                    className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                    role="alert"
                >
                    <p className="font-semibold">Booking was not created</p>
                    <p className="mt-1">{submitError}</p>
                </div>
            )}

            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <Link
                    to={`/labors/${laborId}`}
                    aria-disabled={isSubmitting}
                    onClick={(event) => {
                        if (isSubmitting) {
                            event.preventDefault();
                        }
                    }}
                    className={`inline-flex items-center justify-center rounded-xl border border-slate-300 px-6 py-3 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600 ${
                        isSubmitting
                            ? "cursor-not-allowed text-slate-400"
                            : "text-slate-700 hover:border-slate-400 hover:bg-slate-50"
                    }`}
                >
                    Cancel
                </Link>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 disabled:cursor-not-allowed disabled:bg-brand-300"
                >
                    {isSubmitting ? "Creating booking..." : "Hire now"}
                </button>
            </div>
        </form>
    );
}


export default HireForm;
