interface Props {
    search: string;
    filter: 'all' | 'public' | 'private';
    sort: 'recent' | 'oldest';
    onSearchChange: (val: string) => void;
    onFilterChange: (val: 'all' | 'public' | 'private') => void;
    onSortChange: (val: 'recent' | 'oldest') => void;
}

export const TripFilters = ({ search, filter, sort, onSearchChange, onFilterChange, onSortChange }: Props) => (
    <div className="flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 bg-card border border-border rounded-full px-4 py-2 flex-1 min-w-48">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9A9A9A" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" strokeLinecap="round" />
            </svg>
            <input
                aria-label="Buscar mis viajes"
                type="text"
                placeholder="Buscar mis viajes..."
                value={search}
                onChange={e => onSearchChange(e.target.value)}
                className="flex-1 bg-transparent outline-none text-sm text-text placeholder:text-text-soft"
            />
        </div>
        <select
            aria-label="Estado del viaje"
            value={filter}
            onChange={e => onFilterChange(e.target.value as any)}
            className="input px-4 py-2 rounded-full cursor-pointer"
        >
            <option value="all">Todos los estados</option>
            <option value="public">Públicos</option>
            <option value="private">Privados</option>
        </select>
        <select
            aria-label="Ordenar por fecha"
            value={sort}
            onChange={e => onSortChange(e.target.value as any)}
            className="bg-card border border-border rounded-full px-4 py-2 text-sm text-text outline-none cursor-pointer"
        >
            <option value="recent">Más recientes</option>
            <option value="oldest">Más antiguos</option>
        </select>
    </div>
);