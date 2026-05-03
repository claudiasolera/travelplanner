import { categoryConfig } from './BudgetIcons';

interface Transaction {
    id: string;
    name: string;
    category: string;
    amount: number;
    date: string;
    fixed: boolean;
}

interface Props {
    transactions: Transaction[];
    onDelete: (id: string) => void;
}

export const TransactionList = ({ transactions, onDelete }: Props) => (
    <div className="card-lg rounded-2xl overflow-hidden">
        <div className="px-5 py-3 border-b border-border flex justify-between items-center">
            <p className="font-semibold text-text text-sm">Transacciones</p>
            <p className="text-xs text-text-soft">{transactions.length} registros</p>
        </div>
        {transactions.length === 0 ? (
            <div className="px-5 py-8 text-center">
                <p className="text-sm text-text-soft">No hay gastos registrados todavía</p>
            </div>
        ) : (
            <div className="divide-y divide-border">
                {transactions.map(t => {
                    const config = categoryConfig[t.category] || categoryConfig['Otros'];
                    return (
                        <div key={t.id} className="px-5 py-3 flex items-center gap-3 group hover:bg-primary-lighter transition">
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                                style={{ backgroundColor: `${config.color}12`, color: config.color }}>
                                {config.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-text truncate">{t.name}</p>
                                <p className="text-xs text-text-soft">
                                    {t.category}
                                    {t.date ? ` · ${new Date(t.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}` : ''}
                                </p>
                            </div>
                            <p className="text-sm font-semibold text-text shrink-0">
                                {t.amount ? `${t.amount.toFixed(2)}€` : 'Consultar'}
                            </p>
                            {!t.fixed && (
                                <button 
                                    aria-label="Eliminar gasto" 
                                    onClick={() => onDelete(t.id)}
                                    className="text-text-soft hover:text-red-400 transition opacity-0 group-hover:opacity-100 shrink-0"
                                >
                                    <svg 
                                        width="14" 
                                        height="14" 
                                        viewBox="0 0 24 24" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        strokeWidth="2"
                                    >
                                        <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" strokeLinecap="round" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
        )}
    </div>
);