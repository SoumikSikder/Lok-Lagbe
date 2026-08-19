import { useState } from "react";


/**
 * Collect and validate a labor search term.
 *
 * @param {object} props Component properties.
 * @param {string} props.initialValue Currently applied search term.
 * @param {Function} props.onSearch Apply a non-empty search term.
 * @param {Function} props.onClear Remove the active search term.
 * @returns {JSX.Element} Search form and validation feedback.
 */
function SearchBar({ initialValue, onSearch, onClear }) {
    const [searchTerm, setSearchTerm] = useState(initialValue);
    const [error, setError] = useState("");

    function _handleSubmit(event) {
        event.preventDefault();
        const trimmedSearch = searchTerm.trim();

        if (!trimmedSearch) {
            setError("Enter a labor name, type of work, or location.");
            return;
        }

        setError("");
        onSearch(trimmedSearch);
    }

    function _handleChange(event) {
        setSearchTerm(event.target.value);
        if (error) {
            setError("");
        }
    }

    function _handleClear() {
        setSearchTerm("");
        setError("");
        onClear();
    }

    return (
        <form onSubmit={_handleSubmit} noValidate>
            <label
                htmlFor="labor-search"
                className="sr-only"
            >
                Search laborers
            </label>
            <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                    <span
                        className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400"
                        aria-hidden="true"
                    >
                        ⌕
                    </span>
                    <input
                        id="labor-search"
                        type="search"
                        value={searchTerm}
                        onChange={_handleChange}
                        placeholder="Name, profession, or location"
                        aria-describedby={error ? "labor-search-error" : undefined}
                        aria-invalid={Boolean(error)}
                        className="w-full rounded-xl border border-slate-300 bg-white py-4 pl-11 pr-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-3 focus:ring-brand-100"
                    />
                </div>
                <div className="flex gap-3">
                    {(initialValue || searchTerm) && (
                        <button
                            type="button"
                            onClick={_handleClear}
                            className="rounded-xl border border-slate-300 bg-white px-5 py-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                        >
                            Clear
                        </button>
                    )}
                    <button
                        type="submit"
                        className="flex-1 rounded-xl bg-brand-600 px-6 py-4 text-sm font-semibold text-white transition hover:bg-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 sm:flex-none"
                    >
                        Search
                    </button>
                </div>
            </div>
            {error && (
                <p
                    id="labor-search-error"
                    className="mt-2 text-sm text-red-700"
                    role="alert"
                >
                    {error}
                </p>
            )}
        </form>
    );
}


export default SearchBar;
