import { Link } from "react-router";

import PagePlaceholder from "../components/PagePlaceholder.jsx";


/**
 * Render a fallback for unknown frontend routes.
 *
 * @returns {JSX.Element} The HTTP-style not-found interface.
 */
function NotFoundPage() {
    return (
        <PagePlaceholder
            eyebrow="404 error"
            title="Page not found"
            description="The page may have moved, or the address may be incorrect."
        >
            <Link
                to="/labors"
                className="inline-flex rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
            >
                Return to labor listings
            </Link>
        </PagePlaceholder>
    );
}


export default NotFoundPage;
