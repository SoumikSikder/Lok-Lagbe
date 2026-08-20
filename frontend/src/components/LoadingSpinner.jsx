/**
 * Display an accessible loading indicator.
 *
 * @param {object} props Component properties.
 * @param {string} [props.label="Loading"] Accessible loading message.
 * @returns {JSX.Element} Animated loading indicator.
 */
function LoadingSpinner({ label = "Loading" }) {
    return (
        <div
            className="flex items-center justify-center gap-3 py-12 text-slate-600"
            role="status"
        >
            <span
                className="size-7 animate-spin rounded-full border-3 border-brand-100 border-t-brand-600"
                aria-hidden="true"
            />
            <span className="text-sm font-medium">{label}</span>
        </div>
    );
}


export default LoadingSpinner;
