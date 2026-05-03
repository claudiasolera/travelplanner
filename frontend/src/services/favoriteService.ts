import { apiClient } from "./apiClient";

export const favoriteService = {
    getFavorites: () => apiClient('/favorites'),

    addFavorite: (data: { idItem: number; type: string }) => apiClient('/favorites', {
        method: 'POST',
        body: JSON.stringify(data)
    }),

    removeFavorite: (idFavorite: number) => apiClient(`/favorites/${idFavorite}`, {
        method: 'DELETE'
    })
};