interface Props {
    spent: number;
    budget: number;
}

export const DonutChart = ({ spent, budget }: Props) => {
    const pct = budget > 0 ? Math.min(spent / budget, 1) : 0;
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference * (1 - pct);
    const color = pct > 0.9 ? '#ef4444' : pct > 0.7 ? '#f59e0b' : '#3b82f6';

    return (
        <div className="relative w-48 h-48 mx-auto">
            <svg viewBox="0 0 180 180" className="w-full h-full -rotate-90">
                <circle 
                    cx="90" 
                    cy="90" 
                    r={radius} 
                    fill="none" 
                    stroke="#e5e7eb" 
                    strokeWidth="14" 
                />
                <circle 
                    cx="90" 
                    cy="90" 
                    r={radius} 
                    fill="none" 
                    stroke={color} 
                    strokeWidth="14"
                    strokeDasharray={circumference} 
                    strokeDashoffset={offset}
                    strokeLinecap="round" 
                    className="transition-all duration-1000" 
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-2xl font-bold text-text">{spent.toFixed(0)}€</p>
                <p className="text-xs text-text-soft">de {budget}€</p>
            </div>
        </div>
    );
};