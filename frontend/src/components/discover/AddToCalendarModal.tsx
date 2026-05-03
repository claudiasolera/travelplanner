interface Props {
    item: any;
    itineraries: any[];
    selectedDay: string;
    selectedTime: string;
    onDayChange: (v: string) => void;
    onTimeChange: (v: string) => void;
    onConfirm: () => void;
    onClose: () => void;
}

export const AddToCalendarModal = ({ item, itineraries, selectedDay, selectedTime, onDayChange, onTimeChange, onConfirm, onClose }: Props) => (
    <div className="modal-backdrop" onClick={onClose}>
        <div className="modal max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-primary-light rounded-xl flex items-center justify-center shrink-0">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" />
                        <path d="M3 9h18M8 2v4M16 2v4" />
                    </svg>
                </div>
                <div className="min-w-0">
                    <h3 className="font-semibold text-text">
                        Añadir al calendario
                    </h3>
                    <p className="text-xs text-text-secondary truncate">
                        {item.name}
                    </p>
                </div>
                <button 
                    aria-label="Cerrar modal" 
                    onClick={onClose}
                    className="ml-auto text-text-secondary hover:text-text"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <div className="space-y-4">
                <div>
                    <label className="label">
                        Día del viaje
                    </label>
                    <select 
                        aria-label="Día del viaje" 
                        className="input px-3 py-2 w-full"
                        value={selectedDay} 
                        onChange={e => onDayChange(e.target.value)}
                    >
                        {itineraries.map((day: any) => (
                            <option key={day.id} value={day.id}>
                                Día {day.day} — {new Date(day.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="label">Hora</label>
                    <input 
                        aria-label="Hora" 
                        type="time" 
                        className="input px-3 py-2 w-full"
                        value={selectedTime} 
                        onChange={e => onTimeChange(e.target.value)} 
                    />
                </div>
            </div>
            <div className="flex gap-3 mt-5">
                <button 
                    aria-label="Confirmar" 
                    onClick={onConfirm} 
                    className="flex-1 btn py-2 text-sm"
                >
                    Añadir
                </button>
                <button 
                    aria-label="Cancelar" 
                    onClick={onClose}
                    className="flex-1 bg-primary-light text-text-secondary hover:text-text py-2 rounded-xl text-sm transition"
                >
                    Cancelar
                </button>
            </div>
        </div>
    </div>
);