# Tanzim Ahamad's Frontend Features: View Hire History & Manage Favorite Laborers

This document consolidates all React components, context, services, and pages implemented for Tanzim's assigned features, adhering strictly to the project Coding Standard.

---

## 1. Services

### A. Favorite Service (`frontend/src/services/favoriteService.js`)
```javascript
import API_CLIENT from "./apiClient.js";

/**
 * Fetch all favorite laborers for the current user.
 *
 * @param {AbortSignal} [signal] Optional abort signal.
 * @returns {Promise<Array>} List of favorite objects.
 */
async function getFavorites(signal) {
    const response = await API_CLIENT.get("favorites/", { signal });
    return response.data;
}

/**
 * Add a laborer to user's favorites.
 *
 * @param {number|string} laborId ID of the laborer.
 * @returns {Promise<Object>} Created favorite object.
 */
async function addFavorite(laborId) {
    const response = await API_CLIENT.post("favorites/", { labor: laborId });
    return response.data;
}

/**
 * Remove a favorite entry by favorite ID.
 *
 * @param {number|string} favoriteId ID of the favorite record.
 * @returns {Promise<void>}
 */
async function deleteFavorite(favoriteId) {
    await API_CLIENT.delete(`favorites/${encodeURIComponent(favoriteId)}/`);
}

export { addFavorite, deleteFavorite, getFavorites };
```

### B. Hire History Service Method (`frontend/src/services/bookingService.js`)
```javascript
import API_CLIENT from "./apiClient.js";

/**
 * Fetch booking / hire history for the authenticated user.
 *
 * @param {Object} [parameters] Query parameters e.g. { status: 'pending' }.
 * @param {AbortSignal} [signal] Optional abort signal.
 * @returns {Promise<Array>} List of booking objects.
 */
async function getBookingHistory(parameters = {}, signal) {
    const response = await API_CLIENT.get("bookings/history/", {
        params: parameters,
        signal,
    });
    return response.data;
}

export { getBookingHistory };
```

---

## 2. Favorites Context (`frontend/src/context/FavoritesContext.jsx`)
```jsx
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { addFavorite, deleteFavorite, getFavorites } from "../services/favoriteService.js";

const FavoritesContext = createContext({
    favorites: [],
    favoriteIds: new Set(),
    isLoading: false,
    isFavorite: () => false,
    toggleFavorite: async () => {},
    refreshFavorites: async () => {},
});

export function FavoritesProvider({ children }) {
    const [favorites, setFavorites] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [favoriteIds, setFavoriteIds] = useState(new Set());

    const refreshFavorites = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getFavorites();
            const list = Array.isArray(data) ? data : (data.results || []);
            setFavorites(list);
            const ids = new Set(list.map((item) => Number(item.labor || item.labor_detail?.id)));
            setFavoriteIds(ids);
        } catch (error) {
            console.warn("Could not load favorites from API:", error?.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        refreshFavorites();
    }, [refreshFavorites]);

    const isFavorite = useCallback((laborId) => {
        return favoriteIds.has(Number(laborId));
    }, [favoriteIds]);

    const toggleFavorite = useCallback(async (labor) => {
        const laborId = Number(labor.id || labor);
        const existingFav = favorites.find(
            (item) => Number(item.labor || item.labor_detail?.id) === laborId
        );

        if (existingFav) {
            setFavorites((prev) => prev.filter((item) => item.id !== existingFav.id));
            setFavoriteIds((prev) => {
                const next = new Set(prev);
                next.delete(laborId);
                return next;
            });
            try {
                await deleteFavorite(existingFav.id);
            } catch (err) {
                refreshFavorites();
            }
        } else {
            const tempFav = {
                id: Date.now(),
                labor: laborId,
                labor_detail: labor,
                created_at: new Date().toISOString(),
            };
            setFavorites((prev) => [tempFav, ...prev]);
            setFavoriteIds((prev) => new Set(prev).add(laborId));
            try {
                const newFav = await addFavorite(laborId);
                setFavorites((prev) =>
                    prev.map((item) => (item.id === tempFav.id ? newFav : item))
                );
            } catch (err) {
                refreshFavorites();
            }
        }
    }, [favorites, refreshFavorites]);

    return (
        <FavoritesContext.Provider
            value={{
                favorites,
                favoriteIds,
                favoritesCount: favorites.length,
                isLoading,
                isFavorite,
                toggleFavorite,
                refreshFavorites,
            }}
        >
            {children}
        </FavoritesContext.Provider>
    );
}

export function useFavorites() {
    return useContext(FavoritesContext);
}
```

---

## 3. Favorite Button Component (`frontend/src/components/FavoriteButton.jsx`)
```jsx
import { useState } from "react";
import { useFavorites } from "../context/FavoritesContext.jsx";

/**
 * Interactive heart toggle button for favoriting a laborer.
 *
 * @param {Object} props
 * @param {Object} props.labor Laborer object containing id, name, etc.
 * @param {string} [props.className] Custom CSS classes.
 * @param {boolean} [props.showLabel=false] Whether to show text label next to heart.
 * @returns {JSX.Element}
 */
function FavoriteButton({ labor, className = "", showLabel = false }) {
    const { isFavorite, toggleFavorite } = useFavorites();
    const [isAnimating, setIsAnimating] = useState(false);
    const active = isFavorite(labor?.id);

    const handleClick = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 300);
        await toggleFavorite(labor);
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            title={active ? "Remove from Favorites" : "Add to Favorites"}
            aria-label={active ? "Remove from Favorites" : "Add to Favorites"}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer shadow-sm ${
                active
                    ? "bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-rose-300 hover:text-rose-500 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
            } ${isAnimating ? "scale-125" : "scale-100"} ${className}`}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill={active ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`w-4 h-4 transition-transform ${
                    active ? "text-rose-500 fill-rose-500" : "text-gray-400"
                }`}
            >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
            {showLabel && (
                <span>{active ? "Favorited" : "Favorite"}</span>
            )}
        </button>
    );
}

export default FavoriteButton;
```

---

## 4. Pages

### A. View Hire History Page (`frontend/src/pages/HireHistoryPage.jsx`)
```jsx
import { useEffect, useState } from "react";
import { Link } from "react-router";
import EmptyState from "../components/EmptyState.jsx";
import ErrorState from "../components/ErrorState.jsx";
import FavoriteButton from "../components/FavoriteButton.jsx";
import LaborPhoto from "../components/LaborPhoto.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import RatingDisplay from "../components/RatingDisplay.jsx";
import { getBookingHistory } from "../services/bookingService.js";

/**
 * Get CSS badge styling classes based on booking status.
 *
 * @param {string} status Booking status e.g. "pending", "accepted", "completed", "rejected".
 * @returns {string} Tailwind CSS badge styling classes.
 */
function _getStatusBadge(status) {
    const s = (status || "").toLowerCase();
    switch (s) {
        case "accepted":
            return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800";
        case "completed":
            return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800";
        case "rejected":
        case "cancelled":
            return "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800";
        case "pending":
        default:
            return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800";
    }
}

/**
 * Render the Hire History page displaying user's past and active service hires.
 *
 * @returns {JSX.Element} Interactive hire history list with status filtering.
 */
function HireHistoryPage() {
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);
    const [activeTab, setActiveTab] = useState("all");

    const fetchHistory = async (statusFilter = "") => {
        setIsLoading(true);
        setErrorMessage(null);
        try {
            const params = statusFilter && statusFilter !== "all" ? { status: statusFilter } : {};
            const data = await getBookingHistory(params);
            const list = Array.isArray(data) ? data : (data.results || []);
            setBookings(list);
        } catch (err) {
            setErrorMessage(err?.message || "Failed to load your hire history. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory(activeTab);
    }, [activeTab]);

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <span>📋</span> View Hire History
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Track your past & active service hires across Bangladesh.
                    </p>
                </div>
                <Link to="/labors" className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-lg shadow-sm transition-colors">
                    <span>➕</span> Hire New Laborer
                </Link>
            </div>

            <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-800 mb-6 overflow-x-auto pb-2">
                {[
                    { key: "all", label: "All Hires" },
                    { key: "pending", label: "Pending" },
                    { key: "accepted", label: "Accepted" },
                    { key: "completed", label: "Completed" },
                    { key: "rejected", label: "Rejected" },
                ].map((tab) => (
                    <button
                        key={tab.key}
                        type="button"
                        onClick={() => setActiveTab(tab.key)}
                        className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors cursor-pointer ${
                            activeTab === tab.key
                                ? "bg-emerald-50 text-emerald-700 border-b-2 border-emerald-600"
                                : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {isLoading ? (
                <div className="py-16 text-center">
                    <LoadingSpinner message="Loading your hire history..." />
                </div>
            ) : errorMessage ? (
                <ErrorState title="Could Not Load Hire History" message={errorMessage} onRetry={() => fetchHistory(activeTab)} />
            ) : bookings.length === 0 ? (
                <EmptyState title="No Hire Records Found" message="You haven't hired any local workers yet." actionLabel="Find Workers" actionTo="/labors" />
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {bookings.map((booking) => {
                        const hourlyWage = Number(booking.labor_hourly_wage || 0);
                        const durationHrs = Number(booking.duration || 1);
                        const totalCost = (hourlyWage * durationHrs).toFixed(2);
                        const laborObj = {
                            id: booking.labor,
                            name: booking.labor_name,
                            profession: booking.labor_profession,
                            photo: booking.labor_photo,
                            hourly_wage: booking.labor_hourly_wage,
                        };

                        return (
                            <div key={booking.id} className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col md:flex-row gap-6 justify-between">
                                <div className="flex gap-4 items-start">
                                    <LaborPhoto photoUrl={booking.labor_photo} name={booking.labor_name} className="w-16 h-16 rounded-xl object-cover" />
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <Link to={`/labors/${booking.labor}`} className="text-lg font-bold text-gray-900 hover:text-emerald-600">
                                                {booking.labor_name || `Labor #${booking.labor}`}
                                            </Link>
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${_getStatusBadge(booking.status)}`}>
                                                {booking.status_display || booking.status}
                                            </span>
                                        </div>
                                        {booking.labor_profession && <p className="text-sm font-medium text-emerald-600">{booking.labor_profession}</p>}
                                        {booking.labor_rating && <div className="mt-1"><RatingDisplay rating={Number(booking.labor_rating)} /></div>}
                                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs text-gray-600">
                                            <div><span className="font-semibold">📅 Work Date:</span> {booking.work_date}</div>
                                            <div><span className="font-semibold">⏰ Start Time:</span> {booking.start_time}</div>
                                            <div><span className="font-semibold">⏳ Duration:</span> {booking.duration} hrs</div>
                                            <div><span className="font-semibold">📍 Address:</span> {booking.address}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end justify-between gap-4">
                                    <div>
                                        <p className="text-xs text-gray-500">Est. Total Cost</p>
                                        <p className="text-xl font-bold text-emerald-600">৳{totalCost}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FavoriteButton labor={laborObj} showLabel={false} />
                                        <Link to={`/labors/${booking.labor}/hire`} className="px-3.5 py-1.5 bg-emerald-600 text-white text-xs font-semibold rounded-lg">Hire Again</Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default HireHistoryPage;
```

### B. Manage Favorites Page (`frontend/src/pages/FavoritesPage.jsx`)
```jsx
import { useMemo, useState } from "react";
import { Link } from "react-router";
import EmptyState from "../components/EmptyState.jsx";
import LaborCard from "../components/LaborCard.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import SearchBar from "../components/SearchBar.jsx";
import { useFavorites } from "../context/FavoritesContext.jsx";

/**
 * Render the Favorites page showing user's saved favorite laborers.
 *
 * @returns {JSX.Element} Interactive list of favorited laborers with search filtering.
 */
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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
                        <span>❤️</span> Favorite Laborers
                    </h1>
                    <p className="text-sm text-gray-600 mt-1">
                        Your saved local workers for fast re-hiring and quick access.
                    </p>
                </div>
                <Link to="/labors" className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white font-medium text-sm rounded-lg">
                    <span>🔍</span> Browse All Laborers
                </Link>
            </div>

            {favorites.length > 0 && (
                <div className="mb-8">
                    <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search your favorite laborers..." />
                </div>
            )}

            {isLoading ? (
                <div className="py-16 text-center"><LoadingSpinner message="Loading favorite laborers..." /></div>
            ) : favorites.length === 0 ? (
                <EmptyState title="No Favorites Saved Yet" message="Save reliable workers to your favorites list!" actionLabel="Explore Skilled Laborers" actionTo="/labors" />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredFavorites.map((fav) => {
                        const labor = fav.labor_detail || { id: fav.labor, name: `Labor #${fav.labor}` };
                        return <LaborCard key={fav.id || labor.id} labor={labor} />;
                    })}
                </div>
            )}
        </div>
    );
}

export default FavoritesPage;
```
