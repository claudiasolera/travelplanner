import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { styles } from '../../lib/cloudinary';

const TRAVEL_STYLE_ICONS: Record<string, string | null> = {
    'Aventura': styles.aventura,
    'Relax': styles.relax,
    'Cultura': styles.cultura,
    'Fiesta': styles.fiesta,
};

interface TripCommunityCardProps {
    trip: any;
    user: any;
    isLiked: boolean;
    isSaved: boolean;
    isFollowing: boolean;
    onLike: () => void;
    onSave: () => void;
    onFollow: () => void;
    getDaysCount: (start: string, end: string) => number;
}

export const TripCommunityCard = ({
    trip, user, isLiked, isSaved, isFollowing,
    onLike, onSave, onFollow, getDaysCount
}: TripCommunityCardProps) => {
    const navigate = useNavigate();

    const coverImage = trip.coverImage || trip.cover || null;

    return (
        <div className="card rounded-3xl flex flex-col transition-all duration-300 hover:scale-[1.02]">
            <div className="relative h-48 overflow-hidden rounded-t-3xl">
                {coverImage ? (
                    <img
                        src={coverImage}
                        alt={trip.destination}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full bg-primary-light flex flex-col items-center justify-center gap-2">
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                            <circle cx="12" cy="10" r="3"/>
                        </svg>
                        <p className="text-primary font-semibold text-sm">{trip.destination}</p>
                    </div>
                )}

                <div className="absolute inset-0"
                    style={{ background: coverImage ? 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)' : 'none' }}
                />

                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="#2563EB" stroke="none">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                    <span className="text-xs font-semibold text-text">{trip.destination}</span>
                </div>

                <div className="absolute top-3 left-3">
                    {TRAVEL_STYLE_ICONS[trip.travelStyle] ? (
                        <img src={TRAVEL_STYLE_ICONS[trip.travelStyle]!} alt={trip.travelStyle} className="w-9 h-9 object-contain" />
                    ) : (
                        <span className="text-xl">✈️</span>
                    )}
                </div>
            </div>

            <div className='relative'>

                <div className="absolute -top-6 left-4 z-10 flex items-end gap-2">
                    <div 
                        className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-white bg-primary flex items-center justify-center text-sm font-bold text-white shrink-0"
                        style={{ boxShadow: '2px 2px 8px rgba(0,0,0,0.2)' }}
                    >
                        {trip.user?.avatar
                            ? trip.user.avatar.startsWith('data:') || trip.user.avatar.startsWith('http')
                                ? <img src={trip.user.avatar} alt={trip.user.name} className="w-full h-full object-cover" />
                                : <span>{trip.user.avatar}</span>
                            : trip.user?.name?.charAt(0).toUpperCase() || '?'
                        }
                    </div>
                </div>

                <div className="pt-10 px-4 pb-4 flex flex-col gap-3">

                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs text-text-soft">Creado por</p>
                        <Link to={`/user/${trip.userId}`} className="text-sm font-semibold text-text hover:text-primary transition">
                            {trip.user?.name || 'Viajero'}
                        </Link>
                    </div>
                    <span className="text-xs text-text-soft">
                        {new Date(trip.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                    </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-text-secondary">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    <span>
                        {getDaysCount(trip.startDate, trip.endDate)} días ·{' '}
                        {new Date(trip.startDate).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })} →{' '}
                        {new Date(trip.endDate).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                    </span>
                </div>

                <div className="flex gap-4 text-sm text-text-secondary py-2 border-y border-border">
                    <span className="flex items-center gap-1">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="12" y1="1" x2="12" y2="23"/>
                            <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
                        </svg>
                        {trip.budget ? `${trip.budget}€` : '—'}
                    </span>
                    <span className="flex items-center gap-1">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill={isLiked ? 'red' : 'none'} stroke={isLiked ? 'red' : 'currentColor'} strokeWidth="2">
                            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                        </svg>
                        {trip.likes || 0}
                    </span>
                </div>

                <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                    <button
                        aria-label='Ver viaje'
                        onClick={() => navigate(`/community/trip/${trip.id}`)}
                        className="btn flex-1 text-xs py-2 justify-center"
                    >
                        Ver viaje
                    </button>
                    <button 
                        aria-label={isLiked ? 'Quitar me gusta' : 'Dar me gusta'}
                        onClick={onLike}
                        className="p-2 rounded-xl border transition"
                        style={{ borderColor: isLiked ? 'transparent' : '', background: 'transparent' }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24"
                            fill={isLiked ? 'red' : 'none'}
                            stroke={isLiked ? 'red' : 'black'}
                            strokeWidth="2">
                            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                        </svg>
                    </button>
                    <button 
                        aria-label={isSaved ? 'Quitar de guardados' : 'Guardar viaje'}
                        onClick={onSave}
                        className={`p-2 rounded-xl border transition ${isSaved ? 'bg-primary-light border-primary text-primary' : 'border-border text-text-soft hover:border-primary hover:text-primary'}`}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                            <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
                        </svg>
                    </button>
                    {trip.userId !== user?.id && (
                        <button 
                            aria-label={isFollowing ? 'Dejar de seguir' : 'Seguir viaje'}
                            onClick={onFollow}
                            className={`p-2 rounded-xl border transition ${isFollowing ? 'bg-primary-light border-primary text-primary' : 'border-border text-text-soft hover:border-primary hover:text-primary'}`}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/>
                                <circle cx="9" cy="7" r="4"/>
                                {isFollowing
                                    ? <path d="M17 11l2 2 4-4" strokeLinecap="round"/>
                                    : <><line x1="19" y1="8" x2="19" y2="14" strokeLinecap="round"/><line x1="16" y1="11" x2="22" y2="11" strokeLinecap="round"/></>
                                }
                            </svg>
                        </button>
                    )}
                </div>
            </div>
            </div>
        </div>
    );
};