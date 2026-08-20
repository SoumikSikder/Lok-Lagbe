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
