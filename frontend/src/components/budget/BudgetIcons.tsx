import { JSX } from 'react';
import { FlightIcon, HotelIcon, ForkKnifeIcon, ClockIcon, CarIcon, ShoppingBagIcon, WalletIcon } from '../itinerary/icons';

export const categoryConfig: Record<string, { color: string; icon: JSX.Element }> = {
    'Vuelos':      { color: '#3b82f6', icon: <FlightIcon size={16} /> },
    'Hoteles':     { color: '#8b5cf6', icon: <HotelIcon size={16} /> },
    'Comida':      { color: '#f59e0b', icon: <ForkKnifeIcon size={16} /> },
    'Actividades': { color: '#10b981', icon: <ClockIcon size={16} /> },
    'Transporte':  { color: '#6366f1', icon: <CarIcon size={16} /> },
    'Compras':     { color: '#ec4899', icon: <ShoppingBagIcon size={16} /> },
    'Otros':       { color: '#94a3b8', icon: <WalletIcon size={16} /> },
};