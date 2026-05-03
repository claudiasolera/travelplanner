import { tipCategoryColors } from '../../types/reviews';
import { TrashIcon } from '../itinerary/icons';

interface Props {
    tip: { id: string; category: string; content: string };
    onDelete: () => void;
}

export const TipCard = ({ tip, onDelete }: Props) => {
    const style = tipCategoryColors[tip.category] || { bg: 'bg-gray-50', text: 'text-gray-600' };
    return (
        <div className={`${style.bg} rounded-2xl p-4 flex gap-3`} style={{ border: '1.5px solid rgba(255,255,255,0.8)' }}>
            <div className="flex-1">
                <p className={`text-xs font-semibold capitalize mb-1 ${style.text}`}>{tip.category}</p>
                <p className="text-sm text-text leading-relaxed">{tip.content}</p>
            </div>
            <button 
                onClick={onDelete} 
                className="text-text-soft hover:text-red-400 transition shrink-0" 
                aria-label="Eliminar consejo"
            >
                <TrashIcon />
            </button>
        </div>
    );
};