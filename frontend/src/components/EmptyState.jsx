/**
 * Display a friendly message when no labor profiles match.
 *
 * @param {object} props Component properties.
 * @param {Function} [props.onReset] Optional reset-search callback.
 * @returns {JSX.Element} Empty listing message.
 */
function EmptyState({ onReset }) {
    return (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
            <div
                className="mx-auto flex size-12 items-center justify-center rounded-full bg-slate-100 text-2xl"
                aria-hidden="true"
            >
                ⌕
            </div>
            <h2 className="mt-4 text-lg font-semibold text-slate-900">
                No labor found
            </h2>
            <p className="mt-2 text-sm text-slate-600">
                Try another search term or use a wider filter range.
            </p>
            {onReset && (
                <button
                    type="button"
                    onClick={onReset}
                    className="mt-6 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                >
                    Clear search and filters
                </button>
            )}
        </div>
    );
}


export default EmptyState;
