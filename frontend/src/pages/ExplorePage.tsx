import { useMemo, useState } from 'react';
import { FlightCard } from '../components/itinerary/FlightCard';
import { HotelCard } from '../components/itinerary/HotelCard';
import { HotelSearchBar } from '../components/explore/HotelSearchBar';
import { FlightSearchBar } from '../components/explore/FlightSearchBar';
import { AddToTripModal } from '../components/explore/AddToTripModal';
import { searchService } from '../services/searchService';
import { homepage } from '../lib/cloudinary';
import { StarIcon } from '../components/itinerary/icons';
import { useToast } from '../hooks/useToast';
import { ToastContainer } from '../components/ui/ToastContainer';

type Tab = 'flights' | 'hotels';

export const ExplorePage = () => {
    const today = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .split('T')[0];
    const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const { toasts, showToast, removeToast } = useToast();
    const [activeTab, setActiveTab] = useState<Tab>('flights');
    const [addToTrip, setAddToTrip] = useState<{ type: 'flight' | 'hotel'; data: any } | null>(null);

    // Vuelos
    const [flightInputs, setFlightInputs] = useState({
        origin: 'Madrid', destination: '',
        departureDate: today, returnDate: nextWeek,
        tripType: 'oneway' as 'oneway' | 'roundtrip',
        adults: 1,
        travelClass: 'ECONOMY' as 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST'
    });
    const [flights, setFlights] = useState<any[]>([]);
    const [flightsLoading, setFlightsLoading] = useState(false);
    const [flightSort, setFlightSort] = useState<'price' | 'duration'>('price');
    const [filterAirline, setFilterAirline] = useState('');
    const [filterStops, setFilterStops] = useState<'all' | '0' | '1' | '2+'>('all');
    const [filterTime, setFilterTime] = useState<string[]>([]);
    const [filterDuration, setFilterDuration] = useState<string[]>([]);
    const [originIata, setOriginIata] = useState('MAD');
    const [destIata, setDestIata] = useState('');

    // Hoteles
    const [hotelInputs, setHotelInputs] = useState({ city: '', checkIn: today, checkOut: nextWeek, adults: 1, rooms: 1 });
    const [hotels, setHotels] = useState<any[]>([]);
    const [hotelsLoading, setHotelsLoading] = useState(false);
    const [hotelSort, setHotelSort] = useState<'price_asc' | 'price_desc' | 'rating'>('price_asc');
    const [filterHotelName, setFilterHotelName] = useState('');
    const [filterHotelPrice, setFilterHotelPrice] = useState<string>('');
    const [filterHotelPriceMin, setFilterHotelPriceMin] = useState<string>('');
    const [filterHotelPriceMax, setFilterHotelPriceMax] = useState<string>('');
    const [filterHotelStars, setFilterHotelStars] = useState<number | null>(null);

    const deduplicatedFlights = useMemo(() => {
    const seen = new Set<string>();
    return [...flights].filter(f => {
        const key = `${f.airline}-${f.departure?.time}-${f.arrival?.time}`;
        if (seen.has(key)) return false;
        seen.add(key); return true;
    });
    }, [flights]);

    const airlines = useMemo(() => {
        return [...new Set(deduplicatedFlights.map(f => ({
            code: f.airline,
            name: f.airlineName || f.airline
        })).map(a => JSON.stringify(a)))].map(a => JSON.parse(a));
    }, [deduplicatedFlights]);

    const filteredFlights = useMemo(() => {
        return [...deduplicatedFlights]
            .filter(f => filterAirline ? f.airline === filterAirline : true)
            .filter(f => {
                const stops = parseInt(String(f.stops ?? 0));
                if (filterStops === 'all') return true;
                if (filterStops === '0') return stops === 0;
                if (filterStops === '1') return stops === 1;
                if (filterStops === '2+') return stops >= 2;
                return true;
            })
            .filter(f => {
                if (filterTime.length === 0) return true;
                const hour = new Date(f.departure?.time).getHours();
                return filterTime.some(t => {
                    if (t === 'morning') return hour >= 6 && hour < 12;
                    if (t === 'afternoon') return hour >= 12 && hour < 18;
                    if (t === 'evening') return hour >= 18 && hour < 24;
                    if (t === 'night') return hour >= 0 && hour < 6;
                    return true;
                });
            })
            .filter(f => {
                if (filterDuration.length === 0) return true;
                const toMin = (d: string) => {
                    const h = parseInt(d?.match(/(\d+)H/)?.[1] || '0');
                    const m = parseInt(d?.match(/(\d+)M/)?.[1] || '0');
                    return h * 60 + m;
                };
                const min = toMin(f.duration);
                return filterDuration.some(d => {
                    if (d === 'short') return min < 180;
                    if (d === 'medium') return min >= 180 && min <= 420;
                    if (d === 'long') return min > 420;
                    return true;
                });
            })
            .sort((a, b) => {
                if (flightSort === 'price') return (a.price?.amount ?? 0) - (b.price?.amount ?? 0);
                if (flightSort === 'duration') {
                    const toMin = (d: string) => {
                        const h = parseInt(d?.match(/(\d+)H/)?.[1] || '0');
                        const m = parseInt(d?.match(/(\d+)M/)?.[1] || '0');
                        return h * 60 + m;
                    };
                    return toMin(a.duration) - toMin(b.duration);
                }
                return 0;
            });
    }, [deduplicatedFlights, filterAirline, filterStops, filterTime, filterDuration, flightSort]);
        
    const filteredHotels = useMemo(() => {
        return [...hotels]
            .filter(h => filterHotelName ? h.name.toLowerCase().includes(filterHotelName.toLowerCase()) : true)
            .filter(h => {
                const price = h.price?.amount;
                if (!price) return true;
                if (filterHotelPrice === '0-100') return price <= 100;
                if (filterHotelPrice === '100-200') return price > 100 && price <= 200;
                if (filterHotelPrice === '200-300') return price > 200 && price <= 300;
                if (filterHotelPrice === '300+') return price > 300;
                if (filterHotelPriceMin || filterHotelPriceMax) {
                    const min = parseFloat(filterHotelPriceMin) || 0;
                    const max = parseFloat(filterHotelPriceMax) || 999999;
                    return price >= min && price <= max;
                }
                return true;
            })
            .filter(h => filterHotelStars ? h.rating === filterHotelStars : true)
            .sort((a, b) => {
                if (hotelSort === 'price_asc') {
                    if (a.price?.amount && !b.price?.amount) return -1;
                    if (!a.price?.amount && b.price?.amount) return 1;
                    return (a.price?.amount ?? 9999999) - (b.price?.amount ?? 9999999);
                }
                if (hotelSort === 'price_desc') return (b.price?.amount ?? 0) - (a.price?.amount ?? 0);
                if (hotelSort === 'rating') return (b.reviewScore ?? 0) - (a.reviewScore ?? 0);
                return 0;
            });
    }, [hotels, filterHotelName, filterHotelPrice, filterHotelPriceMin, filterHotelPriceMax, filterHotelStars, hotelSort]);

    const searchFlights = async () => {
        if (!flightInputs.origin || !flightInputs.destination) {
            showToast('Introduce origen y destino', 'error');
            return;
        }
        if (!flightInputs.departureDate) {
            showToast('Introduce una fecha de salida', 'error');
            return;
        }
        setFlightsLoading(true);
        setFlights([]);
        setFilterAirline('');
        setFilterStops('all');
        setFilterTime([]);
        setFilterDuration([]);
        try {
            const response = await searchService.searchFlights({
                origin: flightInputs.origin, destination: flightInputs.destination,
                departureDate: flightInputs.departureDate,
                returnDate: flightInputs.tripType === 'roundtrip' ? flightInputs.returnDate : undefined,
                adults: flightInputs.adults, travelClass: flightInputs.travelClass,
            });
            const flights = response.flights || [];
            if (flights.length === 0) showToast('No se encontraron vuelos para esa ruta', 'info');
            setFlights(flights);
        } catch {
            showToast('Error al buscar vuelos. Comprueba los aeropuertos introducidos', 'error');
            setFlights([]);
        } finally { setFlightsLoading(false); }
    };

    const searchHotels = async () => {
        if (!hotelInputs.city) {
            showToast('Introduce una ciudad de destino', 'error');
            return;
        }
        setHotelsLoading(true);
        try {
            const response = await searchService.searchHotels({
                city: hotelInputs.city, checkInDate: hotelInputs.checkIn,
                checkOutDate: hotelInputs.checkOut, adults: hotelInputs.adults
            });
            const hotels = response.hotels || [];
            if (hotels.length === 0) showToast('No se encontraron hoteles para esa ciudad', 'info');
            setHotels(hotels);
        } catch {
            showToast('Error al buscar hoteles', 'error');
            setHotels([]);
        } finally { setHotelsLoading(false); }
    };

    const getFlightBookingLink = (flight: any) => {
        const from = flight.departure.airport;
        const to = flight.arrival.airport;
        const dep = flight.departure.time.split('T')[0].replace(/-/g, '');
        const ret = flightInputs.returnDate?.replace(/-/g, '');
        const adults = flightInputs.adults || 1;
        const classMap: Record<string, string> = { 'ECONOMY': 'economy', 'PREMIUM_ECONOMY': 'premiumeconomy', 'BUSINESS': 'business', 'FIRST': 'first' };
        const cabin = classMap[flightInputs.travelClass] || 'economy';
        if (flightInputs.tripType === 'roundtrip' && ret)
            return `https://www.skyscanner.es/transporte/vuelos/${from}/${to}/${dep}/${ret}/?adults=${adults}&cabinclass=${cabin}`;
        return `https://www.skyscanner.es/transporte/vuelos/${from}/${to}/${dep}/?adultsv2=${adults}&cabinclass=${cabin}`;
    };

    return (
        <div className="min-h-screen bg-primary-light">

            <div className="w-full px-4 md:px-6 relative pb-8 md:pb-10">
                <div className="absolute inset-0 z-0 overflow-hidden">
                    <img
                        src={activeTab === 'flights' ? homepage.heroBanners.vuelos.src : homepage.heroBanners.hoteles.src}
                        alt={activeTab === 'flights' ? homepage.heroBanners.vuelos.alt : homepage.heroBanners.hoteles.alt}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/45" />
                </div>

                <div className="max-w-4xl mx-auto text-center pt-10 md:pt-20 mb-6 md:mb-8 relative z-10">
                    <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">
                        Explora el mundo <span className="text-primary-light">a tu manera</span>
                    </h1>
                    <p className="text-white/80 text-sm">
                        Busca vuelos y hoteles para tu próxima aventura.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto relative z-10">
                    <div className="flex gap-2 mb-3">
                        {[
                            { key: 'flights', label: 'Vuelos' },
                            { key: 'hotels', label: 'Hoteles' }
                        ].map(tab => (
                            <button
                                aria-label={tab.label}
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key as any)}
                                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition ${
                                    activeTab === tab.key
                                        ? 'bg-white text-text shadow-sm'
                                        : 'bg-white/30 text-white hover:bg-white/50'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {activeTab === 'flights' && (
                        <FlightSearchBar
                            inputs={flightInputs}
                            onInputsChange={setFlightInputs}
                            onOriginIata={setOriginIata}
                            onDestIata={setDestIata}
                            onSearch={searchFlights}
                        />
                    )}
                    {activeTab === 'hotels' && (
                        <HotelSearchBar
                            inputs={hotelInputs}
                            onInputsChange={setHotelInputs}
                            onSearch={searchHotels}
                        />
                    )}
                </div>
            </div>

                {activeTab === 'flights' && flights.length > 0 && (
                    <div className="flex gap-6 px-10 py-10">

                        <aside className="w-72 shrink-0 space-y-4 bg-primary-light rounded-3xl p-4">

                            <div className="pb-4 border-b border-primary/20">
                                <h3 className="text-lg font-bold text-text mb-3">Ordenar por</h3>
                                <div className="space-y-2">
                                    {[
                                        { key: 'price', label: 'Más barato' },
                                        { key: 'duration', label: 'Más rápido' },
                                    ].map(opt => (
                                        <button 
                                            aria-label={opt.label}
                                            key={opt.key} 
                                            onClick={() => setFlightSort(opt.key as any)}
                                            className={`w-full text-left px-3 py-2 rounded-xl text-sm transition flex items-center gap-2 ${
                                                flightSort === opt.key ? 'bg-primary text-white font-medium' : 'hover:bg-primary/10 text-text-secondary'
                                            }`}
                                        >
                                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${flightSort === opt.key ? 'border-white' : 'border-border'}`}>
                                                {flightSort === opt.key && <div className="w-2 h-2 rounded-full bg-white"/>}
                                            </div>
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="pb-4 border-b border-primary/20">
                                <h3 className="text-lg font-bold text-text mb-3">Escalas</h3>
                                <div className="space-y-2">
                                    {[
                                        { key: 'all', label: 'Todas' },
                                        { key: '0', label: 'Directo' },
                                        { key: '1', label: '1 escala' },
                                        { key: '2+', label: '+2 escalas' },
                                    ].map(opt => (
                                        <label key={opt.key} className="flex items-center gap-3 cursor-pointer group">
                                            <input 
                                                aria-label={opt.label}
                                                type="checkbox" 
                                                name="stops" 
                                                checked={filterStops === opt.key}
                                                onChange={() => setFilterStops(opt.key as any)}
                                                className="accent-primary w-4 h-4" 
                                            />
                                            <span className="text-sm text-text-secondary group-hover:text-text transition">{opt.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="pb-4 border-b border-primary/20">
                                <h3 className="text-lg font-bold text-text mb-3">Hora de salida</h3>
                                <div className="space-y-2">
                                    {[
                                        { key: 'morning', label: 'Mañana', sub: '06:00 - 12:00' },
                                        { key: 'afternoon', label: 'Tarde', sub: '12:00 - 18:00' },
                                        { key: 'evening', label: 'Noche', sub: '18:00 - 00:00' },
                                        { key: 'night', label: 'Madrugada', sub: '00:00 - 06:00' },
                                    ].map(opt => (
                                        <label key={opt.key} className="flex items-center gap-3 cursor-pointer group">
                                            <input 
                                                aria-label={opt.label}
                                                type="checkbox" 
                                                className="accent-primary w-4 h-4"
                                                checked={filterTime.includes(opt.key)}
                                                onChange={e => setFilterTime(prev => e.target.checked ? [...prev, opt.key] : prev.filter(k => k !== opt.key))} 
                                            />
                                            <div>
                                                <p className="text-sm text-text-secondary group-hover:text-text transition">{opt.label}</p>
                                                <p className="text-xs text-text-soft">{opt.sub}</p>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="pb-4 border-b border-primary/20">
                                <h3 className="text-lg font-bold text-text mb-3">Duración del vuelo</h3>
                                <div className="space-y-2">
                                    {[
                                        { key: 'short', label: 'Menos de 3h' },
                                        { key: 'medium', label: '3h - 7h' },
                                        { key: 'long', label: 'Más de 7h' },
                                    ].map(opt => (
                                        <label key={opt.key} className="flex items-center gap-3 cursor-pointer group">
                                            <input 
                                                aria-label={opt.label}
                                                type="checkbox" 
                                                className="accent-primary w-4 h-4"
                                                checked={filterDuration.includes(opt.key)}
                                                onChange={e => setFilterDuration(prev => e.target.checked ? [...prev, opt.key] : prev.filter(k => k !== opt.key))} 
                                            />
                                            <span className="text-sm text-text-secondary group-hover:text-text transition">{opt.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-text mb-3">Aerolíneas</h3>
                                <div className="space-y-2 max-h-48 overflow-y-auto">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <input 
                                            aria-label="Todas las aerolíneas"
                                            type="checkbox" 
                                            name="airline" 
                                            checked={filterAirline === ''}
                                            onChange={() => setFilterAirline('')}
                                            className="accent-primary w-4 h-4" 
                                        />
                                        <span className="text-sm text-text-secondary group-hover:text-text transition">Todas</span>
                                    </label>
                                    {airlines.map(a => (
                                        <label key={a.code} className="flex items-center gap-3 cursor-pointer group">
                                            <input 
                                                aria-label={a.name}
                                                type="checkbox" 
                                                name="airline" 
                                                checked={filterAirline === a.code}
                                                onChange={() => setFilterAirline(a.code)}
                                                className="accent-primary w-4 h-4" 
                                            />
                                            <img 
                                                src={`https://www.gstatic.com/flights/airline_logos/70px/${a.code}.png`}
                                                alt={a.code} 
                                                className="w-6 h-6 object-contain"
                                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} 
                                            />
                                            <span className="text-sm text-text-secondary group-hover:text-text transition truncate">{a.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </aside>

                        <div className="flex-1 space-y-3">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm text-text-secondary">{filteredFlights.length} vuelos encontrados</p>
                            </div>
                            {flightsLoading ? (
                                <div className="flex flex-col items-center justify-center py-20 gap-4">
                                    <div className="spinner-lg mx-auto"/>
                                    <p className="text-text text-sm font-semibold">Buscando los mejores vuelos...</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {filteredFlights.map((flight, index) => (
                                        <FlightCard
                                            key={`${flight.airline}-${flight.departure?.time}-${index}`}
                                            flight={flight}
                                            mode="explore"
                                            onDelete={() => {}}
                                            onUpdate={() => {}}
                                            onAddToTrip={() => setAddToTrip({ type: 'flight', data: flight })}
                                            bookingLink={getFlightBookingLink(flight)}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'flights' && flights.length === 0 && (
                    <div className="max-w-4xl mx-auto px-6 py-10">
                        {flightsLoading ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-4">
                                <div className="spinner-lg mx-auto"/>
                                <p className="text-text text-sm font-semibold">Buscando los mejores vuelos...</p>
                            </div>
                        ) : (
                            <div className="empty-state py-20 bg-primary-light rounded-3xl">
                                <p className="text-xl font-semibold text-text mb-2">¿A dónde quieres volar?</p>
                                <p className="text-text-secondary text-sm">Introduce un origen, destino y fecha...</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'hotels' && hotels.length === 0 && (
                    <div className="max-w-4xl mx-auto px-6 py-10">
                        {hotelsLoading ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-4">
                                <div className="spinner-lg mx-auto"/>
                                <p className="text-text text-sm font-semibold">Buscando los mejores hoteles...</p>
                            </div>
                        ) : (
                            <div className="empty-state py-20 bg-primary-light rounded-3xl">
                                <p className="text-xl font-semibold text-text mb-2">¿Dónde te alojas?</p>
                                <p className="text-text-secondary text-sm">Introduce un destino y fechas para encontrar los mejores hoteles.</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'hotels' && hotels.length > 0 && (
                    <div className="flex gap-6 px-10 py-10">

                        <aside className="w-72 shrink-0 space-y-4 bg-primary-light rounded-3xl p-4">

                            <div className="pb-4 border-b border-primary/20">
                                <h3 className="text-lg font-bold text-text mb-3">Ordenar por</h3>
                                <div className="space-y-2">
                                    {[
                                        { key: 'price_asc', label: 'Más barato' },
                                        { key: 'price_desc', label: 'Más caro' },
                                        { key: 'rating', label: 'Mejor valorado' },
                                    ].map(opt => (
                                        <button 
                                            aria-label={opt.label}
                                            key={opt.key} 
                                            onClick={() => setHotelSort(opt.key as any)}
                                            className={`w-full text-left px-3 py-2 rounded-xl text-sm transition flex items-center gap-2 ${
                                                hotelSort === opt.key ? 'bg-primary text-white font-medium' : 'hover:bg-primary/10 text-text-secondary'
                                            }`}
                                        >
                                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${hotelSort === opt.key ? 'border-white' : 'border-border'}`}>
                                                {hotelSort === opt.key && <div className="w-2 h-2 rounded-full bg-white"/>}
                                            </div>
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="pb-4 border-b border-primary/20">
                                <h3 className="text-lg font-bold text-text mb-3">Precio por noche</h3>
                                <div className="space-y-2 mb-3">
                                    {[
                                        { key: '0-100', label: 'Hasta 100€' },
                                        { key: '100-200', label: '100€ - 200€' },
                                        { key: '200-300', label: '200€ - 300€' },
                                        { key: '300+', label: 'Más de 300€' },
                                    ].map(opt => (
                                        <label key={opt.key} className="flex items-center gap-3 cursor-pointer group">
                                            <input 
                                                aria-label={opt.label}
                                                type="checkbox" 
                                                name="hotelPrice" 
                                                checked={filterHotelPrice === opt.key}
                                                onChange={() => { setFilterHotelPrice(opt.key); setFilterHotelPriceMin(''); setFilterHotelPriceMax(''); }}
                                                className="accent-primary w-4 h-4" 
                                            />
                                            <span className="text-sm text-text-secondary group-hover:text-text transition">{opt.label}</span>
                                        </label>
                                    ))}
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <input 
                                            aria-label="Cualquier precio de hotel"
                                            type="checkbox" 
                                            name="hotelPrice" 
                                            checked={filterHotelPrice === ''}
                                            onChange={() => setFilterHotelPrice('')}
                                            className="accent-primary w-4 h-4" 
                                        />
                                        <span className="text-sm text-text-secondary group-hover:text-text transition">Cualquier precio</span>
                                    </label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input 
                                        aria-label="Precio mínimo de hotel"
                                        type="number" 
                                        className="input px-2 py-1.5 w-full text-xs" 
                                        placeholder="Min €"
                                        value={filterHotelPriceMin}
                                        onChange={e => { setFilterHotelPriceMin(e.target.value); setFilterHotelPrice(''); }} 
                                    />
                                    <span className="text-text-soft text-xs shrink-0">—</span>
                                    <input 
                                        aria-label="Precio máximo de hotel"
                                        type="number" 
                                        className="input px-2 py-1.5 w-full text-xs" 
                                        placeholder="Max €"
                                        value={filterHotelPriceMax}
                                        onChange={e => { setFilterHotelPriceMax(e.target.value); setFilterHotelPrice(''); }} 
                                    />
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-text mb-3">Categoría</h3>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <input 
                                            aria-label="Todas las categorías"
                                            type="checkbox" 
                                            name="stars" 
                                            checked={filterHotelStars === null}
                                            onChange={() => setFilterHotelStars(null)}
                                            className="accent-primary w-4 h-4" 
                                        />
                                        <span className="text-sm text-text-secondary group-hover:text-text transition">Todas</span>
                                    </label>
                                    {[5, 4, 3, 2, 1].map(stars => (
                                        <label key={stars} className="flex items-center gap-3 cursor-pointer group">
                                            <input 
                                                aria-label={`Hotel ${stars} estrellas`}
                                                type="checkbox" 
                                                name="stars" 
                                                checked={filterHotelStars === stars}
                                                onChange={() => setFilterHotelStars(stars)}
                                                className="accent-primary w-4 h-4" 
                                            />
                                            <div className="flex items-center gap-1">
                                                {Array.from({ length: stars }).map((_, i) => (
                                                    <StarIcon key={i} size={12} color="#f59e0b" />
                                                ))}
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </aside>

                        <div className="flex-1">
                            <div className="mb-4 space-y-2">
                                <p className="text-sm text-text-secondary">{filteredHotels.length} hoteles encontrados</p>
                                <div className="flex items-center gap-2 bg-white border border-border rounded-xl px-4 py-2.5 w-72">
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9A9A9A" strokeWidth="2">
                                        <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                                    </svg>
                                    <input 
                                        aria-label="Buscar hotel por nombre"
                                        className="outline-none text-sm text-text placeholder:text-text-soft bg-transparent w-full"
                                        placeholder="Buscar hotel..." 
                                        value={filterHotelName}
                                        onChange={e => setFilterHotelName(e.target.value)} 
                                    />
                                    {filterHotelName && (
                                        <button 
                                            aria-label="Limpiar búsqueda"
                                            onClick={() => setFilterHotelName('')} 
                                            className="text-text-soft hover:text-text text-xs"
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                            </div>
                            {hotelsLoading ? (
                                <div className="flex flex-col items-center justify-center py-20 gap-4">
                                    <div className="spinner-lg mx-auto"/>
                                    <p className="text-text text-sm font-semibold">Buscando los mejores hoteles...</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                    {filteredHotels.map(hotel => (
                                        <HotelCard
                                            key={hotel.hotelId}
                                            hotel={hotel}
                                            mode="explore"
                                            onDelete={() => {}}
                                            onUpdate={() => {}}
                                            onAddToTrip={() => setAddToTrip({ type: 'hotel', data: hotel })}
                                            checkIn={hotelInputs.checkIn}
                                            checkOut={hotelInputs.checkOut}
                                            adults={hotelInputs.adults}
                                            rooms={hotelInputs.rooms}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

            {addToTrip && (
                <AddToTripModal
                    type={addToTrip.type}
                    data={addToTrip.data}
                    hotelInputs={hotelInputs}
                    flightInputs={flightInputs}
                    onClose={() => {
                        setAddToTrip(null);
                    }}
                />
            )}

            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </div>
    );
};