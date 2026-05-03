import { apiClient } from "./apiClient";

export interface FlightSearchParams {
    origin: string;
    destination: string;
    departureDate: string;
    returnDate?: string;
    adults: number;
    travelClass?: string;
}

export interface HotelSearchParams {
    city: string; 
    checkInDate: string;
    checkOutDate: string;
    adults: number;
    currency?: string;
}

export interface PlaceSearchParams {
    city?: string;
    lat?: number;
    lon?: number;
}

export const searchService = {
    searchFlights: async (params: FlightSearchParams) => {
        return await apiClient('/search/flights', {
            method: 'POST',
            body: JSON.stringify(params)
        });
    },

    searchAirports: async (q: string, onlyAirports: boolean = false) => {
        const res = await apiClient(`/search/airports?q=${encodeURIComponent(q)}${onlyAirports ? '&onlyAirports=true' : ''}`);
        return res || [];
    },

    searchHotels: async (params: HotelSearchParams) => {
        return await apiClient('/search/hotels', {
            method: 'POST',
            body: JSON.stringify(params)
        });
    },

    searchPlaces: async (params: PlaceSearchParams) => {
        return await apiClient('/search/activities', {
            method: 'POST',
            body: JSON.stringify(params)
        });
    },

    searchEverything: async (params: { city?: string; lat?: number; lon?: number }) => {
        return await apiClient('/search/everything', {
            method: 'POST',
            body: JSON.stringify(params)
        });
    },

    getDiscoverData: async (params: { city: string; country?: string; startDate?: string; endDate?: string; lat?: number; lon?: number }) => {
        return await apiClient('/search/discover', {
            method: 'POST',
            body: JSON.stringify(params)
        });
    },
};