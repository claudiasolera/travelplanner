import { useState, useRef, useEffect } from 'react';

interface Props {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export const CityInput = ({ value, onChange, placeholder = 'Ciudad' }: Props) => {
    const [query, setQuery] = useState(value);
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const timeout = useRef<any>(null);
    const ref = useRef<HTMLDivElement>(null);

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
        onChange(val);
        clearTimeout(timeout.current);
        if (val.length < 2) { setSuggestions([]); setOpen(false); return; }
        setLoading(true);
        timeout.current = setTimeout(async () => {
            try {
                const res = await fetch(
                    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(val)}&format=json&limit=6&featuretype=city&accept-language=es`,
                    { headers: { 'Accept-Language': 'es' } }
                );
                const data = await res.json();
                setSuggestions(data);
                setOpen(true);
            } catch { setSuggestions([]); }
            finally { setLoading(false); }
        }, 300);
    };

    const handleSelect = (place: any) => {
        const name = place.display_name.split(',').slice(0, 2).join(',').trim();
        setQuery(name);
        onChange(name);
        setOpen(false);
        setSuggestions([]);
    };

    return (
        <div ref={ref} className="relative w-full">
            <input
                aria-label='Buscar ciudad'
                className="outline-none text-sm text-text placeholder:text-text-soft bg-transparent w-full"
                placeholder={placeholder}
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
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                                    <circle cx="12" cy="10" r="3"/>
                                </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-text truncate">
                                    {place.display_name.split(',')[0]}
                                </p>
                                <p className="text-xs text-text-soft truncate">
                                    {place.display_name.split(',').slice(1, 3).join(',')}
                                </p>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};