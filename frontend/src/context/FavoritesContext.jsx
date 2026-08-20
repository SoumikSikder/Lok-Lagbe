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
            // Silently handle auth errors for demo mode
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
            // Optimistic removal
            setFavorites((prev) => prev.filter((item) => item.id !== existingFav.id));
            setFavoriteIds((prev) => {
                const next = new Set(prev);
                next.delete(laborId);
                return next;
            });
            try {
                await deleteFavorite(existingFav.id);
            } catch (err) {
                console.error("Failed to delete favorite:", err);
                refreshFavorites();
            }
        } else {
            // Optimistic addition
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
                console.error("Failed to add favorite:", err);
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
