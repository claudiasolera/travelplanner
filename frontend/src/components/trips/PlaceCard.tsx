import React, { useState } from 'react';
import { ActivityIcon, ForkKnifeIcon, BuildingIcon, CarIcon, ShoppingBagIcon, MapPinIcon, StarIcon } from '../itinerary/icons';

export const placeTypeConfig: Record<string, { label: string; Icon: React.ComponentType<{ size?: number }>; bg: string; text: string }> = {
    Actividad:   { label: 'Actividad',   Icon: ActivityIcon,    bg: 'bg-green-50',  text: 'text-green-600'  },
    Restaurante: { label: 'Restaurante', Icon: ForkKnifeIcon,   bg: 'bg-orange-50', text: 'text-orange-500' },
    Alojamiento: { label: 'Alojamiento', Icon: BuildingIcon,    bg: 'bg-blue-50',   text: 'text-blue-500'   },
    Transporte:  { label: 'Transporte',  Icon: CarIcon,         bg: 'bg-gray-50',   text: 'text-gray-500'   },
    Compras:     { label: 'Compras',     Icon: ShoppingBagIcon, bg: 'bg-pink-50',   text: 'text-pink-500'   },
    Otro:        { label: 'Otro',        Icon: MapPinIcon,      bg: 'bg-gray-50',   text: 'text-gray-400'   },
};

const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map(s => (
            <StarIcon key={s} size={12} color={s <= rating ? '#f59e0b' : '#e5e7eb'} />
        ))}
    </div>
);

export const PlaceCard = ({ place, onDelete }: { place: any; onDelete?: () => void }) => {
    const [photoIdx, setPhotoIdx] = useState(0);
    const photos: string[] = place.photos?.length > 0 ? place.photos : (place.photo ? [place.photo] : []);
    const typeConf = placeTypeConfig[place.type] ?? { label: place.type || 'Otro', Icon: MapPinIcon, bg: 'bg-gray-50', text: 'text-gray-400' };

    return (
        <div className="relative card rounded-2xl overflow-hidden flex flex-col">
            {photos.length > 0 ? (
                <div className="relative">
                    <img src={photos[photoIdx]} alt={place.name} className="w-full h-44 object-cover" />
                    {photos.length > 1 && (
                        <>
                            <button
                                aria-label='Foto anterior'
                                onClick={() => setPhotoIdx(i => (i - 1 + photos.length) % photos.length)}
                                className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center transition"
                            >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M15 18l-6-6 6-6" />
                                </svg>
                            </button>
                            <button
                                aria-label='Foto siguiente'
                                onClick={() => setPhotoIdx(i => (i + 1) % photos.length)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center transition"
                            >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9 18l6-6-6-6" />
                                </svg>
                            </button>
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                                {photos.map((_: string, i: number) => (
                                    <div key={i} className={`w-1.5 h-1.5 rounded-full transition ${i === photoIdx ? 'bg-white' : 'bg-white/50'}`} />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            ) : (
                <div className={`w-full h-44 ${typeConf.bg} flex items-center justify-center`}>
                    <span className={typeConf.text}><typeConf.Icon size={32} /></span>
                </div>
            )}

            <div className="p-4 flex flex-col flex-1">
                <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="font-semibold text-text text-sm leading-snug">{place.name}</p>
                    <div className="flex items-center gap-1.5 shrink-0">
                        <span className={`flex items-center gap-1 text-xs ${typeConf.bg} ${typeConf.text} px-2 py-0.5 rounded-full font-medium whitespace-nowrap`}>
                            <typeConf.Icon size={11} /> {typeConf.label}
                        </span>
                        {onDelete && (
                            <button 
                                aria-label="Eliminar lugar"
                                onClick={onDelete} 
                                className="text-text-soft hover:text-red-400 transition p-0.5"
                            >
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="3 6 5 6 21 6"/>
                                    <path d="M19 6l-1 14H6L5 6"/>
                                    <path d="M10 11v6M14 11v6"/>
                                    <path d="M9 6V4h6v2"/>
                                </svg>
                            </button>
                        )}
                    </div>
                </div>
                {place.address && <p className="text-xs text-text-soft mb-2">{place.address}</p>}
                {place.rating && <StarRating rating={place.rating} />}
                {place.dish && (
                    <p className="text-xs text-text-secondary mt-2">
                        Recomendado: <span className="font-medium text-text">{place.dish}</span>
                    </p>
                )}
                {place.review && (
                    <p className="text-xs text-text-secondary mt-2 leading-relaxed">"{place.review}"</p>
                )}
            </div>
        </div>
    );
};
