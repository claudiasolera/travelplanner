import { JSX } from 'react';
import { Activity, activityTypes, activityTypeColors } from '../../types/calendar';
import { ForkKnifeIcon, FlightIcon, HotelIcon, ShoppingBagIcon, ActivityIcon } from '../itinerary/icons';
import { tripService } from '../../services/tripService';

const activityTypeIcon = (type: string): JSX.Element => {
    const icons: Record<string, JSX.Element> = {
        'Restaurante': <ForkKnifeIcon size={12} />,
        'Transporte':  <FlightIcon size={12} />,
        'Alojamiento': <HotelIcon size={12} />,
        'Compras':     <ShoppingBagIcon size={12} />,
        'Actividad':   <ActivityIcon size={12} />,
    };
    return icons[type] || icons['Actividad'];
};

interface Props {
    activities: Activity[];
    dayId: string;
    tripId: string;
    showForm: boolean;
    newActivity: { name: string; type: string; time: string; notes: string; amount: string; photo: File | null };
    photoPreview: string | null;
    onNewActivityChange: (data: any) => void;
    onPhotoPreviewChange: (v: string | null) => void;
    onAdd: () => void;
    onDelete: (id: string) => void;
    onToggleForm: (v: boolean) => void;
    onRefresh: () => void;
}

export const ActivityList = ({
    activities, dayId, tripId, showForm, newActivity, photoPreview,
    onNewActivityChange, onPhotoPreviewChange, onAdd, onDelete, onToggleForm, onRefresh
}: Props) => (
    <div className="card-lg rounded-2xl p-4">
        <p className="text-xs font-semibold text-text-soft mb-3 uppercase tracking-wide flex items-center gap-2">
            <span className="w-5 h-5 bg-primary-light rounded-lg flex items-center justify-center">
                <svg 
                    width="11" 
                    height="11" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="#2563EB" 
                    strokeWidth="2"
                >
                    <circle 
                        cx="12" 
                        cy="10" 
                        r="4" 
                    /><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                </svg>
            </span>
            Actividades
        </p>

        {activities.length === 0 && !showForm && (
            <p className="text-sm text-text-soft text-center py-4">
                No hay actividades para este día.
            </p>
        )}

        {[...activities].sort((a, b) => a.time.localeCompare(b.time)).map(activity => (
            <div key={activity.id} className="py-3 border-b border-border last:border-0 group">
                <div className="flex items-start gap-3">
                    <span className="text-xs font-mono text-text-soft mt-0.5 w-12 shrink-0">
                        {activity.time}
                    </span>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                            <span className={`text-xs px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${activityTypeColors[activity.type] 
                                            || 'bg-gray-50 text-gray-500'}`}
                            >
                                {activityTypeIcon(activity.type)}
                                {activity.type}
                            </span>
                        </div>
                        <p className="text-sm font-medium text-text">
                            {activity.name}
                        </p>
                        {activity.notes && 
                            <p className="text-xs text-text-soft mt-0.5">
                                {activity.notes}
                            </p>
                        }
                        {activity.amount && 
                            <p className="text-xs text-green-600 font-medium mt-0.5">
                                {activity.amount}€
                            </p>
                        }
                        {activity.photos && activity.photos.length > 0 && (
                            <div className="flex gap-2 mt-2 flex-wrap">
                                {activity.photos.map((photo, i) => (
                                    <div key={i} className="w-32 h-24 rounded-xl overflow-hidden shrink-0">
                                        <img 
                                            src={photo} 
                                            alt={`${activity.name} ${i + 1}`} 
                                            className="w-full h-full object-cover" 
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                        {(!activity.photos || activity.photos.length < 5) && (
                            <label className="mt-2 flex items-center gap-1.5 cursor-pointer w-fit text-xs text-text-soft hover:text-primary transition">
                                <svg 
                                    width="11" 
                                    height="11" 
                                    viewBox="0 0 24 24" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    strokeWidth="2">
                                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" 
                                />
                                    <polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                                </svg>
                                Añadir foto
                                <input 
                                    aria-label="Seleccionar foto" 
                                    type="file" 
                                    accept="image/*" 
                                    className="hidden"
                                    onChange={async e => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;
                                        try {
                                            await tripService.addActivityPhoto(dayId, activity.id, file);
                                            onRefresh();
                                        } catch { alert('Error al subir foto'); }
                                    }} 
                                />
                            </label>
                        )}
                    </div>
                    <button 
                        aria-label="Eliminar actividad" 
                        onClick={() => onDelete(activity.id)}
                        className="text-text-soft hover:text-red-400 transition opacity-0 group-hover:opacity-100 shrink-0"
                    >
                        <svg 
                            width="14" 
                            height="14" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2"
                        >
                            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>
            </div>
        ))}

        {showForm && (
            <div className="mt-3 space-y-3 border-t border-border pt-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="sm:col-span-2">
                        <label className="label">Nombre</label>
                        <input 
                            aria-label="Nombre de la actividad" 
                            className="input px-4 py-2.5 w-full" 
                            placeholder="Ej: Visita al Louvre"
                            value={newActivity.name} 
                            onChange={e => onNewActivityChange({ ...newActivity, name: e.target.value })} 
                        />
                    </div>
                    <div>
                        <label className="label">Hora</label>
                        <input 
                            aria-label="Hora" 
                            type="time" 
                            className="input px-4 py-2.5 w-full"
                            value={newActivity.time} 
                            onChange={e => onNewActivityChange({ ...newActivity, time: e.target.value })} 
                        />
                    </div>
                    <div>
                        <label className="label">Tipo</label>
                        <select 
                            aria-label="Tipo" 
                            className="input px-4 py-2.5 w-full"
                            value={newActivity.type} 
                            onChange={e => onNewActivityChange({ ...newActivity, type: e.target.value })}
                        >
                            {activityTypes.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="label">Nota</label>
                        <input 
                            aria-label="Nota" 
                            className="input px-4 py-2.5 w-full" 
                            placeholder="Opcional"
                            value={newActivity.notes} 
                            onChange={e => onNewActivityChange({ ...newActivity, notes: e.target.value })} 
                        />
                    </div>
                    <div>
                        <label className="label">Importe (€)</label>
                        <input 
                            aria-label="Importe" 
                            type="number" 
                            className="input px-4 py-2.5 w-full" 
                            placeholder="Opcional"
                            value={newActivity.amount} 
                            onChange={e => onNewActivityChange({ ...newActivity, amount: e.target.value })} 
                        />
                    </div>
                </div>
                <div>
                    <label className="label">Foto (opcional)</label>
                    {photoPreview ? (
                        <div className="relative w-32 h-24 rounded-xl overflow-hidden">
                            <img src={photoPreview} alt="preview" className="w-full h-full object-cover" />
                            <button 
                                aria-label="Eliminar foto"
                                onClick={() => { onPhotoPreviewChange(null); onNewActivityChange({ ...newActivity, photo: null }); }}
                                className="absolute top-1 right-1 bg-black/50 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                            >
                                ✕
                            </button>
                        </div>
                    ) : (
                        <label className="flex items-center gap-2 cursor-pointer w-fit border border-dashed border-border rounded-xl px-3 py-2 text-xs text-text-soft hover:bg-bg-section transition">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                                <polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                            </svg>
                            Subir foto
                            <input 
                                aria-label="Subir foto" 
                                type="file" 
                                accept="image/*" 
                                className="hidden"
                                onChange={e => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    onNewActivityChange({ ...newActivity, photo: file });
                                    onPhotoPreviewChange(URL.createObjectURL(file));
                                }} 
                            />
                        </label>
                    )}
                </div>
                <div className="flex gap-2">
                    <button 
                        aria-label="Guardar actividad" 
                        onClick={onAdd} 
                        className="btn text-xs py-1.5 px-4"
                    >
                        Guardar
                    </button>
                    <button 
                        aria-label="Cancelar" 
                        onClick={() => { onToggleForm(false); onPhotoPreviewChange(null); }}
                        className="text-xs text-text-soft hover:text-text px-3 py-1.5"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        )}

        {!showForm && (
            <div className="flex justify-center mt-3">
                <button 
                    aria-label="Añadir actividad" 
                    onClick={() => onToggleForm(true)}
                    className="flex items-center justify-center gap-2 bg-primary-light hover:bg-primary hover:text-white text-primary text-sm font-medium py-3 px-6 rounded-2xl transition"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                    </svg>
                    Añadir actividad
                </button>
            </div>
        )}
    </div>
);