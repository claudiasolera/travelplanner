const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const headers = () => ({
    Authorization: `Bearer ${localStorage.getItem('token')}`
});

export const photoService = {
    getPhotos: async (tripId: string) => {
        const res = await fetch(`${BASE}/trips/${tripId}/photos`, { headers: headers() });
        return res.json();
    },
    uploadPhoto: async (tripId: string, file: File) => {
        const form = new FormData();
        form.append('photo', file);
        const res = await fetch(`${BASE}/trips/${tripId}/photos`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            body: form
        });
        return res.json();
    },
    deletePhoto: async (tripId: string, photoId: string) => {
        await fetch(`${BASE}/trips/${tripId}/photos/${photoId}`, {
            method: 'DELETE',
            headers: headers()
        });
    }
};