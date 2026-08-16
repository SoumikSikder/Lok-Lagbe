import useReviewForm from "../hooks/useReviewForm.js";
import FormFieldError from "./FormFieldError.jsx";


const RATING_OPTIONS = [1, 2, 3, 4, 5];


/**
 * Collect and submit a rating and optional written comment.
 *
 * @param {object} props Component properties.
 * @param {Function} props.onSubmit Callback sending normalized review data.
 * @param {string} [props.successMessage] Confirmation from the parent page.
 * @returns {JSX.Element} Accessible review form with API states.
 */
function ReviewForm({ onSubmit, successMessage = "" }) {
    const {
        values,
        errors,
        submitError,
        isSubmitting,
        handleChange,
        handleSubmit,
    } = useReviewForm(onSubmit);

    return (
        <form
            className="rounded-2xl bg-brand-50 p-5 ring-1 ring-brand-100 sm:p-6"
            onSubmit={handleSubmit}
            noValidate
        >
            <fieldset>
                <legend className="text-lg font-bold text-slate-900">
                    Write a review
                </legend>
                <p className="mt-1 text-sm text-slate-600">
                    Share your experience with this laborer.
                </p>

                <div className="mt-5">
                    <span className="text-sm font-semibold text-slate-800">
                        Rating <span className="text-red-600">*</span>
                    </span>
                    <div className="mt-2 flex flex-wrap gap-2">
                        {RATING_OPTIONS.map((rating) => (
                            <label
                                key={rating}
                                className={`cursor-pointer rounded-xl border px-3 py-2 transition ${
                                    Number(values.rating) === rating
                                        ? "border-amber-400 bg-amber-50 text-amber-700 ring-2 ring-amber-100"
                                        : "border-slate-200 bg-white text-slate-500 hover:border-amber-300"
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="rating"
                                    value={rating}
                                    checked={Number(values.rating) === rating}
                                    onChange={handleChange}
                                    required
                                    aria-invalid={Boolean(errors.rating)}
                                    aria-describedby={
                                        errors.rating
                                            ? "review-rating-error"
                                            : undefined
                                    }
                                    className="sr-only"
                                />
                                <span aria-hidden="true">★</span>
                                <span className="ml-1 text-sm font-semibold">
                                    {rating}
                                </span>
                                <span className="sr-only">
                                    {rating} out of 5 stars
                                </span>
                            </label>
                        ))}
                    </div>
                    <FormFieldError
                        id="review-rating-error"
                        message={errors.rating}
                    />
                </div>
            </fieldset>

            <div className="mt-5">
                <label
                    htmlFor="review-comment"
                    className="text-sm font-semibold text-slate-800"
                >
                    Comment
                    <span className="ml-1 font-normal text-slate-500">
                        (optional)
                    </span>
                </label>
                <textarea
                    id="review-comment"
                    name="comment"
                    rows="4"
                    value={values.comment}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.comment)}
                    aria-describedby={
                        errors.comment ? "review-comment-error" : undefined
                    }
                    placeholder="Describe the quality, communication, and reliability"
                    className="mt-2 w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-3 focus:ring-brand-100"
                />
                <FormFieldError
                    id="review-comment-error"
                    message={errors.comment}
                />
            </div>

            {submitError && (
                <div
                    className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                    role="alert"
                >
                    <p className="font-semibold">Review was not submitted</p>
                    <p className="mt-1">{submitError}</p>
                </div>
            )}

            {successMessage && (
                <p
                    className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-800"
                    role="status"
                >
                    {successMessage}
                </p>
            )}

            <button
                type="submit"
                disabled={isSubmitting}
                className="mt-5 w-full rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 disabled:cursor-not-allowed disabled:bg-brand-300 sm:w-auto"
            >
                {isSubmitting ? "Submitting review..." : "Submit review"}
            </button>
        </form>
    );
}


export default ReviewForm;
