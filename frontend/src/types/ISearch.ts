export interface IFlight {
    id: string;
    airline: string;
    origin: string;
    destination: string;
    price: number;
    departureDate: string;
}

export interface IHotel {
    id: string;
    name: string;
    rating: string;
    price: number;
    address?: string;
}