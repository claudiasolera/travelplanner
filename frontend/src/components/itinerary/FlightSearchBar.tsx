import { useState } from 'react';
import { SearchIcon } from './icons';
import { searchService } from '../../services/searchService';
import { AirportInput } from '../explore/AirportInput';
import { FlightCard } from './FlightCard';

interface Props {
    onAdd: (flight: any) => void;
    onClose: () => void;
    defaultOrigin?: string;
    defaultDestination?: string;
    defaultDepartureDate?: string;
    defaultReturnDate?: string;
    onError?: (msg: string) => void;
}

const resolveIata = async (text: string): Promise<string | null> => {
    if (/^[A-Z]{3}$/.test(text)) return text;
    try {
        const results = await searchService.searchAirports(text);
        if (results.length > 0) {
            return results[0].iata_code || results[0].airports?.[0]?.iata_code || null;
        }
    } catch {}
    return null;
};

export const FlightSearchBar = ({ onAdd, onClose, defaultOrigin = '', defaultDestination = '', defaultDepartureDate = '', defaultReturnDate = '', onError }: Props) => {
    const [originCode, setOriginCode] = useState('');
    const [destCode, setDestCode] = useState('');
    const [originLabel, setOriginLabel] = useState(defaultOrigin);
    const [destLabel, setDestLabel] = useState(defaultDestination);
    const today = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .split('T')[0];
    const [inputs, setInputs] = useState({
        departureDate: defaultDepartureDate || today,
        returnDate: defaultReturnDate || '',
        tripType: 'oneway' as 'oneway' | 'roundtrip',
        adults: 1,
        travelClass: 'ECONOMY' as 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST',
    });
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const search = async () => {
        setResults([]);
        
        if (!originLabel && !originCode) {
            onError?.('Introduce un origen');
            return;
        }
        if (!destLabel && !destCode) {
            onError?.('Introduce un destino');
            return;
        }
        if (!inputs.departureDate) {
            onError?.('Introduce una fecha de salida');
            return;
        }
        if (inputs.departureDate < today) {
            onError?.('La fecha de salida no puede ser anterior a hoy');
            return;
        }
        if (inputs.tripType === 'roundtrip') {
            if (!inputs.returnDate) {
                onError?.('Introduce una fecha de vuelta');
                return;
            }
            if (inputs.returnDate <= inputs.departureDate) {
                onError?.('La fecha de vuelta debe ser posterior a la de salida');
                return;
            }
        }

        setLoading(true);
        try {
            let origin = originCode;
            let destination = destCode;

            if (!origin) {
                origin = await resolveIata(originLabel) || '';
            }
            if (!destination) {
                destination = await resolveIata(destLabel) || '';
            }

            if (!origin) {
                onError?.(`No se encontró un aeropuerto para "${originLabel}". Selecciona uno de la lista.`);
                setLoading(false);
                return;
            }
            if (!destination) {
                onError?.(`No se encontró un aeropuerto para "${destLabel}". Selecciona uno de la lista.`);
                setLoading(false);
                return;
            }

            const response = await searchService.searchFlights({
                origin,
                destination,
                departureDate: inputs.departureDate,
                returnDate: inputs.tripType === 'roundtrip' ? inputs.returnDate : undefined,
                adults: inputs.adults,
                travelClass: inputs.travelClass,
            });
            const flights = response.flights || [];
            if (flights.length === 0) onError?.('No se encontraron vuelos para esa ruta');
            setResults(flights);
        } catch {
            onError?.('Error al buscar vuelos. Comprueba los datos introducidos');
            setResults([]);
        } finally { setLoading(false); }
    };

    return (
        <div className="card-lg rounded-2xl p-5 space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="font-semibold text-primary text-sm flex items-center gap-2">
                    <SearchIcon size={14} /> Buscar vuelo
                </h3>
                <button 
                    aria-label='Cerrar'
                    onClick={onClose} 
                    className="text-xs text-text-secondary hover:text-text"
                >
                    ✕ Cerrar
                </button>
            </div>

            <div className="flex gap-2">
                {(['oneway', 'roundtrip'] as const).map(type => (
                    <button 
                        aria-label={type === 'oneway' ? 'Solo ida' : 'Ida y vuelta'}
                        key={type}
                        onClick={() => setInputs(prev => ({ ...prev, tripType: type }))}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition ${inputs.tripType === type ? 'bg-primary text-white' : 'bg-primary-light text-text-secondary hover:text-text'}`}
                    >
                        {type === 'oneway' ? 'Solo ida' : 'Ida y vuelta'}
                    </button>
                ))}
            </div>

            <div className="flex flex-wrap gap-3 items-end">
                <div className="flex-1 min-w-36">
                    <label className="label">Origen</label>
                    <div className="input px-3 py-2 w-full">
                        <AirportInput
                            value={originLabel}
                            placeholder="Ciudad o aeropuerto"
                            onChange={(label, iata) => {
                                setOriginLabel(label);
                                setOriginCode(iata);
                            }}
                        />
                    </div>
                </div>
                <div className="flex-1 min-w-36">
                    <label className="label">Destino</label>
                    <div className="input px-3 py-2 w-full">
                        <AirportInput
                            value={destLabel}
                            placeholder="Ciudad o aeropuerto"
                            onChange={(label, iata) => {
                                setDestLabel(label);
                                setDestCode(iata);
                            }}
                        />
                    </div>
                </div>
                <div className="flex-1 min-w-32">
                    <label className="label">Ida</label>
                    <input 
                        aria-label='Fecha de ida'
                        type="date" 
                        className="input px-3 py-2 w-full" value={inputs.departureDate}
                        min={today}
                        onChange={e => setInputs(prev => ({ ...prev, departureDate: e.target.value }))} 
                    />
                </div>
                {inputs.tripType === 'roundtrip' && (
                    <div className="flex-1 min-w-32">
                        <label className="label">Vuelta</label>
                        <input 
                            aria-label='Fecha de vuelta'
                            type="date" 
                            className="input px-3 py-2 w-full" value={inputs.returnDate}
                            min={inputs.departureDate || today}
                            onChange={e => setInputs(prev => ({ ...prev, returnDate: e.target.value }))} 
                        />
                    </div>
                )}
                <div className="min-w-20">
                    <label className="label">Pasajeros</label>
                    <input 
                        aria-label='Número de pasajeros'
                        type="number" 
                        min={1} 
                        max={9} 
                        className="input px-3 py-2 w-full" 
                        value={inputs.adults}
                        onChange={e => setInputs(prev => ({ ...prev, adults: parseInt(e.target.value) || 1 }))} 
                    />
                </div>
                <div className="min-w-36">
                    <label className="label">Clase</label>
                    <select 
                        aria-label='Clase de viaje'
                        className="input px-3 py-2 w-full" value={inputs.travelClass}
                        onChange={e => setInputs(prev => ({ ...prev, travelClass: e.target.value as any }))}
                    >
                        <option value="ECONOMY">Económica</option>
                        <option value="PREMIUM_ECONOMY">Premium Economy</option>
                        <option value="BUSINESS">Business</option>
                        <option value="FIRST">Primera</option>
                    </select>
                </div>
                <button 
                    aria-label="Buscar vuelos"
                    onClick={search} 
                    className="btn text-sm py-2 px-5"
                >
                    Buscar
                </button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-8 gap-3">
                    <div className="spinner" />
                    <p className="text-sm text-text-secondary">
                        Buscando vuelos...
                    </p>
                </div>
            ) : results.length > 0 && (
                <div className="space-y-3 max-h-125 overflow-y-auto pr-1">
                    {results.map(flight => (
                        <FlightCard
                            key={`${flight.airline}-${flight.departure?.time}`}
                            flight={flight}
                            mode="explore"
                            onDelete={() => {}}
                            onUpdate={() => {}}
                            onAddToTrip={() => onAdd(flight)}
                            addLabel="+ Añadir"
                            bookingLink={flight.bookingLinks?.[0]?.url}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};