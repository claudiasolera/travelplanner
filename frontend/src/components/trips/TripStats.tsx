import { icons } from '../../lib/cloudinary';

interface Props {
    total: number;
    countries: number;
    upcoming: number;
    compact?: boolean;
}

export const TripStats = ({ total, countries, upcoming, compact = false }: Props) => {
    const items = [
        { icon: icons.suitcase, label: compact ? 'Total' : 'Total', value: total },
        { icon: icons.plane, label: compact ? 'Países' : 'Países visitados', value: countries },
        { icon: icons.calendar, label: compact ? 'Próximos' : 'Próximos viajes', value: upcoming },
    ];

    if (compact) {
        return (
            <div className="card-lg rounded-2xl p-4 flex items-center gap-5">
                {items.map(item => (
                    <div key={item.label} className="flex items-center gap-2">
                        <img src={item.icon} alt="" className="w-6 h-6 object-contain" />
                        <div>
                            <p className="text-[10px] text-text-secondary leading-none">{item.label}</p>
                            <p className="text-lg font-semibold text-text leading-none mt-0.5">{item.value}</p>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="card-lg rounded-2xl p-5 space-y-4">
            <p className="font-semibold text-text">Resumen de viajes</p>
            {items.map(item => (
                <div key={item.label} className="flex items-center gap-3">
                    <img src={item.icon} alt="" className="w-8 h-8 object-contain" />
                    <div>
                        <p className="text-xs text-text-secondary">{item.label}</p>
                        <p className="text-2xl font-semibold text-text leading-none">{item.value}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};