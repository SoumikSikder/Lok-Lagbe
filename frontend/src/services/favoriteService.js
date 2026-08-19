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
