import { SearchIcon, PlusIcon } from './icons';

interface Props {
    onSearch: () => void;
    onManual: () => void;
    searchLabel: string;
    manualLabel: string;
}

export const AddButtons = ({ onSearch, onManual, searchLabel, manualLabel }: Props) => (
    <div className="flex gap-3 justify-center">
        <button 
            aria-label='Buscar'
            onClick={onSearch}
            className="flex items-center justify-center gap-2 bg-primary-light hover:bg-primary hover:text-white text-primary text-sm font-medium py-3 px-6 rounded-2xl transition"
        >
            <SearchIcon size={14} /> {searchLabel}
        </button>
        <button 
            aria-label='Añadir manualmente'
            onClick={onManual}
            className="flex items-center justify-center gap-2 bg-primary-light hover:bg-primary hover:text-white text-primary text-sm font-medium py-3 px-6 rounded-2xl transition"
        >
            <PlusIcon size={14} /> {manualLabel}
        </button>
    </div>
);