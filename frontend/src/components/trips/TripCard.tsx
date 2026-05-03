import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { icons } from '../../lib/cloudinary';
import { ITrip } from '../../types/ITrip';
import { tripService } from '../../services/tripService';

interface TripCardProps {
    trip: ITrip;
}

export const TripCard = ({ trip }: TripCardProps) => {
    const [collaborators, setCollaborators] = useState<any[]>([]);

    useEffect(() => {
        const tripId = String(trip.id || trip.idTrip);
        if (tripId && tripId !== 'undefined') {
            tripService.getCollaborators(tripId)
                .then(r => setCollaborators(r.collaborators || []))
                .catch(() => {});
        }
    }, [trip.id, trip.idTrip]);

    return (
        <div className="card rounded-2xl overflow-hidden flex flex-col">
            <div className="relative h-55 overflow-hidden">
                {(trip as any).coverImage ? (
                    <img 
                        src={(trip as any).coverImage} 
                        alt={trip.destination} 
                        className="w-full h-full object-cover" 
                    />
                ) : (
                    <div className="w-full h-full bg-primary-light flex items-center justify-center">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#c9b0a0" strokeWidth="1.5">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                            <circle cx="12" cy="9" r="2.5"/>
                        </svg>
                    </div>
                )}
                <span className={`absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full font-medium inline-flex items-center gap-1 ${
                    trip.isPublic 
                        ? 'border border-green-400 bg-green-200 text-secondary-dark'
                        : 'border border-red-400 bg-red-200 text-text-secondary'
                    }`}>
                    <img 
                        src={trip.isPublic ? icons.earth : icons.padlock} 
                        width={14} 
                        height={14} 
                        alt={trip.isPublic ? 'público' : 'privado'} 
                    />
                    {trip.isPublic ? 'Público' : 'Privado'}
                </span>
            </div>

            <div className="p-4 flex flex-col grow gap-1">
                <h3 className="font-semibold text-text">{trip.destination}</h3>

                {trip.isCollaborator && trip.user?.name && (
                    <div className="flex items-center gap-1.5 mt-0.5 mb-0.5">
                        <div className="flex items-center gap-1 bg-primary-light px-2 py-0.5 rounded-full">
                            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-secondary">
                                <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" strokeLinecap="round"/>
                            </svg>
                            <span className="text-[10px] text-text-secondary font-medium">de {trip.user.name}</span>
                        </div>
                    </div>
                )}

                <div className="flex items-center gap-1 text-xs text-text-secondary">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                        <circle cx="12" cy="9" r="2.5"/>
                    </svg>
                    {trip.destination}
                </div>
                <div className="flex items-center gap-1 text-xs text-text-secondary">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    {trip.startDate ? new Date(trip.startDate).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                </div>

                {collaborators.length > 0 && (
                    <div className="flex items-center gap-1.5 mt-1">
                        <div className="flex -space-x-1.5">
                            {collaborators.slice(0, 3).map(c => (
                                <div key={c.id} title={c.name}
                                    className="w-6 h-6 rounded-full overflow-hidden shrink-0"
                                    style={{ border: '1.5px solid white' }}>
                                    {c.avatar?.startsWith('http') || c.avatar?.startsWith('data:') ? (
                                        <img 
                                            src={c.avatar} 
                                            alt={c.name} 
                                            className="w-full h-full object-cover" 
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-primary flex items-center justify-center text-white text-[10px] font-medium">
                                            {c.avatar || c.name?.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                            ))}
                            {collaborators.length > 3 && (
                                <div className="w-6 h-6 rounded-full bg-primary-light flex items-center justify-center text-[10px] text-text-secondary font-medium shrink-0"
                                    style={{ border: '1.5px solid white' }}>
                                    +{collaborators.length - 3}
                                </div>
                            )}
                        </div>
                        <span className="text-xs text-text-secondary">
                            {collaborators.length === 1 ? collaborators[0].name : `${collaborators.length} colaboradores`}
                        </span>
                    </div>
                )}

                <Link to={`/trip/${trip.id || trip.idTrip}`} className="mt-3 text-center text-sm btn py-2 px-4">
                    Ver itinerario →
                </Link>
            </div>
        </div>
    );
};