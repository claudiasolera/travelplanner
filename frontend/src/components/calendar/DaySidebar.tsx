import { DayData } from '../../types/calendar';

interface Props {
    days: DayData[];
    selectedDay: number;
    onSelect: (index: number) => void;
}

export const DaySidebar = ({ days, selectedDay, onSelect }: Props) => (
    <div className="w-44 shrink-0 space-y-1">
        <p className="text-xs font-semibold text-text-soft mb-3 uppercase tracking-wide">Días del viaje</p>
        {days.map((day, index) => (
            <button
                aria-label={`Seleccionar día ${day.day}`}
                key={day.id}
                onClick={() => onSelect(index)}
                className={`w-full text-left px-3 py-2.5 rounded-2xl transition ${
                    selectedDay === index
                        ? 'bg-primary-light border border-primary/30 text-primary'
                        : 'text-text-secondary hover:bg-card border border-transparent'
                }`}
            >
                <p className="text-sm font-semibold">Día {day.day}</p>
                <p className="text-xs text-text-soft">
                    {new Date(day.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                </p>
                {day.activities?.length > 0 && (
                    <p className="text-xs text-primary mt-0.5">
                        {day.activities.length} actividad{day.activities.length > 1 ? 'es' : ''}
                    </p>
                )}
            </button>
        ))}
    </div>
);