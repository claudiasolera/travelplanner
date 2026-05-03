import { useState } from 'react';
import { EditIcon, DeleteIcon } from './icons';

interface Props {
    flight: any;
    onDelete: (id: string) => void;
    onUpdate: (id: string, data: any) => void;
    mode?: 'itinerary' | 'explore';
    onAddToTrip?: () => void;
    bookingLink?: string;
    addLabel?: string;
}

export const FlightCard = ({ flight, onDelete, onUpdate, mode = 'itinerary', onAddToTrip, bookingLink, addLabel = '+ Viaje' }: Props) => {
    const [logoError, setLogoError] = useState(false);
    const [editing, setEditing] = useState(false);
    const [editData, setEditData] = useState<any>(flight);

    const handleSave = () => {
        onUpdate(flight.id, editData);
        setEditing(false);
    };

    const depTime = new Date(flight.departure?.time || flight.departure).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    const arrTime = new Date(flight.arrival?.time || flight.arrival).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    const formatDuration = (duration: string) => {
        if (!duration) return '';
        const days = parseInt(duration.match(/(\d+)D/)?.[1] || '0');
        const hours = parseInt(duration.match(/(\d+)H/)?.[1] || '0');
        const mins = parseInt(duration.match(/(\d+)M/)?.[1] || '0');
        const totalHours = days * 24 + hours;
        return `${totalHours}h ${mins > 0 ? `${mins}min` : ''}`.trim();
    };
    const duration = formatDuration(flight.duration);
    const stopsLabel = flight.stops === 0 ? 'Directo' : `${flight.stops} escala${flight.stops > 1 ? 's' : ''}`;
    const originCode = flight.departure?.airport || flight.origin || '';
    const destCode = flight.arrival?.airport || flight.destination || '';

    return (
        <div className="card-lg rounded-2xl overflow-hidden">
            {editing ? (
                <div className="p-5 space-y-3">
                    <div className="flex flex-wrap gap-3">
                        {[
                            { label: 'Ciudad origen', key: 'originCity' },
                            { label: 'Ciudad destino', key: 'destCity' },
                        ].map(f => (
                            <div key={f.key} className="flex-1 min-w-32">
                                <label className="label">{f.label}</label>
                                <input 
                                    aria-label={f.label}
                                    className="input px-3 py-2 w-full" 
                                    value={editData[f.key] || ''}
                                    onChange={e => setEditData({ ...editData, [f.key]: e.target.value })} 
                                />
                            </div>
                        ))}
                        <div className="flex-1 min-w-32">
                            <label className="label">Salida</label>
                            <input 
                                aria-label="Fecha y hora de salida"
                                type="datetime-local" 
                                className="input px-3 py-2 w-full"
                                value={editData.departure ? new Date(editData.departure).toISOString().slice(0, 16) : ''}
                                onChange={e => setEditData({ ...editData, departure: e.target.value })} 
                            />
                        </div>
                        <div className="flex-1 min-w-32">
                            <label className="label">Llegada</label>
                            <input 
                                aria-label="Fecha y hora de llegada"
                                type="datetime-local" 
                                className="input px-3 py-2 w-full"
                                value={editData.arrival ? new Date(editData.arrival).toISOString().slice(0, 16) : ''}
                                onChange={e => setEditData({ ...editData, arrival: e.target.value })} 
                            />
                        </div>
                        <div className="min-w-24">
                            <label className="label">Precio (€)</label>
                            <input 
                                aria-label="Precio en euros"
                                type="number" 
                                className="input px-3 py-2 w-full" 
                                value={editData.price || ''}
                                onChange={e => setEditData({ ...editData, price: parseFloat(e.target.value) })} 
                            />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button 
                            aria-label='Guardar'
                            onClick={handleSave} 
                            className="btn text-xs py-1.5 px-4"
                        >
                            Guardar
                        </button>
                        <button 
                            aria-label='Cancelar'
                            onClick={() => setEditing(false)} 
                            className="text-xs text-text-secondary hover:text-text px-3 py-1.5"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex">
                    <div className="flex-1 px-4 py-3 flex items-center gap-4">
                        
                        <div className="w-12 shrink-0 flex items-center justify-center">
                            {logoError ? (
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="#2563EB">
                                    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                                </svg>
                            ) : (
                                <img src={`https://www.gstatic.com/flights/airline_logos/70px/${flight.airline}.png`}
                                    alt={flight.airlineName || flight.airline}
                                    className="w-14 h-14 object-contain"
                                    onError={() => setLogoError(true)} />
                            )}
                        </div>

                        <div className="flex-1 flex items-center justify-center gap-4">
                            <div className="text-center">
                                <p className="text-2xl font-normal text-text">
                                    {depTime}
                                </p>
                                <p className="text-xs text-text-secondary font-medium mt-0.5">
                                    {originCode}
                                </p>
                            </div>
                            <div className="w-36 flex flex-col items-center gap-1">
                                <p className="text-xs text-text-soft">
                                    {duration}
                                </p>
                                <div className="flex items-center gap-1 w-full">
                                    <div className="h-px flex-1 bg-border"/>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9A9A9A" strokeWidth="2">
                                        <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </div>
                                <p className={`text-xs font-normal ${flight.stops === 0 ? 'text-primary' : 'text-text-secondary'}`}>
                                    {stopsLabel}
                                </p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-normal text-text">
                                    {arrTime}
                                </p>
                                <p className="text-xs text-text-secondary font-medium mt-0.5">
                                    {destCode}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="border-l border-border px-4 py-3 flex flex-col items-center justify-center gap-2 shrink-0 w-36">
                        <p className="text-xl font-bold text-text">
                            {flight.price?.amount ?? flight.price ?? '—'}€
                        </p>
                        {mode === 'explore' ? (
                            <>
                                {bookingLink && (
                                    <a 
                                        aria-label='Ver vuelo en sitio de reservas'
                                        href={bookingLink} target="_blank" rel="noopener noreferrer"
                                        className="btn text-sm px-4 py-2 w-full text-center">
                                        Ver vuelo →
                                    </a>
                                )}
                                <button 
                                    aria-label='Añadir al viaje'
                                    onClick={onAddToTrip} 
                                    className="btn-login text-sm px-4 py-2 w-full"
                                >
                                    {addLabel}
                                </button>
                            </>
                        ) : (
                            <div className="flex gap-2">
                                <button 
                                    aria-label='Editar vuelo'
                                    onClick={() => { setEditing(true); setEditData(flight); }}
                                    className="w-7 h-7 bg-primary-light hover:bg-border rounded-lg flex items-center justify-center transition text-primary"
                                >
                                    <EditIcon />
                                </button>
                                <button 
                                    aria-label='Eliminar vuelo'
                                    onClick={() => onDelete(flight.id)}
                                    className="w-7 h-7 bg-primary-light hover:bg-red-100 rounded-lg flex items-center justify-center transition text-red-400 hover:text-red-600"
                                >
                                    <DeleteIcon />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};