import { apiClient } from "./apiClient";

export const tripService = {
    getUserTrips: () => apiClient('/trips'),
    
    getExploreFeed: () => apiClient('/trips/explore'),
    
    getTripById: (id: string | number) => apiClient(`/trips/${id}`),

    createTrip: (data: any) => apiClient('/trips', {
        method: 'POST',
        body: JSON.stringify(data)
    }),

    deleteTrip: async (id: string) => {
        return apiClient(`/trips/${id}`, { method: 'DELETE' });
    },

    updateTrip: (id: string, data: any) => apiClient(`/trips/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data)
    }),

    getPublicTrip: async (id: string) => {
        return apiClient(`/trips/${id}/public`);
    },

    cloneTrip: async (id: string, startDate: string, endDate: string) => {
        return apiClient(`/trips/${id}/clone`, {
            method: 'POST',
            body: JSON.stringify({ startDate, endDate })
        });
    },

    saveTrip: (tripId: string) => apiClient(`/trips/${tripId}/save`, { method: 'POST' }),
    
    unsaveTrip: (tripId: string) => apiClient(`/trips/${tripId}/save`, { method: 'DELETE' }),

    getTripComments: (tripId: string) => apiClient(`/trips/${tripId}/comments`),

    likeTrip: (tripId: string) => apiClient(`/trips/${tripId}/like`, { method: 'POST' }),
    
    unlikeTrip: (tripId: string) => apiClient(`/trips/${tripId}/like`, { method: 'DELETE' }),
    
    getSavedTrips: () => apiClient('/trips/saved'),

    addComment: (tripId: number, comment: string) => apiClient(`/trips/${tripId}/comments`, {
        method: 'POST',
        body: JSON.stringify({ commentText: comment })
    }),

    addActivity: (itineraryId: string, data: any) => apiClient(`/trips/itinerary/${itineraryId}`, {
        method: 'PATCH',
        body: JSON.stringify(data)
    }),

    deleteActivity: (itineraryId: string, activityId: string) =>
        apiClient(`/trips/itinerary/${itineraryId}/${activityId}`, {
            method: 'DELETE'
        }),

    addActivityPhoto: (itineraryId: string, activityId: string, file: File) => {
        const formData = new FormData();
        formData.append('photo', file);
        return apiClient(`/trips/itinerary/${itineraryId}/${activityId}/photo`, {
            method: 'POST',
            body: formData
        });
    },

    updateItineraryNotes: (itineraryId: string, data: { notes?: string; title?: string }) =>
        apiClient(`/trips/itinerary/${itineraryId}/notes`, {
            method: 'PATCH',
            body: JSON.stringify(data)
        }),

    getItineraries: (tripId: string) => apiClient(`/trips/${tripId}`),

    getPdfUrl: (id: number) => `http://localhost:5000/trips/${id}/pdf`,

    getCollaborators: (tripId: string) =>
        apiClient(`/trips/${tripId}/collaborators`),

    addCollaborator: (tripId: string, userId: string) =>
        apiClient(`/trips/${tripId}/collaborators`, {
            method: 'POST',
            body: JSON.stringify({ userId })
        }),

    removeCollaborator: (tripId: string, userId: string) =>
        apiClient(`/trips/${tripId}/collaborators/${userId}`, {
            method: 'DELETE'
        }),

    getExpenses: (tripId: string) => apiClient(`/trips/${tripId}/expenses`),

    addExpense: (tripId: string, data: { category: string; name: string; amount: number; currency?: string; date?: string }) =>
        apiClient(`/trips/${tripId}/expenses`, {
            method: 'POST',
            body: JSON.stringify(data)
        }),

    deleteExpense: (tripId: string, expenseId: string) =>
        apiClient(`/trips/${tripId}/expenses/${expenseId}`, {
            method: 'DELETE'
        }),
    
    getSavedTransports: async (tripId: string) => {
        return apiClient(`/trips/${tripId}/transports`);
    },
    saveTransport: async (tripId: string, data: any) => {
        return apiClient(`/trips/${tripId}/transports`, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },
    deleteTransport: async (tripId: string, transportId: string) => {
        return apiClient(`/trips/${tripId}/transports/${transportId}`, { method: 'DELETE' });
    },

};