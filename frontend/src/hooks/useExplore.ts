import { useMemo, useState } from 'react';
import { searchService } from '../services/searchService';
import { useToast } from './useToast';

export const useExplore = () => {
    const today = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString().split('T')[0];
    const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString().split('T')[0];

    const { toasts, showToast, removeToast } = useToast();
    const [activeTab, setActiveTab] = useState<'flights' | 'hotels'>('flights');
    const [addToTrip, setAddToTrip] = useState<{ type: 'flight' | 'hotel'; data: any } | null>(null);

    const [flightInputs, setFlightInputs] = useState({
        origin: 'Madrid',
        destination: '',
        departureDate: today,
        returnDate: nextWeek,
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

    const [hotelInputs, setHotelInputs] = useState({
        city: '', checkIn: today, checkOut: nextWeek, adults: 1, rooms: 1
    });
    const [hotels, setHotels] = useState<any[]>([]);
    const [hotelsLoading, setHotelsLoading] = useState(false);
    const [hotelSort, setHotelSort] = useState<'price_asc' | 'price_desc' | 'rating'>('price_asc');
    const [filterHotelName, setFilterHotelName] = useState('');
    const [filterHotelPrice, setFilterHotelPrice] = useState('');
    const [filterHotelPriceMin, setFilterHotelPriceMin] = useState('');
    const [filterHotelPriceMax, setFilterHotelPriceMax] = useState('');
    const [filterHotelStars, setFilterHotelStars] = useState<number | null>(null);

    const toMin = (d: string) => {
        const h = parseInt(d?.match(/(\d+)H/)?.[1] || '0');
        const m = parseInt(d?.match(/(\d+)M/)?.[1] || '0');
        return h * 60 + m;
    };

    const deduplicatedFlights = useMemo(() => {
        const seen = new Set<string>();
        return flights.filter(f => {
            const key = `${f.airline}-${f.departure?.time}-${f.arrival?.time}`;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
    }, [flights]);

    const airlines = useMemo(() => {
        return [...new Set(deduplicatedFlights.map(f =>
            JSON.stringify({ code: f.airline, name: f.airlineName || f.airline })
        ))].map(a => JSON.parse(a));
    }, [deduplicatedFlights]);

    const filteredFlights = useMemo(() => {
        return [...deduplicatedFlights]
            .filter(f => !filterAirline || f.airline === filterAirline)
            .filter(f => {
                const stops = parseInt(String(f.stops ?? 0));
                if (filterStops === 'all') return true;
                if (filterStops === '0') return stops === 0;
                if (filterStops === '1') return stops === 1;
                return stops >= 2;
            })
            .filter(f => {
                if (!filterTime.length) return true;
                const hour = new Date(f.departure?.time).getHours();
                return filterTime.some(t => {
                    if (t === 'morning') return hour >= 6 && hour < 12;
                    if (t === 'afternoon') return hour >= 12 && hour < 18;
                    if (t === 'evening') return hour >= 18;
                    return hour < 6;
                });
            })
            .filter(f => {
                if (!filterDuration.length) return true;
                const min = toMin(f.duration);
                return filterDuration.some(d => {
                    if (d === 'short') return min < 180;
                    if (d === 'medium') return min >= 180 && min <= 420;
                    return min > 420;
                });
            })
            .sort((a, b) => {
                if (flightSort === 'price') return (a.price?.amount ?? 0) - (b.price?.amount ?? 0);
                return toMin(a.duration) - toMin(b.duration);
            });
    }, [deduplicatedFlights, filterAirline, filterStops, filterTime, filterDuration, flightSort]);

    const filteredHotels = useMemo(() => {
        return [...hotels]
            .filter(h => !filterHotelName || h.name.toLowerCase().includes(filterHotelName.toLowerCase()))
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
            .filter(h => !filterHotelStars || h.rating === filterHotelStars)
            .sort((a, b) => {
                if (hotelSort === 'price_asc') return (a.price?.amount ?? 9999999) - (b.price?.amount ?? 9999999);
                if (hotelSort === 'price_desc') return (b.price?.amount ?? 0) - (a.price?.amount ?? 0);
                return (b.reviewScore ?? 0) - (a.reviewScore ?? 0);
            });
    }, [hotels, filterHotelName, filterHotelPrice, filterHotelPriceMin, filterHotelPriceMax, filterHotelStars, hotelSort]);

    const searchFlights = async () => {
        if (!flightInputs.origin || !flightInputs.destination) {
            showToast('Introduce origen y destino', 'error'); return;
        }
        if (!flightInputs.departureDate) {
            showToast('Introduce una fecha de salida', 'error'); return;
        }
        setFlightsLoading(true);
        setFlights([]);
        setFilterAirline(''); setFilterStops('all'); setFilterTime([]); setFilterDuration([]);
        try {
            const response = await searchService.searchFlights({
                origin: flightInputs.origin,
                destination: flightInputs.destination,
                departureDate: flightInputs.departureDate,
                returnDate: flightInputs.tripType === 'roundtrip' ? flightInputs.returnDate : undefined,
                adults: flightInputs.adults,
                travelClass: flightInputs.travelClass,
            });
            const results = response.flights || [];
            if (!results.length) showToast('No se encontraron vuelos para esa ruta', 'info');
            setFlights(results);
        } catch {
            showToast('Error al buscar vuelos', 'error');
            setFlights([]);
        } finally { setFlightsLoading(false); }
    };

    const searchHotels = async () => {
        if (!hotelInputs.city) {
            showToast('Introduce una ciudad de destino', 'error'); return;
        }
        setHotelsLoading(true);
        try {
            const response = await searchService.searchHotels({
                city: hotelInputs.city,
                checkInDate: hotelInputs.checkIn,
                checkOutDate: hotelInputs.checkOut,
                adults: hotelInputs.adults
            });
            const results = response.hotels || [];
            if (!results.length) showToast('No se encontraron hoteles', 'info');
            setHotels(results);
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
        const classMap: Record<string, string> = {
            ECONOMY: 'economy', PREMIUM_ECONOMY: 'premiumeconomy',
            BUSINESS: 'business', FIRST: 'first'
        };
        const cabin = classMap[flightInputs.travelClass] || 'economy';
        if (flightInputs.tripType === 'roundtrip' && ret)
            return `https://www.skyscanner.es/transporte/vuelos/${from}/${to}/${dep}/${ret}/?adults=${adults}&cabinclass=${cabin}`;
        return `https://www.skyscanner.es/transporte/vuelos/${from}/${to}/${dep}/?adultsv2=${adults}&cabinclass=${cabin}`;
    };

    return {
        activeTab, setActiveTab, addToTrip, setAddToTrip,
        flightInputs, setFlightInputs, flights, flightsLoading,
        flightSort, setFlightSort,
        filterAirline, setFilterAirline, filterStops, setFilterStops,
        filterTime, setFilterTime, filterDuration, setFilterDuration,
        originIata, setOriginIata, destIata, setDestIata,
        airlines, filteredFlights, searchFlights, getFlightBookingLink,
        hotelInputs, setHotelInputs, hotels, hotelsLoading,
        hotelSort, setHotelSort,
        filterHotelName, setFilterHotelName,
        filterHotelPrice, setFilterHotelPrice,
        filterHotelPriceMin, setFilterHotelPriceMin,
        filterHotelPriceMax, setFilterHotelPriceMax,
        filterHotelStars, setFilterHotelStars,
        filteredHotels, searchHotels,
        toasts, removeToast
    };
};