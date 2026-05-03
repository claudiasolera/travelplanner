import { useEffect, useState } from 'react';
import { tripService } from '../../services/tripService';
import { itineraryService } from '../../services/itineraryService';

interface Props {
    type: 'flight' | 'hotel';
    data: any;
    flightInputs?: any;
    hotelInputs?: any;
    onClose: () => void;
}

export const AddToTripModal = ({ type, data, flightInputs, hotelInputs, onClose }: Props) => {
    const [trips, setTrips] = useState<any[]>([]);
    const [selectedTrip, setSelectedTrip] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        tripService.getUserTrips().then((res: any) => setTrips(res.trips || res || []));
    }, []);

    const handleAdd = async () => {
        if (!selectedTrip) return;
        setLoading(true);
        try {
            if (type === 'flight') {
                await itineraryService.addFlight(selectedTrip, {
                    airline: data.airline,
                    origin: data.departure.airport,
                    destination: data.arrival.airport,
                    originCity: data.departure.cityName,
                    destCity: data.arrival.cityName,
                    departure: data.departure.time,
                    arrival: data.arrival.time,
                    duration: data.duration,
                    stops: data.stops,
                    price: data.price?.amount || 0,
                    currency: data.price?.currency || 'EUR',
                    bookingLink: data.bookingLink
                });
            } else {
                await itineraryService.addHotel(selectedTrip, {
                    hotelId: data.hotelId,
                    name: data.name,
                    address: data.address?.fullAddress || '',
                    checkIn: hotelInputs.checkIn,
                    checkOut: hotelInputs.checkOut,
                    price: data.price?.amount || null,
                    currency: data.price?.currency || 'EUR',
                    bookingLink: data.bookingLink,
                    photo: data.photos?.[0] || null,
                    rating: data.rating || null,
                    reviewScore: data.reviewScore || null
                });
            }
            setSuccess(true);
            setTimeout(onClose, 1500);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-backdrop z-50" onClick={onClose}>
            <div className="modal rounded-3xl p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
                {success ? (
                    <div className="text-center py-6">
                        <div className="w-14 h-14 rounded-full bg-primary-light flex items-center justify-center mx-auto mb-3">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"/>
                            </svg>
                        </div>
                        <p className="font-bold text-text text-lg">¡Añadido a tu viaje!</p>
                        <p className="text-text-secondary text-sm mt-1">
                            {type === 'flight'
                                ? `${data.departure.cityName} → ${data.arrival.cityName}`
                                : data.name}
                        </p>
                    </div>
                ) : (
                    <>
                        <h2 className="font-bold text-text text-lg mb-1">Añadir a un viaje</h2>
                        <p className="text-text-secondary text-sm mb-4">
                            {type === 'flight'
                                ? `${data.departure.cityName} → ${data.arrival.cityName}`
                                : data.name}
                        </p>

                        {trips.length === 0 ? (
                            <div className="empty-state rounded-2xl">
                                <p className="text-text-soft text-sm">No tienes viajes creados</p>
                            </div>
                        ) : (
                            <div className="space-y-2 max-h-60 overflow-y-auto mb-4">
                                {trips.map((trip: any) => (
                                    <button
                                        aria-label={`Seleccionar viaje a ${trip.destination}`}
                                        key={trip.id} 
                                        onClick={() => setSelectedTrip(trip.id)}
                                        className={`w-full text-left px-4 py-3 rounded-2xl border transition text-sm font-medium ${
                                            selectedTrip === trip.id
                                                ? 'border-primary bg-primary-light text-primary'
                                                : 'border-border text-text hover:border-primary'
                                        }`}
                                    >
                                        {trip.destination}
                                        <span className="text-text-soft font-normal ml-2 text-xs">
                                            {new Date(trip.startDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        )}

                        <div className="flex gap-2">
                            <button 
                                aria-label='Cancelar'
                                onClick={onClose}
                                className="flex-1 py-2.5 rounded-2xl border border-border text-sm text-text-secondary hover:bg-bg transition"
                            >
                                Cancelar
                            </button>
                            <button 
                                aria-label='Añadir a viaje'
                                onClick={handleAdd} 
                                disabled={!selectedTrip || loading}
                                className="flex-1 btn py-2.5 rounded-2xl disabled:opacity-50"
                            >
                                {loading ? 'Añadiendo...' : 'Añadir'}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};