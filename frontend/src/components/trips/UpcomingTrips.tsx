import { Link } from 'react-router-dom';
import { FlightIcon } from '../itinerary/icons';
import { ITrip } from '../../types/ITrip';

interface Props {
    trips: ITrip[];
    compact?: boolean;
}

export const UpcomingTrips = ({ trips, compact = false }: Props) => {
    if (trips.length === 0) return null;

    if (compact) {
        return (
            <div className="card-lg rounded-2xl p-4 space-y-2">
                <p className="text-xs font-semibold text-text-secondary">Próximos viajes</p>
                {trips.map(trip => (
                    <Link 
                        to={`/trip/${trip.id || trip.idTrip}`} 
                        key={trip.id || trip.idTrip}
                        className="flex items-center gap-2 px-2 py-1.5 hover:bg-primary-light rounded-xl transition"
                    >
                        <FlightIcon size={14} />
                        <div>
                            <p className="text-xs font-medium text-text">
                                {trip.destination}
                            </p>
                            <p className="text-[10px] text-text-secondary">
                                {trip.startDate ? new Date(trip.startDate).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }) : '—'}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        );
    }

    return (
        <div className="card-lg bg-card rounded-3xl p-5 space-y-3">
            <p className="font-semibold text-text">Próximos viajes</p>
            {trips.map(trip => (
                <Link 
                    to={`/trip/${trip.id || trip.idTrip}`} 
                    key={trip.id || trip.idTrip}
                    className="flex gap-3 items-center p-1.5 hover:bg-primary-light rounded-2xl transition"
                >
                    <FlightIcon size={20} />
                    <div>
                        <p className="text-sm font-medium text-text">{trip.destination}</p>
                        <p className="text-xs text-text-secondary">
                            {trip.startDate ? new Date(trip.startDate).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }) : '—'}
                        </p>
                    </div>
                </Link>
            ))}
        </div>
    );
};