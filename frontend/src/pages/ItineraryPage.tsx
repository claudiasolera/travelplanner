import { useEffect, useState } from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
import { itineraryService } from '../services/itineraryService';
import { ITrip } from '../types/ITrip';
import { FlightCard } from '../components/itinerary/FlightCard';
import { HotelCard } from '../components/itinerary/HotelCard';
import { ManualFlightForm } from '../components/itinerary/ManualFlightForm';
import { ManualHotelForm } from '../components/itinerary/ManualHotelForm';
import { FlightSearchBar } from '../components/itinerary/FlightSearchBar';
import { HotelSearchBar } from '../components/itinerary/HotelSearchBar';
import { EmptyState } from '../components/itinerary/EmptyState';
import { AddButtons } from '../components/itinerary/AddButtons';
import { FlightIcon, HotelIcon } from '../components/itinerary/icons';
import { useToast } from '../hooks/useToast';
import { ToastContainer } from '../components/ui/ToastContainer';

type Section = 'flights' | 'hotels';

export const ItineraryPage = () => {
    const { id: tripId } = useParams<{ id: string }>();
    const { trip } = useOutletContext<{ trip: ITrip | null }>();
    const { toasts, showToast, removeToast } = useToast();

    const [section, setSection] = useState<Section>('flights');
    const [showSearch, setShowSearch] = useState(false);
    const [showManual, setShowManual] = useState(false);
    const [savedFlights, setSavedFlights] = useState<any[]>([]);
    const [savedHotels, setSavedHotels] = useState<any[]>([]);

    useEffect(() => {
        if (tripId) {
            itineraryService.getFlights(tripId).then(r => setSavedFlights(r.flights || []));
            itineraryService.getHotels(tripId).then(r => setSavedHotels(r.hotels || []));
        }
    }, [tripId]);

    const handleAddFlight = async (flight: any) => {
        if (!tripId) return;
        try{
            await itineraryService.addFlight(tripId, {
                airline: flight.airline,
                origin: flight.departure?.airport || flight.origin,
                destination: flight.arrival?.airport || flight.destination,
                originCity: flight.departure?.cityName || flight.originCity,
                destCity: flight.arrival?.cityName || flight.destCity,
                departure: flight.departure?.time || flight.departure,
                arrival: flight.arrival?.time || flight.arrival,
                duration: flight.duration || '',
                stops: flight.stops || 0,
                price: flight.price?.amount ?? flight.price ?? 0,
                currency: flight.price?.currency || flight.currency || 'EUR',
                bookingLink: flight.bookingLink || ''
            });
            const r = await itineraryService.getFlights(tripId);
            setSavedFlights(r.flights || []);
            setShowSearch(false);
            setShowManual(false);
            showToast('Vuelo añadido correctamente', 'success');
        } catch {
            showToast('Error al añadir el vuelo', 'error');
        }
    };

    const handleAddHotel = async (hotel: any) => {
        if (!tripId) return;
        try{
            await itineraryService.addHotel(tripId, {
                hotelId: hotel.hotelId || hotel.id,
                name: hotel.name,
                address: hotel.address?.fullAddress || hotel.address || '',
                checkIn: hotel.checkIn,
                checkOut: hotel.checkOut,
                price: hotel.price?.amount ?? hotel.price ?? null,
                currency: hotel.price?.currency || hotel.currency || 'EUR',
                bookingLink: hotel.bookingLink || '',
                photo: hotel.photos?.[0] || null,
                rating: hotel.rating || null,
                reviewScore: hotel.reviewScore || null
            });
            const r = await itineraryService.getHotels(tripId);
            setSavedHotels(r.hotels || []);
            setShowSearch(false);
            setShowManual(false);
            showToast('Hotel añadido correctamente', 'success');
        } catch {
            showToast('Error al añadir el hotel', 'error');
        }
    };

    const handleUpdateFlight = async (flightId: string, data: any) => {
        await itineraryService.updateFlight(flightId, data);
        const r = await itineraryService.getFlights(tripId!);
        setSavedFlights(r.flights || []);
    };

    const handleUpdateHotel = async (hotelId: string, data: any) => {
        await itineraryService.updateHotel(hotelId, data);
        const r = await itineraryService.getHotels(tripId!);
        setSavedHotels(r.hotels || []);
    };

    const handleDeleteFlight = async (flightId: string) => {
        try {
            await itineraryService.deleteFlight(flightId);
            setSavedFlights(prev => prev.filter(f => f.id !== flightId));
            showToast('Vuelo eliminado', 'success');
        } catch {
            showToast('Error al eliminar el vuelo', 'error');
        }
    };

    const handleDeleteHotel = async (hotelId: string) => {
        try {
            await itineraryService.deleteHotel(hotelId);
            setSavedHotels(prev => prev.filter(h => h.id !== hotelId));
            showToast('Hotel eliminado', 'success');
        } catch {
            showToast('Error al eliminar el hotel', 'error');
        }
    };

    const resetSearch = () => { setShowSearch(false); setShowManual(false); };

    return (
        <div className="space-y-6">

            {/* Tabs */}
            <div className="flex gap-2">
                {[
                    { key: 'flights', label: 'Vuelos', icon: <FlightIcon size={15} /> },
                    { key: 'hotels', label: 'Hoteles', icon: <HotelIcon size={15} /> },
                ].map(tab => (
                    <button 
                        aria-label={tab.label}
                        key={tab.key}
                        onClick={() => { setSection(tab.key as Section); resetSearch(); }}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition ${
                            section === tab.key ? 'bg-primary text-white' : 'bg-card text-text-secondary hover:text-text'
                        }`}
                        style={section !== tab.key ? { border: '2px solid white', boxShadow: '0px 2px 8px rgba(138,106,90,0.25)' } : {}}
                    >
                        {tab.icon}{tab.label}
                    </button>
                ))}
            </div>

            {/* ── VUELOS ── */}
            {section === 'flights' && (
                <div className="space-y-4">
                    {savedFlights.length === 0 && !showSearch && !showManual && (
                        <EmptyState icon={<FlightIcon size={26} />} text="No hay vuelos añadidos aún." />
                    )}

                    {savedFlights.map(flight => (
                        <FlightCard key={flight.id} flight={flight}
                            onDelete={handleDeleteFlight}
                            onUpdate={handleUpdateFlight}
                            mode="itinerary"
                        />
                    ))}

                    {showManual && (
                        <ManualFlightForm
                            onSave={handleAddFlight}
                            onClose={() => setShowManual(false)}
                        />
                    )}

                    {showSearch && (
                        <FlightSearchBar
                            onAdd={handleAddFlight}
                            onClose={() => setShowSearch(false)}
                            onError={(msg) => showToast(msg, 'error')}
                            defaultDepartureDate={trip?.startDate ? new Date(trip.startDate).toISOString().split('T')[0] : ''}
                            defaultReturnDate={trip?.endDate ? new Date(trip.endDate).toISOString().split('T')[0] : ''}
                        />
                    )}

                    {!showSearch && !showManual && (
                        <AddButtons
                            onSearch={() => setShowSearch(true)}
                            onManual={() => setShowManual(true)}
                            searchLabel="Buscar vuelo"
                            manualLabel="Añadir manualmente"
                        />
                    )}
                </div>
            )}

            {/* ── HOTELES ── */}
            {section === 'hotels' && (
                <div className="space-y-4">
                    {savedHotels.length === 0 && !showSearch && !showManual && (
                        <EmptyState icon={<HotelIcon size={26} />} text="No hay hoteles añadidos aún." />
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {savedHotels.map(hotel => (
                            <HotelCard key={hotel.id} hotel={hotel}
                                onDelete={handleDeleteHotel}
                                onUpdate={handleUpdateHotel}
                                mode="itinerary"
                            />
                        ))}
                    </div>

                    {showManual && (
                        <ManualHotelForm
                            onSave={handleAddHotel}
                            onClose={() => setShowManual(false)}
                            defaultCheckIn={trip?.startDate ? new Date(trip.startDate).toISOString().split('T')[0] : ''}
                            defaultCheckOut={trip?.endDate ? new Date(trip.endDate).toISOString().split('T')[0] : ''}
                        />
                    )}

                    {showSearch && (
                        <HotelSearchBar
                            onAdd={handleAddHotel}
                            onClose={() => setShowSearch(false)}
                            onError={(msg) => showToast(msg, 'error')}
                            defaultCity={trip?.destination || ''}
                            defaultCheckIn={trip?.startDate ? new Date(trip.startDate).toISOString().split('T')[0] : ''}
                            defaultCheckOut={trip?.endDate ? new Date(trip.endDate).toISOString().split('T')[0] : ''}
                        />
                    )}

                    {!showSearch && !showManual && (
                        <AddButtons
                            onSearch={() => setShowSearch(true)}
                            onManual={() => setShowManual(true)}
                            searchLabel="Buscar hotel"
                            manualLabel="Añadir manualmente"
                        />
                    )}
                </div>
            )}

            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </div>
    );
};