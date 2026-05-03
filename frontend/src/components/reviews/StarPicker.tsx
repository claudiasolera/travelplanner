import { StarIcon } from '../itinerary/icons';

interface Props {
    value: number;
    onChange: (v: number) => void;
}

export const StarPicker = ({ value, onChange }: Props) => (
    <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(s => (
            <button 
                aria-label={`Calificar ${s} estrellas`} 
                key={s} 
                type="button" 
                onClick={() => onChange(s)}
            >
                <StarIcon size={20} color={s <= value ? '#f59e0b' : '#e5e7eb'} />
            </button>
        ))}
    </div>
);