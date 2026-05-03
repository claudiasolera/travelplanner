import { useState } from 'react';
import { EditIcon, DeleteIcon, StarIcon } from './icons';

interface Props {
    hotel: any;
    onDelete: (id: string) => void;
    onUpdate: (id: string, data: any) => void;
    mode?: 'itinerary' | 'explore';
    onAddToTrip?: () => void;
    checkIn?: string;
    checkOut?: string;
    adults?: number;
    rooms?: number;
    addLabel?: string;
}

export const HotelCard = ({ hotel, onDelete, onUpdate, mode = 'itinerary', onAddToTrip, checkIn, checkOut, adults, rooms, addLabel = '+ Viaje' }: Props) => {
    const [editing, setEditing] = useState(false);
    const [editData, setEditData] = useState<any>(hotel);

    const handleSave = () => {
        onUpdate(hotel.id, editData);
        setEditing(false);
    };

    const bookingUrl = `https://www.booking.com/searchresults.es.html?ss=${encodeURIComponent(hotel.name)}&checkin=${checkIn || hotel.checkIn?.split('T')[0]}&checkout=${checkOut || hotel.checkOut?.split('T')[0]}&group_adults=${adults || 1}&no_rooms=${rooms || 1}&latitude=${hotel.location?.lat}&longitude=${hotel.location?.lon}&lang=es`;

    return (
        <div className="card-lg rounded-2xl overflow-hidden">
            {editing ? (
                <div className="p-5 space-y-3">
                    <div className="flex flex-wrap gap-3">
                        {[
                            { label: 'Nombre', key: 'name' },
                            { label: 'Dirección', key: 'address' },
                        ].map(f => (
                            <div key={f.key} className="flex-1 min-w-44">
                                <label className="label">{f.label}</label>
                                <input 
                                    aria-label={f.label}
                                    className="input px-3 py-2" 
                                    value={editData[f.key] || ''}
                                    onChange={e => setEditData({ ...editData, [f.key]: e.target.value })} 
                                />
                            </div>
                        ))}
                        <div className="flex-1 min-w-32">
                            <label className="label">Check-in</label>
                            <input 
                                aria-label="Fecha de check-in"
                                type="date" 
                                className="input px-3 py-2"
                                value={editData.checkIn ? new Date(editData.checkIn).toISOString().split('T')[0] : ''}
                                onChange={e => setEditData({ ...editData, checkIn: e.target.value })} />
                        </div>
                        <div className="flex-1 min-w-32">
                            <label className="label">Check-out</label>
                            <input 
                                aria-label="Fecha de check-out"
                                type="date" 
                                className="input px-3 py-2"
                                value={editData.checkOut ? new Date(editData.checkOut).toISOString().split('T')[0] : ''}
                                onChange={e => setEditData({ ...editData, checkOut: e.target.value })} 
                            />
                        </div>
                        <div className="min-w-24">
                            <label className="label">Precio (€)</label>
                            <input 
                                aria-label="Precio del hotel"
                                type="number" 
                                className="input px-3 py-2" 
                                value={editData.price || ''}
                                onChange={e => setEditData({ ...editData, price: parseFloat(e.target.value) })} 
                            />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button 
                            aria-label="Guardar"
                            onClick={handleSave} 
                            className="btn text-xs py-1.5 px-4"
                        >
                            Guardar
                        </button>
                        <button 
                            aria-label="Cancelar"
                            onClick={() => setEditing(false)}
                            className="text-xs text-text-secondary hover:text-text px-3 py-1.5"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    {(hotel.photos?.[0] || hotel.photo) && (
                        <img src={hotel.photos?.[0] || hotel.photo} alt={hotel.name}
                            className="w-full h-60 object-cover"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    )}

                    <div className="p-4 flex flex-col grow">
                        <p className="font-semibold text-text text-sm">
                            {hotel.name}
                        </p>
                        {hotel.rating > 0 && (
                            <div className="flex items-center gap-0.5 mt-0.5">
                                {Array.from({ length: Math.min(hotel.rating, 5) }).map((_, i) => (
                                    <span key={i} className="text-primary"><StarIcon size={11} color="#f59e0b" /></span>
                                ))}
                                {hotel.reviewScore && (
                                    <span className="text-xs text-text-secondary ml-1">· {hotel.reviewScore}/10</span>
                                )}
                            </div>
                        )}
                        <p className="text-xs text-text-soft mt-1 mb-3 flex items-center gap-1">
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-primary">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                                <circle cx="12" cy="10" r="3"/>
                            </svg>
                            {hotel.address?.fullAddress || hotel.address}
                        </p>

                        {mode === 'explore' ? (
                            <div className="mt-auto pt-3 border-t border-border">
                                <div className="mb-3">
                                    <p className="font-bold text-text text-sm">
                                        {hotel.price?.amount
                                            ? `${hotel.price.amount} ${hotel.price.currency ?? '€'}`
                                            : hotel.price && typeof hotel.price === 'number'
                                            ? `${hotel.price}€`
                                            : 'Consultar'}
                                    </p>
                                    <p className="text-xs text-text-soft">precio orientativo</p>
                                </div>
                                <div className="flex gap-2">
                                    <a 
                                        aria-label='Ver hotel en sitio de reservas'
                                        href={bookingUrl} target="_blank" rel="noopener noreferrer"
                                        className="btn text-sm px-4 py-2 flex-1 text-center">
                                        Reservar →
                                    </a>
                                    <button 
                                        aria-label='Añadir al viaje'
                                        onClick={onAddToTrip} 
                                        className="btn-login text-sm px-4 py-2 flex-1"
                                    >
                                        {addLabel}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between">
                                <p className="font-bold text-text text-sm">
                                    {hotel.price ? `${hotel.price}€` : 'Consultar'}
                                </p>
                                <div className="flex items-center gap-2">
                                    <button 
                                        aria-label="Editar"
                                        onClick={() => { setEditing(true); setEditData(hotel); }}
                                        className="w-7 h-7 bg-primary-light hover:bg-border rounded-lg flex items-center justify-center transition text-primary"
                                    >
                                        <EditIcon />
                                    </button>
                                    <button 
                                        aria-label="Eliminar"
                                        onClick={() => onDelete(hotel.id)}
                                        className="w-7 h-7 bg-primary-light hover:bg-red-100 rounded-lg flex items-center justify-center transition text-red-400 hover:text-red-600"
                                    >
                                        <DeleteIcon />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};