export interface IComment {
    idComment: number;
    idUser: number;
    idTrip: number;
    commentText: string;
    createdAt: string;
    username?: string;
}

export interface ITripItem {
    idItem: number;
    idTrip: number;
    type: 'FLIGHT' | 'HOTEL' | 'ACTIVITY' | 'RESTAURANT';
    name: string;
    description?: string;
    price: number;
    dateTime: string;
    location?: string;
    externalId?: string;
}

export interface IItinerary {
    id: string;
    tripId: string;
    day: number;
    date: string;
    activities: any[];
    notes?: string;
    title?: string;
}

export interface ITripFlight {
    id: string;
    tripId: string;
    airline: string;
    origin: string;
    destination: string;
    originCity: string;
    destCity: string;
    departure: string;
    arrival: string;
    duration: string;
    stops: number;
    price: number;
    currency: string;
    bookingLink?: string;
}

export interface ITripHotel {
    id: string;
    tripId: string;
    hotelId: string;
    name: string;
    address?: string;
    checkIn: string;
    checkOut: string;
    price?: number;
    currency: string;
    bookingLink?: string;
    photo?: string;
    rating?: number;
    reviewScore?: number;
}

export interface ITrip {
    id?: string;
    idTrip?: number;
    idUser?: number;
    userId?: string;
    origin?: string;
    destination: string;
    startDate: string;
    endDate: string;
    country?: string;
    totalPrice?: number;
    budget?: number;
    travelersCount?: number;
    travelStyle?: string;
    isPublic?: boolean;
    coverImage?: string | null;
    createdAt?: string;
    isCollaborator?: boolean;
    itineraries?: IItinerary[];
    items?: ITripItem[];
    hotels?: ITripHotel[];
    flights?: ITripFlight[];
    comments?: IComment[];
    user?: {
        id?: string;
        name?: string;
        avatar?: string;
        username?: string;
    };
}