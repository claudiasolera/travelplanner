import { Link } from 'react-router-dom';

interface Props {
    trip: any;
    mode: 'own' | 'saved';
}

export const TripListItem = ({ trip, mode }: Props) => (
    <div className="card-lg rounded-2xl p-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 bg-primary-light rounded-xl flex items-center justify-center shrink-0">
                {mode === 'own' ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                        <circle cx="12" cy="9" r="2.5"/>
                    </svg>
                ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
                    </svg>
                )}
            </div>
            <div className="min-w-0">
                <p className="font-semibold text-text text-sm truncate">{trip.destination}</p>
                <p className="text-xs text-text-secondary truncate">
                    {mode === 'own'
                        ? new Date(trip.startDate).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
                        : `por ${trip.user?.name || 'Viajero'}`
                    }
                </p>
            </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
            {mode === 'own' && (
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium whitespace-nowrap ${trip.isPublic ? 'bg-secondary-light text-secondary-dark' : 'bg-primary-light text-text-secondary'}`}>
                    {trip.isPublic ? 'Público' : 'Privado'}
                </span>
            )}
            <Link
                to={mode === 'own' ? `/trip/${trip.id}` : `/community/trip/${trip.id}`}
                className="btn text-xs py-1.5 px-3 whitespace-nowrap">
                Ver →
            </Link>
        </div>
    </div>
);