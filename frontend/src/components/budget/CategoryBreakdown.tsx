import { categoryConfig } from './BudgetIcons';

interface CategoryData {
    category: string;
    total: number;
}

interface Props {
    categories: CategoryData[];
    totalSpent: number;
}

const CategoryBar = ({ categories, total }: { categories: CategoryData[]; total: number }) => {
    if (total === 0) return null;
    return (
        <div className="w-full h-4 rounded-full overflow-hidden flex">
            {categories.map(c => (
                <div key={c.category} title={`${c.category}: ${c.total.toFixed(0)}€`}
                    className="h-full transition-all duration-500"
                    style={{
                        width: `${(c.total / total) * 100}%`,
                        backgroundColor: categoryConfig[c.category]?.color || '#94a3b8'
                    }} />
            ))}
        </div>
    );
};

export const CategoryBreakdown = ({ categories, totalSpent }: Props) => (
    <div className="card-lg rounded-2xl p-5 md:col-span-2 space-y-4">
        <p className="font-semibold text-text text-sm">Distribución por categoría</p>
        <CategoryBar categories={categories} total={totalSpent} />
        <div className="grid grid-cols-2 gap-3">
            {categories.map(({ category, total }) => {
                const config = categoryConfig[category] || categoryConfig['Otros'];
                return (
                    <div key={category} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                            style={{ backgroundColor: `${config.color}15`, color: config.color }}>
                            {config.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline">
                                <p className="text-xs font-medium text-text">{category}</p>
                                <p className="text-xs font-bold text-text">{total.toFixed(0)}€</p>
                            </div>
                            <div className="w-full h-1.5 bg-border rounded-full mt-1 overflow-hidden">
                                <div className="h-full rounded-full transition-all duration-500"
                                    style={{ width: `${totalSpent > 0 ? (total / totalSpent) * 100 : 0}%`, backgroundColor: config.color }} />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
        {categories.length === 0 && (
            <p className="text-xs text-text-soft text-center py-4">No hay gastos registrados aún</p>
        )}
    </div>
);