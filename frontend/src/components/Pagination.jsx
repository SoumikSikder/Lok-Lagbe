/**
 * Display numbered controls for one-based API pagination.
 *
 * @param {object} props Component properties.
 * @param {number} props.currentPage Active page number.
 * @param {number} props.pageCount Total number of available pages.
 * @param {boolean} props.hasNextPage Whether Django returned a next URL.
 * @param {boolean} props.hasPreviousPage Whether Django returned a previous URL.
 * @param {Function} props.onPageChange Select a different page.
 * @returns {JSX.Element|null} Accessible numbered pagination controls.
 */
function Pagination({
    currentPage,
    pageCount,
    hasNextPage,
    hasPreviousPage,
    onPageChange,
}) {
    if (pageCount <= 1) {
        return null;
    }

    const pages = Array.from({ length: pageCount }, (_, index) => index + 1);

    return (
        <nav
            className="mt-10 flex flex-wrap items-center justify-center gap-2"
            aria-label="Labor listing pages"
        >
            <button
                type="button"
                disabled={!hasPreviousPage}
                onClick={() => onPageChange(currentPage - 1)}
                className="flex size-10 items-center justify-center rounded-xl border border-slate-300 bg-white text-xl font-semibold text-slate-700 transition hover:border-brand-400 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-35"
                aria-label="Previous page"
            >
                ‹
            </button>

            {pages.map((page) => (
                <button
                    key={page}
                    type="button"
                    onClick={() => onPageChange(page)}
                    aria-current={page === currentPage ? "page" : undefined}
                    className={`flex size-10 items-center justify-center rounded-xl border text-sm font-bold transition ${
                        page === currentPage
                            ? "border-brand-600 bg-brand-600 text-white"
                            : "border-slate-300 bg-white text-slate-700 hover:border-brand-400 hover:text-brand-700"
                    }`}
                >
                    {page}
                </button>
            ))}

            <button
                type="button"
                disabled={!hasNextPage}
                onClick={() => onPageChange(currentPage + 1)}
                className="flex size-10 items-center justify-center rounded-xl border border-slate-300 bg-white text-xl font-semibold text-slate-700 transition hover:border-brand-400 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-35"
                aria-label="Next page"
            >
                ›
            </button>
        </nav>
    );
}


export default Pagination;
