import { useState } from 'react';
import { FlightIcon } from './icons';

const AIRLINES: Record<string, string> = {
    'Iberia': 'IB', 'Vueling': 'VY', 'Ryanair': 'FR', 'EasyJet': 'U2',
    'Air Europa': 'UX', 'Lufthansa': 'LH', 'Air France': 'AF', 'KLM': 'KL',
    'British Airways': 'BA', 'Swiss': 'LX', 'Turkish Airlines': 'TK',
    'Emirates': 'EK', 'Qatar Airways': 'QR', 'American Airlines': 'AA',
    'Delta': 'DL', 'United': 'UA', 'Air Canada': 'AC', 'Japan Airlines': 'JL',
    'ANA': 'NH', 'Singapore Airlines': 'SQ', 'Cathay Pacific': 'CX',
    'Norwegian': 'DY', 'Wizz Air': 'W6', 'Transavia': 'HV',
    'Alitalia': 'AZ', 'Finnair': 'AY', 'TAP Air Portugal': 'TP',
    'Aer Lingus': 'EI', 'Brussels Airlines': 'SN', 'Eurowings': 'EW',
    'Iberia Express': 'I2', 'Level': 'IB', 'Binter': 'NT'
};

interface Props {
    onSave: (flight: any) => void;
    onClose: () => void;
}

export const ManualFlightForm = ({ onSave, onClose }: Props) => {
    const [flight, setFlight] = useState({
        airline: '', airlineName: '', originCity: '', destCity: '', origin: '', destination: '',
        departure: '', arrival: '', duration: '', stops: 0, price: '', currency: 'EUR'
    });
    const [suggestions, setSuggestions] = useState<{ name: string; code: string }[]>([]);

    const handleSubmit = () => {
        if (!flight.originCity || !flight.destCity || !flight.departure) return;
        onSave({ ...flight, price: parseFloat(flight.price) || 0, duration: '' });
        setFlight({
            airline: '', airlineName: '', originCity: '', destCity: '', origin: '', destination: '',
            departure: '', arrival: '', duration: '', stops: 0, price: '', currency: 'EUR'
        });
    };

    return (
        <div className="card-lg rounded-2xl p-5 space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="font-semibold text-primary text-sm flex items-center gap-2">
                    <FlightIcon size={15} /> Añadir vuelo manualmente
                </h3>
                <button 
                    aria-label="Cerrar"
                    onClick={onClose} 
                    className="text-xs text-text-secondary hover:text-text"
                >
                    ✕ Cerrar
                </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div className="col-span-2 md:col-span-1">
                    <label className="label">Aerolínea</label>
                    <div className="relative">
                        <div className="flex items-center gap-2">
                            <input 
                                aria-label="Aerolínea del vuelo"
                                className="input px-3 py-2 w-full"
                                placeholder="Ej: Iberia, Ryanair..."
                                value={flight.airlineName || flight.airline}
                                onChange={e => {
                                    const val = e.target.value;
                                    setFlight({ ...flight, airlineName: val });
                                    const matches = Object.entries(AIRLINES)
                                        .filter(([name]) => name.toLowerCase().includes(val.toLowerCase()))
                                        .map(([name, code]) => ({ name, code }));
                                    setSuggestions(val.length >= 1 ? matches.slice(0, 5) : []);
                                }}
                                onBlur={() => setTimeout(() => setSuggestions([]), 150)}
                            />
                            {flight.airline.length >= 2 && (
                                <img src={`https://www.gstatic.com/flights/airline_logos/70px/${flight.airline}.png`}
                                    alt={flight.airline} className="w-9 h-9 object-contain shrink-0"
                                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} 
                                />
                            )}
                        </div>
                        {suggestions.length > 0 && (
                            <ul className="absolute z-10 w-full bg-card border border-border rounded-xl mt-1 shadow-md overflow-hidden">
                                {suggestions.map(({ name, code }) => (
                                    <li key={code}
                                        className="flex items-center gap-3 px-3 py-2 hover:bg-primary-light cursor-pointer"
                                        onMouseDown={() => { setFlight({ ...flight, airline: code, airlineName: name }); setSuggestions([]); }}
                                    >
                                        <img src={`https://www.gstatic.com/flights/airline_logos/70px/${code}.png`}
                                            alt={code} className="w-7 h-7 object-contain"
                                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} 
                                        />
                                        <span className="text-sm text-text">
                                            {name}
                                        </span>
                                        <span className="text-xs text-text-secondary ml-auto">
                                            {code}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
                <div>
                    <label className="label">
                        Ciudad origen
                    </label>
                    <input 
                        aria-label="Ciudad de origen del vuelo"
                        className="input px-3 py-2 w-full" 
                        placeholder="Ej: Madrid"
                        value={flight.originCity}
                        onChange={e => setFlight({ ...flight, originCity: e.target.value })} 
                    />
                </div>
                <div>
                    <label className="label">
                        Ciudad destino
                    </label>
                    <input 
                        aria-label="Ciudad de destino del vuelo"
                        className="input px-3 py-2 w-full" 
                        placeholder="Ej: Londres"
                        value={flight.destCity}
                        onChange={e => setFlight({ ...flight, destCity: e.target.value })} 
                    />
                </div>
                <div>
                    <label className="label">
                        Fecha salida
                    </label>
                    <input 
                        aria-label="Fecha de salida del vuelo"
                        type="date" 
                        className="input px-3 py-2 w-full"
                        value={flight.departure?.split('T')[0] || ''}
                        onChange={e => setFlight({ ...flight, departure: `${e.target.value}T${flight.departure?.split('T')[1] || '00:00'}` })} 
                    />
                </div>
                <div>
                    <label className="label">
                        Fecha llegada
                    </label>
                    <input 
                        aria-label="Fecha de llegada prevista"
                        type="date" 
                        className="input px-3 py-2 w-full"
                        value={flight.arrival?.split('T')[0] || ''}
                        onChange={e => setFlight({ ...flight, arrival: `${e.target.value}T${flight.arrival?.split('T')[1] || '00:00'}` })} 
                    />
                </div>
                <div>
                    <label className="label">
                        Precio (€)
                    </label>
                    <input 
                        aria-label="Precio del vuelo en euros"
                        type="number" 
                        className="input px-3 py-2 w-full" 
                        placeholder="0"
                        value={flight.price}
                        onChange={e => setFlight({ ...flight, price: e.target.value })} />
                </div>
                <div>
                    <label className="label">
                        Hora salida
                    </label>
                    <input 
                        aria-label="Hora de salida del vuelo"
                        type="time" 
                        className="input px-3 py-2 w-full"
                        value={flight.departure?.split('T')[1] || ''}
                        onChange={e => setFlight({ ...flight, departure: `${flight.departure?.split('T')[0] || ''}T${e.target.value}` })} 
                    />
                </div>
                <div>
                    <label className="label">
                        Hora llegada
                    </label>
                    <input 
                        aria-label="Hora de llegada del vuelo"
                        type="time" 
                        className="input px-3 py-2 w-full"
                        value={flight.arrival?.split('T')[1] || ''}
                        onChange={e => setFlight({ ...flight, arrival: `${flight.arrival?.split('T')[0] || ''}T${e.target.value}` })} 
                    />
                </div>         
                <div>
                    <label className="label">
                        Escalas
                    </label>
                    <input 
                        aria-label="Número de escalas del vuelo"
                        type="number" 
                        min={0} 
                        className="input px-3 py-2 w-full"
                        value={flight.stops}
                        onChange={e => setFlight({ ...flight, stops: parseInt(e.target.value) || 0 })} 
                    />
                </div>
            </div>

            <button 
                aria-label="Guardar vuelo"
                onClick={handleSubmit} 
                className="btn text-sm py-2 px-5"
            >
                Guardar vuelo
            </button>
        </div>
    );
};