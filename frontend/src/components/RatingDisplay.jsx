/**
 * Display a numeric labor rating with accessible star indicators.
 *
 * @param {object} props Component properties.
 * @param {string|number} props.rating Average rating from zero to five.
 * @param {number} [props.reviewCount=0] Number of submitted reviews.
 * @param {boolean} [props.showReviewCount=true] Whether to show review count.
 * @returns {JSX.Element} Rating stars, value, and review count.
 */
function RatingDisplay({
    rating,
    reviewCount = 0,
    showReviewCount = true,
}) {
    const numericRating = Number(rating) || 0;
    const boundedRating = Math.min(5, Math.max(0, numericRating));
    const filledStars = Math.round(boundedRating);
    const formattedRating = boundedRating.toFixed(1);

    return (
        <div
            className="flex flex-wrap items-center gap-2"
            aria-label={
                showReviewCount
                    ? `${formattedRating} out of 5 stars from ${reviewCount} reviews`
                    : `${formattedRating} out of 5 stars`
            }
        >
            <span className="flex text-amber-400" aria-hidden="true">
                {Array.from({ length: 5 }, (_, index) => (
                    <span
                        key={index}
                        className={
                            index < filledStars
                                ? "text-amber-400"
                                : "text-slate-300"
                        }
                    >
                        ★
                    </span>
                ))}
            </span>
            <span className="text-sm font-semibold text-slate-800">
                {formattedRating}
            </span>
            {showReviewCount && (
                <span className="text-sm text-slate-500">
                    ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
                </span>
            )}
        </div>
    );
}


export default RatingDisplay;
