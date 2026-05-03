interface Props {
    hotels: any[];
    currentDate: string;
}

export const DayHotels = ({ hotels, currentDate }: Props) => {
    if (hotels.length === 0) return null;
    return (
        <div className="card-lg rounded-2xl p-4">
            <p className="text-xs font-semibold text-text-soft mb-3 uppercase tracking-wide flex items-center gap-2">
                <span className="w-5 h-5 bg-primary-light rounded-lg flex items-center justify-center">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2">
                        <path d="M3 22V8l9-6 9 6v14" /><rect x="9" y="14" width="6" height="8" />
                    </svg>
                </span>
                Alojamiento
            </p>
            {hotels.map(hotel => (
                <div key={hotel.id} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                    <div className="w-8 h-8 bg-primary-light rounded-xl flex items-center justify-center shrink-0">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2">
                            <path d="M3 22V8l9-6 9 6v14" /><rect x="9" y="14" width="6" height="8" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-text">{hotel.name}</p>
                        <p className="text-xs text-text-soft">
                            {new Date(hotel.checkIn).toDateString() === new Date(currentDate).toDateString() ? 'Check-in hoy' : 'Check-out hoy'}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};