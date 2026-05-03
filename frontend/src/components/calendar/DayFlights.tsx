interface Props {
    flights: any[];
}

export const DayFlights = ({ flights }: Props) => {
    if (flights.length === 0) return null;
    return (
        <div className="card-lg rounded-2xl p-4">
            <p className="text-xs font-semibold text-text-soft mb-3 uppercase tracking-wide flex items-center gap-2">
                <span className="w-5 h-5 bg-primary-light rounded-lg flex items-center justify-center">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2">
                        <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 00-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                    </svg>
                </span>
                Vuelos
            </p>
            {flights.map(flight => (
                <div key={flight.id} className="flex items-center gap-4 py-2 border-b border-border last:border-0">
                    <img src={`https://www.gstatic.com/flights/airline_logos/70px/${flight.airline}.png`}
                        alt={flight.airline} className="w-8 h-8 object-contain"
                        onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    <div className="flex-1">
                        <p className="text-sm font-semibold text-text">{flight.originCity} → {flight.destCity}</p>
                        <p className="text-xs text-text-soft">
                            {new Date(flight.departure).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })} →{' '}
                            {new Date(flight.arrival).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                            {' · '}{flight.stops === 0 ? 'Directo' : `${flight.stops} escala`}
                        </p>
                    </div>
                    <p className="font-semibold text-text">{flight.price}€</p>
                </div>
            ))}
        </div>
    );
};