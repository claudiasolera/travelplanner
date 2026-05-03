import { UserCard } from '../community/UserCard';

interface Props {
    title: string;
    list: any[];
    onClose: () => void;
}

export const FollowModal = ({ title, list, onClose }: Props) => (
    <div className="modal-backdrop z-50" onClick={onClose}>
        <div className="modal rounded-3xl w-full max-w-sm max-h-[70vh] flex flex-col overflow-hidden"
            onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-border flex justify-between items-center">
                <h3 className="font-semibold text-text">{title} ({list.length})</h3>
                <button 
                    aria-label="Cerrar"
                    onClick={onClose} 
                    className="text-text-soft hover:text-text transition"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round"/>
                    </svg>
                </button>
            </div>
            <div className="overflow-y-auto p-4 space-y-3">
                {list.length === 0 ? (
                    <p className="text-text-soft text-sm text-center py-8">Sin resultados.</p>
                ) : list.map(u => <UserCard key={u.id} u={u} />)}
            </div>
        </div>
    </div>
);