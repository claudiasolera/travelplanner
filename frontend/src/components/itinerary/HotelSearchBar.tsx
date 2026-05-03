import { useState } from 'react';
import { SearchIcon } from './icons';
import { searchService } from '../../services/searchService';
import { CityInput } from '../explore/CityInput';
import { HotelCard } from './HotelCard';

interface Props {
    onAdd: (hotel: any) => void;
    onClose: () => void;
    defaultCity?: string;
    defaultCheckIn?: string;
    defaultCheckOut?: string;
    onError?: (msg: string) => void;
}

export const HotelSearchBar = ({ onAdd, onClose, defaultCity = '', defaultCheckIn = '', defaultCheckOut = '', onError }: Props) => {
    const today = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .split('T')[0];
    const [inputs, setInputs] = useState({
        city: defaultCity,
        checkIn: defaultCheckIn || today,
        checkOut: defaultCheckOut || '',
        adults: 1,
        rooms: 1,
    });
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const search = async () => {
        if (!inputs.city) {
            onError?.('Introduce una ciudad de destino');
            return;
        }
        if (!inputs.checkIn || !inputs.checkOut) {
            onError?.('Introduce las fechas de entrada y salida');
            return;
        }
        if (inputs.checkIn < today) {
            onError?.('La fecha de check-in no puede ser anterior a hoy');
            return;
        }
        if (inputs.checkOut <= inputs.checkIn) {
            onError?.('La fecha de check-out debe ser posterior al check-in');
            return;
        }
        setLoading(true);
        try {
            const response = await searchService.searchHotels({
                city: inputs.city,
                checkInDate: inputs.checkIn,
                checkOutDate: inputs.checkOut,
                adults: inputs.adults,
            });
            const hotels = response.hotels || [];
            if (hotels.length === 0) onError?.('No se encontraron hoteles para esa ciudad');
            setResults(hotels);
        } catch {
            onError?.('Error al buscar hoteles. Comprueba la ciudad introducida');
            setResults([]);
        } finally { setLoading(false); }
    };

    return (
        <div className="card-lg rounded-2xl p-5 space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="font-semibold text-primary text-sm flex items-center gap-2">
                    <SearchIcon size={14} /> Buscar hotel
                </h3>
                <button 
                    aria-label="Cerrar"
                    onClick={onClose} 
                    className="text-xs text-text-secondary hover:text-text"
                >
                    ✕ Cerrar
                </button>
            </div>

            <div className="flex flex-wrap gap-3 items-end">
                <div className="flex-1 min-w-40">
                    <label className="label">Ciudad</label>
                    <div className="input px-3 py-2 w-full">
                        <CityInput
                            value={inputs.city}
                            placeholder="Ej: París"
                            onChange={val => setInputs(prev => ({ ...prev, city: val }))}
                        />
                    </div>
                </div>
                <div className="flex-1 min-w-32">
                    <label className="label">Check-in</label>
                    <input 
                        aria-label="Fecha de check-in"
                        type="date" 
                        className="input px-3 py-2 w-full" value={inputs.checkIn}
                        min={today}
                        onChange={e => setInputs(prev => ({ ...prev, checkIn: e.target.value }))} 
                    />
                </div>
                <div className="flex-1 min-w-32">
                    <label className="label">Check-out</label>
                    <input 
                        aria-label="Fecha de check-out"
                        type="date" 
                        className="input px-3 py-2 w-full" value={inputs.checkOut}
                        min={inputs.checkIn || today}
                        onChange={e => setInputs(prev => ({ ...prev, checkOut: e.target.value }))} 
                    />
                </div>
                <div className="min-w-20">
                    <label className="label">Personas</label>
                    <input 
                        aria-label="Número de personas"
                        type="number" 
                        min={1} 
                        max={9} 
                        className="input px-3 py-2 w-full" 
                        value={inputs.adults}
                        onChange={e => setInputs(prev => ({ ...prev, adults: parseInt(e.target.value) || 1 }))} 
                    />
                </div>
                <button 
                    aria-label="Buscar hoteles"
                    onClick={search} 
                    className="btn text-sm py-2 px-5"
                >
                    Buscar
                </button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-8 gap-3">
                    <div className="spinner" />
                    <p className="text-sm text-text-secondary">Buscando hoteles...</p>
                </div>
            ) : results.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-125 overflow-y-auto pr-1">
                    {results.map(hotel => (
                        <HotelCard
                            key={hotel.hotelId}
                            hotel={hotel}
                            mode="explore"
                            onDelete={() => {}}
                            onUpdate={() => {}}
                            onAddToTrip={() => onAdd({ ...hotel, checkIn: inputs.checkIn, checkOut: inputs.checkOut })}
                            addLabel="+ Añadir"
                            checkIn={inputs.checkIn}
                            checkOut={inputs.checkOut}
                            adults={inputs.adults}
                            rooms={inputs.rooms}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
