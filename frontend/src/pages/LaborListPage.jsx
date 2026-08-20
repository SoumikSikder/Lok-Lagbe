import { useMemo, useState } from "react";
import { useSearchParams } from "react-router";

import EmptyState from "../components/EmptyState.jsx";
import ErrorState from "../components/ErrorState.jsx";
import LaborCard from "../components/LaborCard.jsx";
import LaborFilters from "../components/LaborFilters.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import Pagination from "../components/Pagination.jsx";
import SearchBar from "../components/SearchBar.jsx";
import useLabors from "../hooks/useLabors.js";


const DEFAULT_SORT = "highest_rated";
const PAGE_SIZE = 8;


/**
 * Render the searchable, filterable, and paginated labor marketplace.
 *
 * @returns {JSX.Element} Complete labor list and request states.
 */
function LaborListPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const rating = searchParams.get("rating") || "";
    const minimumWage = searchParams.get("min_wage") || "";
    const maximumWage = searchParams.get("max_wage") || "";
    const sort = searchParams.get("sort") || DEFAULT_SORT;
    const pageValue = Number(searchParams.get("page") || 1);
    const currentPage = Number.isInteger(pageValue) && pageValue > 0
        ? pageValue
        : 1;
    const hasAppliedFilters = Boolean(
        category
        || rating
        || minimumWage
        || maximumWage
        || sort !== DEFAULT_SORT,
    );
    const [areFiltersOpen, setAreFiltersOpen] = useState(hasAppliedFilters);

    const laborParameters = useMemo(
        () => ({
            search,
            category,
            rating,
            min_wage: minimumWage,
            max_wage: maximumWage,
            sort,
            page_size: PAGE_SIZE,
        }),
        [search, category, rating, minimumWage, maximumWage, sort],
    );

    const {
        labors,
        totalCount,
        hasNextPage,
        hasPreviousPage,
        isLoading,
        error,
        retry,
    } = useLabors(laborParameters, currentPage);

    const pageCount = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
    const hasActiveSearchOrFilters = Boolean(search || hasAppliedFilters);

    function _setParameter(name, value, parameters) {
        if (value) {
            parameters.set(name, value);
        } else {
            parameters.delete(name);
        }
    }

    function _resetPage(parameters) {
        parameters.delete("page");
    }

    function _handleSearch(nextSearch) {
        const nextParameters = new URLSearchParams(searchParams);
        nextParameters.set("search", nextSearch);
        _resetPage(nextParameters);
        setSearchParams(nextParameters);
    }

    function _handleClearSearch() {
        const nextParameters = new URLSearchParams(searchParams);
        nextParameters.delete("search");
        _resetPage(nextParameters);
        setSearchParams(nextParameters);
    }

    function _handleApplyFilters(nextFilters) {
        const nextParameters = new URLSearchParams(searchParams);
        _setParameter("category", nextFilters.category, nextParameters);
        _setParameter("rating", nextFilters.rating, nextParameters);
        _setParameter("min_wage", nextFilters.min_wage, nextParameters);
        _setParameter("max_wage", nextFilters.max_wage, nextParameters);
        _setParameter(
            "sort",
            nextFilters.sort === DEFAULT_SORT ? "" : nextFilters.sort,
            nextParameters,
        );
        _resetPage(nextParameters);
        setSearchParams(nextParameters);
    }

    function _handleResetFilters() {
        const nextParameters = new URLSearchParams(searchParams);
        ["category", "rating", "min_wage", "max_wage", "sort"].forEach(
            (name) => nextParameters.delete(name),
        );
        _resetPage(nextParameters);
        setSearchParams(nextParameters);
    }

    function _handleResetAll() {
        setSearchParams({});
        setAreFiltersOpen(false);
    }

    function _handlePageChange(page) {
        if (page < 1 || page > pageCount || page === currentPage) {
            return;
        }

        const nextParameters = new URLSearchParams(searchParams);
        _setParameter("page", page === 1 ? "" : String(page), nextParameters);
        setSearchParams(nextParameters);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    return (
        <section
            className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8"
            aria-labelledby="labor-list-title"
        >
            <div className="border-b border-slate-200 pb-6">
                <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">
                    Labor marketplace
                </p>
                <h1
                    id="labor-list-title"
                    className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl"
                >
                    Find the right person for the job
                </h1>
                <p className="mt-3 text-slate-600">
                    Browse experienced workers available across Bangladesh.
                </p>
            </div>

            <div className="py-7">
                <div className="flex flex-col gap-3 lg:flex-row">
                    <div className="min-w-0 flex-1">
                        <SearchBar
                            key={`search-${search}`}
                            initialValue={search}
                            onSearch={_handleSearch}
                            onClear={_handleClearSearch}
                        />
                    </div>
                    <button
                        type="button"
                        onClick={() => setAreFiltersOpen((isOpen) => !isOpen)}
                        aria-expanded={areFiltersOpen}
                        aria-controls="labor-filter-panel"
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-4 text-sm font-bold text-slate-800 transition hover:border-brand-400 hover:bg-brand-50 hover:text-brand-700"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="size-5"
                            aria-hidden="true"
                        >
                            <path d="M4 5h16l-6 7v5l-4 2v-7L4 5Z" />
                        </svg>
                        Filters
                        {hasAppliedFilters && (
                            <span className="size-2 rounded-full bg-brand-600" />
                        )}
                    </button>
                </div>

                {areFiltersOpen && (
                    <div id="labor-filter-panel" className="mt-5">
                        <LaborFilters
                            key={`filters-${category}-${rating}-${minimumWage}-${maximumWage}-${sort}`}
                            initialValues={laborParameters}
                            onApply={_handleApplyFilters}
                            onReset={_handleResetFilters}
                        />
                    </div>
                )}
            </div>

            <div className="border-t border-slate-200 pt-6">
                {isLoading && (
                    <LoadingSpinner label="Loading labor listings" />
                )}

                {!isLoading && error && (
                    <ErrorState message={error.message} onRetry={retry} />
                )}

                {!isLoading && !error && labors.length === 0 && (
                    <EmptyState
                        onReset={
                            hasActiveSearchOrFilters
                                ? _handleResetAll
                                : undefined
                        }
                    />
                )}

                {!isLoading && !error && labors.length > 0 && (
                    <>
                        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                            <p
                                className="text-lg font-bold text-slate-900"
                                aria-live="polite"
                            >
                                {totalCount} {totalCount === 1
                                    ? "laborer"
                                    : "laborers"} available
                            </p>
                            <p className="text-sm text-slate-500">
                                Page {currentPage} of {pageCount}
                            </p>
                        </div>

                        <ul className="space-y-4">
                            {labors.map((labor) => (
                                <li key={labor.id}>
                                    <LaborCard labor={labor} />
                                </li>
                            ))}
                        </ul>

                        <Pagination
                            currentPage={currentPage}
                            pageCount={pageCount}
                            hasNextPage={hasNextPage}
                            hasPreviousPage={hasPreviousPage}
                            onPageChange={_handlePageChange}
                        />
                    </>
                )}
            </div>
        </section>
    );
}


export default LaborListPage;
