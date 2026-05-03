import { useState, useRef, useEffect } from 'react';
import { searchService } from '../../services/searchService';

interface Props {
    value: string;
    onChange: (value: string, iataCode: string) => void;
    placeholder?: string;
    onlyAirports?: boolean;
}

export const AirportInput = ({ value, onChange, placeholder = 'Ciudad o aeropuerto', onlyAirports = false }: Props) => {
    const [query, setQuery] = useState(value);
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const timeout = useRef<any>(null);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => setQuery(value), [value]);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const handleChange = (val: string) => {
        setQuery(val);
        clearTimeout(timeout.current);
        if (val.length < 2) { setSuggestions([]); setOpen(false); return; }
        setLoading(true);
        timeout.current = setTimeout(async () => {
            try {
                const results = await searchService.searchAirports(val, onlyAirports);
                setSuggestions(results.slice(0, 6));
                setOpen(true);
            } catch { setSuggestions([]); }
            finally { setLoading(false); }
        }, 300);
    };

    const handleSelect = (place: any) => {
        const label = place.name || place.iata_code;
        const iata = place.iata_code || place.airports?.[0]?.iata_code || '';
        const displayText = iata ? `${label} (${iata})` : label;
        setQuery(displayText);
        onChange(label, iata);
        setOpen(false);
        setSuggestions([]);
    };

    return (
        <div ref={ref} className="relative w-full">
            <input
                aria-label={onlyAirports ? "Buscar aeropuerto" : "Buscar ciudad o aeropuerto"}
                className="outline-none text-sm text-text placeholder:text-text-soft bg-transparent w-full"
                placeholder={onlyAirports ? 'Busca tu aeropuerto...' : placeholder}
                value={query}
                onChange={e => handleChange(e.target.value)}
                onFocus={() => suggestions.length > 0 && setOpen(true)}
            />
            {loading && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2">
                    <div className="spinner-sm"/>
                </div>
            )}
            {open && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 min-w-62.5 bg-white rounded-2xl shadow-lg border border-border z-100 overflow-hidden">
                    {suggestions.map((place, i) => (
                        <button
                            aria-label={`Seleccionar ${place.name}`}
                            key={i} 
                            onMouseDown={() => handleSelect(place)}
                            className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-primary-light transition text-left"
                        >
                            <div className="w-8 h-8 bg-primary-light rounded-lg flex items-center justify-center shrink-0">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2">
                                    {place.type === 'airport' ? (
                                        <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 00-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                                    ) : (
                                        <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></>
                                    )}
                                </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-text truncate">
                                    {place.name}
                                </p>
                                <p className="text-xs text-text-soft truncate">
                                    {place.iata_code && <span className="font-mono text-primary mr-1">{place.iata_code}</span>}
                                    {place.city_name || place.country_name}
                                </p>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};