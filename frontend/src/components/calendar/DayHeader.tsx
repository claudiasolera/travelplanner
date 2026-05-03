import { DayData } from '../../types/calendar';

interface Props {
    day: DayData;
    editing: boolean;
    title: string;
    notes: string;
    onToggleEdit: () => void;
    onTitleChange: (v: string) => void;
    onNotesChange: (v: string) => void;
    onSave: () => void;
}

export const DayHeader = ({ day, editing, title, notes, onToggleEdit, onTitleChange, onNotesChange, onSave }: Props) => (
    <div className="card-lg rounded-2xl p-5">
        <div className="flex justify-between items-start">
            <div className="flex-1">
                <p className="text-xs text-text-soft">
                    {new Date(day.date).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                </p>
                {editing ? (
                    <input
                        aria-label="Título del día en edición"
                        className="text-lg font-semibold text-text border-b-2 border-primary outline-none w-full mt-1 bg-transparent"
                        value={title} onChange={e => onTitleChange(e.target.value)}
                        placeholder="Título del día (ej: Llegada a París)"
                    />
                ) : (
                    <h2 className="text-lg font-semibold text-text mt-1">{day.title || `Día ${day.day}`}</h2>
                )}
            </div>
            <button
                aria-label={editing ? 'Cancelar edición' : 'Editar notas'}
                onClick={onToggleEdit}
                className="flex items-center gap-1.5 text-xs text-primary hover:text-primary-dark border border-primary/30 bg-primary-light px-2.5 py-1.5 rounded-xl transition"
            >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                {editing ? 'Cancelar' : 'Editar'}
            </button>
        </div>
        {editing ? (
            <div className="mt-3 space-y-3">
                <div>
                    <label className="label">Título del día</label>
                    <input 
                        aria-label="Título del día" 
                        className="input px-3 py-2.5 w-full"
                        value={title} 
                        onChange={e => onTitleChange(e.target.value)} placeholder="Ej: Llegada a París" 
                    />
                </div>
                <div>
                    <label className="label">Notas</label>
                    <textarea 
                        className="input px-3 py-2.5 resize-none w-full" 
                        rows={3}
                        placeholder="Notas personales para este día..."
                        value={notes} 
                        onChange={e => onNotesChange(e.target.value)} 
                    />
                </div>
                <button 
                    aria-label="Guardar notas" 
                    onClick={onSave} 
                    className="btn text-xs py-1.5 px-4"
                >
                    Guardar
                </button>
            </div>
        ) : day.notes ? (
            <p className="text-sm text-text-secondary mt-2 flex items-center gap-1.5">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                    <polyline points="14,2 14,8 20,8" />
                </svg>
                {day.notes}
            </p>
        ) : null}
    </div>
);