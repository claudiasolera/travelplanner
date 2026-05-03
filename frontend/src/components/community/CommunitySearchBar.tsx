type SortBy = 'recent' | 'liked' | 'saved' | 'budget';
type DurationFilter = '' | '1-3' | '4-7' | '8-14' | '15+';
type BudgetFilter = '' | '500' | '1000' | '2000' | '2001+';

interface Props {
    searchQuery: string;
    durationFilter: DurationFilter;
    budgetFilter: BudgetFilter;
    sortBy: SortBy;
    filteredCount: number;
    onSearchChange: (v: string) => void;
    onDurationChange: (v: DurationFilter) => void;
    onBudgetChange: (v: BudgetFilter) => void;
    onSortChange: (v: SortBy) => void;
    onClear: () => void;
}

export const CommunitySearchBar = ({
    searchQuery, durationFilter, budgetFilter, sortBy, filteredCount,
    onSearchChange, onDurationChange, onBudgetChange, onSortChange, onClear
}: Props) => (
    <div className="max-w-4xl mx-auto relative z-10">
        <div className="rounded-3xl p-3 shadow-xl" style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.3)' }}>
            <div className="bg-white rounded-2xl px-4 py-3 shadow-sm">

                <div className="hidden md:flex items-center gap-0">
                    <div className="flex items-center gap-2 flex-1 px-3 py-1">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9A9A9A" strokeWidth="2">
                            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35" strokeLinecap="round"/>
                        </svg>
                        <input 
                            aria-label="Buscar viajes" 
                            className="outline-none text-sm text-text placeholder:text-text-soft bg-transparent w-full"
                            placeholder="Buscar por destino o región..." 
                            value={searchQuery} onChange={e => onSearchChange(e.target.value)} 
                        />
                    </div>
                    <div className="w-px h-8 bg-border shrink-0"/>
                    <select 
                        aria-label="Duración" 
                        className="outline-none text-sm text-text bg-transparent px-3 py-1 cursor-pointer"
                        value={durationFilter} 
                        onChange={e => onDurationChange(e.target.value as DurationFilter)}
                    >
                        <option value="">
                            Duración
                        </option>
                        <option value="1-3">
                            1 - 3 días
                        </option>
                        <option value="4-7">
                            4 - 7 días
                        </option>
                        <option value="8-14">
                            8 - 14 días
                        </option>
                        <option value="15+">
                            +15 días
                        </option>
                    </select>
                    <div className="w-px h-8 bg-border shrink-0"/>
                    <select 
                        aria-label="Presupuesto" 
                        className="outline-none text-sm text-text bg-transparent px-3 py-1 cursor-pointer"
                        value={budgetFilter} 
                        onChange={e => onBudgetChange(e.target.value as BudgetFilter)}
                    >
                        <option value="">
                            Presupuesto
                        </option>
                        <option value="500">
                            Hasta 500€
                        </option>
                        <option value="1000">
                            500€ - 1.000€
                        </option>
                        <option value="2000">
                            1.000€ - 2.000€
                        </option>
                        <option value="2001+">
                            +2.000€
                        </option>
                    </select>
                    <div className="w-px h-8 bg-border shrink-0"/>
                    <select 
                        aria-label="Ordenar" 
                        className="outline-none text-sm text-text bg-transparent px-3 py-1 cursor-pointer"
                        value={sortBy} 
                        onChange={e => onSortChange(e.target.value as SortBy)}
                    >
                        <option value="recent">
                            Más recientes
                        </option>
                        <option value="liked">
                            Más gustados
                        </option>
                        <option value="saved">
                            Más guardados
                        </option>
                        <option value="budget">
                            Más baratos
                        </option>
                    </select>
                    <div className="w-px h-8 bg-border shrink-0"/>
                    <div className="pl-3"><button aria-label="Buscar" className="btn px-6 shrink-0">Buscar</button></div>
                </div>

                <div className="md:hidden space-y-3">
                    <div className="flex items-center gap-2">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9A9A9A" strokeWidth="2">
                            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35" strokeLinecap="round"/>
                        </svg>
                        <input 
                            aria-label="Buscar viajes" 
                            className="outline-none text-sm text-text placeholder:text-text-soft bg-transparent w-full"
                            placeholder="Buscar por destino..." 
                            value={searchQuery} 
                            onChange={e => onSearchChange(e.target.value)} 
                        />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        <select 
                            aria-label="Duración" 
                            className="input text-xs px-2 py-2 w-full"
                            value={durationFilter} 
                            onChange={e => onDurationChange(e.target.value as DurationFilter)}
                        >
                            <option value="">
                                Duración
                            </option>
                            <option value="1-3">
                                1-3 días
                            </option>
                            <option value="4-7">
                                4-7 días
                            </option>
                            <option value="8-14">
                                8-14 días
                            </option>
                            <option value="15+">
                                +15 días
                            </option>
                        </select>
                        <select 
                            aria-label="Presupuesto" 
                            className="input text-xs px-2 py-2 w-full"
                            value={budgetFilter} 
                            onChange={e => onBudgetChange(e.target.value as BudgetFilter)}
                        >
                            <option value="">
                                Precio
                            </option>
                            <option value="500">
                                -500€</option>
                            <option value="1000">
                                500-1k€
                            </option>
                            <option value="2000">
                                1k-2k€
                            </option>
                            <option value="2001+">
                                +2k€
                            </option>
                        </select>
                        <select 
                            aria-label="Ordenar" 
                            className="input text-xs px-2 py-2 w-full"
                            value={sortBy} 
                            onChange={e => onSortChange(e.target.value as SortBy)}
                        >
                            <option value="recent">
                                Recientes
                            </option>
                            <option value="liked">
                                Gustados
                            </option>
                            <option value="saved">
                                Guardados
                            </option>
                            <option value="budget">
                                Baratos
                            </option>
                        </select>
                    </div>
                </div>
            </div>
        </div>

        {(searchQuery || durationFilter || budgetFilter) && (
            <div className="flex items-center gap-2 mt-3 px-1">
                <span className="text-xs text-white/80">{filteredCount} viajes encontrados</span>
                <button 
                    aria-label="Limpiar filtros" 
                    onClick={onClear} 
                    className="text-xs text-white hover:underline ml-auto"
                >
                    Limpiar filtros
                </button>
            </div>
        )}
    </div>
);