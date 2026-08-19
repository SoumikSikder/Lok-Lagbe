import RatingDisplay from "./RatingDisplay.jsx";


const DATE_FORMATTER = new Intl.DateTimeFormat("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
});


/**
 * Format a review timestamp safely.
 *
 * @param {string} value ISO date string.
 * @returns {string} Human-readable review date.
 */
function _formatDate(value) {
    const date = new Date(value);
    return Number.isNaN(date.getTime())
        ? "Date unavailable"
        : DATE_FORMATTER.format(date);
}


/**
 * Display all reviews belonging to one labor profile.
 *
 * @param {object} props Component properties.
 * @param {Array<object>} props.reviews Labor review records.
 * @returns {JSX.Element} Review list or no-review message.
 */
function ReviewList({ reviews }) {
    if (!reviews.length) {
        return (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
                <p className="font-semibold text-slate-900">No reviews yet</p>
                <p className="mt-2 text-sm text-slate-600">
                    This laborer has not received written feedback.
                </p>
            </div>
        );
    }

    return (
        <ul className="space-y-4">
            {reviews.map((review) => (
                <li
                    key={review.id}
                    className="rounded-2xl border border-slate-200 bg-white p-5"
                >
                    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                        <div>
                            <p className="font-semibold text-slate-900">
                                {review.user_name || `User #${review.user}`}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                                {_formatDate(review.date)}
                            </p>
                        </div>
                        <RatingDisplay
                            rating={review.rating}
                            showReviewCount={false}
                        />
                    </div>
                    <p className="mt-4 text-sm leading-6 text-slate-600">
                        {review.comment || "No written comment."}
                    </p>
                </li>
            ))}
        </ul>
    );
}


export default ReviewList;
