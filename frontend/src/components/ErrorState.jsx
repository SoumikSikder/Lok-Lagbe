/**
 * Display a recoverable API error.
 *
 * @param {object} props Component properties.
 * @param {string} [props.title] Error heading.
 * @param {string} props.message User-friendly error message.
 * @param {Function} props.onRetry Retry callback.
 * @returns {JSX.Element} Error message with retry action.
 */
function ErrorState({
    title = "We could not load the labor listings",
    message,
    onRetry,
}) {
    return (
        <div
            className="rounded-2xl border border-red-200 bg-red-50 px-6 py-10 text-center"
            role="alert"
        >
            <div
                className="mx-auto flex size-12 items-center justify-center rounded-full bg-red-100 text-xl font-bold text-red-700"
                aria-hidden="true"
            >
                !
            </div>
            <h2 className="mt-4 text-lg font-semibold text-red-900">
                {title}
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-red-700">
                {message}
            </p>
            <button
                type="button"
                onClick={onRetry}
                className="mt-6 rounded-xl bg-red-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
            >
                Try again
            </button>
        </div>
    );
}


export default ErrorState;
