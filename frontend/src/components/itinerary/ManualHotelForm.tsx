import { useState } from 'react';
import { HotelIcon } from './icons';

interface Props {
    onSave: (hotel: any) => void;
    onClose: () => void;
    defaultCheckIn?: string;
    defaultCheckOut?: string;
}

export const ManualHotelForm = ({ onSave, onClose, defaultCheckIn = '', defaultCheckOut = '' }: Props) => {
    const [hotel, setHotel] = useState({
        hotelId: crypto.randomUUID(),
        name: '',
        address: '',
        checkIn: defaultCheckIn,
        checkOut: defaultCheckOut,
        price: '',
        currency: 'EUR'
    });

    const handleSubmit = () => {
        if (!hotel.name || !hotel.checkIn || !hotel.checkOut) return;
        onSave({ ...hotel, price: parseFloat(hotel.price) || null });
        setHotel({
            hotelId: crypto.randomUUID(),
            name: '', address: '',
            checkIn: defaultCheckIn,
            checkOut: defaultCheckOut,
            price: '', currency: 'EUR'
        });
    };

    return (
        <div className="card-lg rounded-2xl p-5 space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="font-semibold text-primary text-sm flex items-center gap-2">
                    <HotelIcon size={15} /> Añadir hotel manualmente
                </h3>
                <button 
                    aria-label="Cerrar"
                    onClick={onClose} 
                    className="text-xs text-text-secondary hover:text-text"
                >
                    ✕ Cerrar
                </button>
            </div>

            <div className="flex flex-wrap gap-3">
                <div className="flex-1 min-w-40">
                    <label className="label">Nombre del hotel</label>
                    <input 
                        aria-label="Nombre del hotel"
                        className="input px-3 py-2 w-full" 
                        placeholder="Ej: Hotel Arts Barcelona"
                        value={hotel.name}
                        onChange={e => setHotel({ ...hotel, name: e.target.value })} 
                    />
                </div>
                <div className="flex-1 min-w-36">
                    <label className="label">Dirección</label>
                    <input 
                        aria-label="Dirección del hotel"
                        className="input px-3 py-2 w-full" 
                        placeholder="Ej: Calle Marina 19"
                        value={hotel.address}
                        onChange={e => setHotel({ ...hotel, address: e.target.value })} 
                    />
                </div>
                <div className="min-w-32">
                    <label className="label">Check-in</label>
                    <input 
                        aria-label="Fecha de check-in del hotel"
                        type="date" 
                        className="input px-3 py-2 w-full" 
                        value={hotel.checkIn}
                        onChange={e => setHotel({ ...hotel, checkIn: e.target.value })} 
                    />
                </div>
                <div className="min-w-32">
                    <label className="label">Check-out</label>
                    <input 
                        aria-label="Fecha de check-out del hotel"
                        type="date" 
                        className="input px-3 py-2 w-full" 
                        value={hotel.checkOut}
                        onChange={e => setHotel({ ...hotel, checkOut: e.target.value })} 
                    />
                </div>
                <div className="min-w-24">
                    <label className="label">Precio (€)</label>
                    <input 
                        aria-label="Precio del hotel en euros"
                        type="number" 
                        className="input px-3 py-2 w-full" 
                        placeholder="0"
                        value={hotel.price}
                        onChange={e => setHotel({ ...hotel, price: e.target.value })} 
                    />
                </div>
            </div>

            <button 
                aria-label="Guardar hotel"
                onClick={handleSubmit} 
                className="btn text-sm py-2 px-5"
            >
                Guardar hotel
            </button>
        </div>
    );
};