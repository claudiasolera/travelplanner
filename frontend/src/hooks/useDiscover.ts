import { useEffect, useState, useRef } from 'react';
import { searchService } from '../services/searchService';
import { tripService } from '../services/tripService';
import { itineraryService } from '../services/itineraryService';
import { ITrip } from '../types/ITrip';

export const useDiscover = (tripId: string | undefined, trip: ITrip | null) => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState<'all' | 'places' | 'restaurants'>('all');
    const [hotelCoords, setHotelCoords] = useState<any>(null);
    const [itineraries, setItineraries] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [selectedDay, setSelectedDay] = useState('');
    const [selectedTime, setSelectedTime] = useState('10:00');
    const fetchedRef = useRef(false);

    useEffect(() => {
        if (!tripId || !trip?.destination || fetchedRef.current) return;
        fetchedRef.current = true;

        const city = trip.destination.split(',')[0].trim();

        const loadData = async () => {
            setLoading(true);
            try {
                const result = await searchService.getDiscoverData({
                    city,
                    country: trip.country || '',
                    startDate: trip.startDate,
                    endDate: trip.endDate
                });
                setData(result);
            } catch {
                setData(null);
            } finally {
                setLoading(false);
            }
        };

        loadData();

        itineraryService.getHotels(tripId).then(async (res: any) => {
            const hotels = res.hotels || [];
            if (hotels.length === 0) return;
            const h = hotels[0];
            try {
                const r = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(`${h.name} ${city}`)}&format=json&limit=1`);
                const geo = await r.json();
                if (geo.length > 0) {
                    setHotelCoords({ lat: parseFloat(geo[0].lat), lon: parseFloat(geo[0].lon), name: h.name });
                }
            } catch {}
        });

        tripService.getTripById(tripId).then((d: any) => {
            const sorted = [...(d.itineraries || [])].sort((a: any, b: any) => a.day - b.day);
            setItineraries(sorted);
            if (sorted.length > 0) setSelectedDay(sorted[0].id);
        });
    }, [tripId, trip?.destination]);

    const handleAddToCalendar = (item: any, isRestaurant: boolean) => {
        setSelectedItem({ ...item, isRestaurant });
        setShowModal(true);
    };

    const handleConfirmAdd = async () => {
        if (!selectedDay || !selectedItem) return;
        try {
            await tripService.addActivity(selectedDay, {
                name: selectedItem.name,
                type: selectedItem.isRestaurant ? 'Restaurante' : 'Actividad',
                time: selectedTime,
                notes: selectedItem.isRestaurant
                    ? `Cocina: ${selectedItem.cuisine?.join(', ')} · ${selectedItem.address}`
                    : selectedItem.description || selectedItem.type || '',
                lat: selectedItem.location?.lat,
                lon: selectedItem.location?.lon
            });
            setShowModal(false);
            setSelectedItem(null);
        } catch {}
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedItem(null);
    };

    const places = data?.places || [];
    const restaurants = data?.restaurants || [];
    const eventos = data?.eventos || [];
    const tours = data?.tours || [];
    const faq = data?.faq || [];

    const visiblePlaces = filter === 'restaurants' ? [] : places.filter((p: any) => p.location?.lat);
    const visibleRestaurants = filter === 'places' ? [] : restaurants.filter((r: any) => r.location?.lat);

    return {
        data, loading, filter, setFilter,
        hotelCoords, itineraries,
        showModal, selectedItem, selectedDay, setSelectedDay,
        selectedTime, setSelectedTime,
        places, restaurants, eventos, tours, faq,
        visiblePlaces, visibleRestaurants,
        handleAddToCalendar, handleConfirmAdd, closeModal
    };
};