import { useMemo, useState } from "react";
import { Link } from "react-router";
import EmptyState from "../components/EmptyState.jsx";
import LaborCard from "../components/LaborCard.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import SearchBar from "../components/SearchBar.jsx";
import { useFavorites } from "../context/FavoritesContext.jsx";

function FavoritesPage() {
    const { favorites, isLoading } = useFavorites();
    const [searchQuery, setSearchQuery] = useState("");

    const filteredFavorites = useMemo(() => {
        if (!searchQuery.trim()) return favorites;
        const q = searchQuery.toLowerCase();
        return favorites.filter((fav) => {
            const labor = fav.labor_detail || {};
            return (
                (labor.name || "").toLowerCase().includes(q) ||
                (labor.profession || "").toLowerCase().includes(q) ||
                (labor.category || "").toLowerCase().includes(q) ||
                (labor.location || "").toLowerCase().includes(q)
            );
        });
    }, [favorites, searchQuery]);

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <span>❤️</span> Favorite Laborers
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Your saved local workers for fast re-hiring and quick access.
                    </p>
                </div>
                <Link
                    to="/labors"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-lg shadow-sm transition-colors self-start md:self-auto"
                >
                    <span>🔍</span> Browse All Laborers
                </Link>
            </div>

            {/* Search within favorites if favorites exist */}
            {favorites.length > 0 && (
                <div className="mb-8">
                    <SearchBar
                        value={searchQuery}
                        onChange={setSearchQuery}
                        placeholder="Search your favorite laborers by name, profession, or location..."
                    />
                </div>
            )}

            {/* Content States */}
            {isLoading ? (
                <div className="py-16 text-center">
                    <LoadingSpinner message="Loading favorite laborers..." />
                </div>
            ) : favorites.length === 0 ? (
                <EmptyState
                    title="No Favorites Saved Yet"
                    message="Save reliable workers to your favorites list for quick access whenever you need help!"
                    actionLabel="Explore Skilled Laborers"
                    actionTo="/labors"
                />
            ) : filteredFavorites.length === 0 ? (
                <div className="py-12 text-center bg-gray-50 dark:bg-gray-800/40 rounded-2xl border border-gray-200 dark:border-gray-800">
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                        No favorite laborer matches "{searchQuery}".
                    </p>
                    <button
                        type="button"
                        onClick={() => setSearchQuery("")}
                        className="mt-3 text-xs font-semibold text-emerald-600 hover:underline cursor-pointer"
                    >
                        Clear Search
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredFavorites.map((fav) => {
                        const labor = fav.labor_detail || {
                            id: fav.labor,
                            name: `Labor #${fav.labor}`,
                            profession: "Service Provider",
                            hourly_wage: "0.00",
                        };

                        return <LaborCard key={fav.id || labor.id} labor={labor} />;
                    })}
                </div>
            )}
        </div>
    );
}

export default FavoritesPage;
