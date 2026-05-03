import { apiClient } from './apiClient';

export const itineraryService = {
    // Vuelos
    getFlights: async (tripId: string) => {
        return await apiClient(`/itinerary/${tripId}/flights`);
    },
    addFlight: async (tripId: string, flight: any) => {
        return await apiClient(`/itinerary/${tripId}/flights`, {
            method: 'POST',
            body: JSON.stringify(flight)
        });
    },
    updateFlight: async (flightId: string, data: any) =>
        apiClient(`/itinerary/flights/${flightId}`, { method: 'PATCH', body: JSON.stringify(data) }),
    deleteFlight: async (flightId: string) => {
        return await apiClient(`/itinerary/flights/${flightId}`, {
            method: 'DELETE'
        });
    },

    // Hoteles
    getHotels: async (tripId: string) => {
        return await apiClient(`/itinerary/${tripId}/hotels`);
    },
    addHotel: async (tripId: string, hotel: any) => {
        return await apiClient(`/itinerary/${tripId}/hotels`, {
            method: 'POST',
            body: JSON.stringify(hotel)
        });
    },
    updateHotel: async (hotelId: string, data: any) =>
        apiClient(`/itinerary/hotels/${hotelId}`, { method: 'PATCH', body: JSON.stringify(data) }),
    deleteHotel: async (hotelId: string) => {
        return await apiClient(`/itinerary/hotels/${hotelId}`, {
            method: 'DELETE'
        });
    }
};