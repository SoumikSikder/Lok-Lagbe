import { useState } from "react";
import { useParams } from "react-router";

import ErrorState from "../components/ErrorState.jsx";
import LaborDetailsContent from "../components/LaborDetailsContent.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import useLaborDetails from "../hooks/useLaborDetails.js";
import { createReview } from "../services/reviewService.js";


/**
 * Fetch and render the labor profile selected by the route parameter.
 *
 * @returns {JSX.Element} Loading, error, or complete labor details content.
 */
function LaborDetailsPage() {
    const { laborId } = useParams();
    const { labor, isLoading, error, retry } = useLaborDetails(laborId);
    const [reviewSuccessMessage, setReviewSuccessMessage] = useState("");

    async function _handleReviewSubmit(reviewData) {
        const review = await createReview({
            labor: labor.id,
            ...reviewData,
        });
        setReviewSuccessMessage("Review submitted successfully.");
        retry();
        return review;
    }

    return (
        <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            {isLoading && (
                <LoadingSpinner label="Loading labor profile" />
            )}

            {!isLoading && error && (
                <ErrorState
                    title={
                        error.status === 404
                            ? "Labor profile not found"
                            : "We could not load this labor profile"
                    }
                    message={error.message}
                    onRetry={retry}
                />
            )}

            {!isLoading && !error && labor && (
                <LaborDetailsContent
                    labor={labor}
                    onReviewSubmit={_handleReviewSubmit}
                    reviewSuccessMessage={reviewSuccessMessage}
                />
            )}
        </main>
    );
}


export default LaborDetailsPage;
