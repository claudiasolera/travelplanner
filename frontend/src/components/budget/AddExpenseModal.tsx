interface Props {
    expense: { category: string; name: string; amount: string; date: string };
    saving: boolean;
    categories: string[];
    onChange: (data: any) => void;
    onSave: () => void;
    onClose: () => void;
}

export const AddExpenseModal = ({ expense, saving, categories, onChange, onSave, onClose }: Props) => (
    <div className="modal-backdrop" onClick={onClose}>
        <div 
            className="modal rounded-3xl p-6 w-full max-w-md mx-4" 
            onClick={e => e.stopPropagation()}>
            <h3 className="font-semibold text-text mb-5">Añadir gasto</h3>
            <div className="space-y-3">
                <div>
                    <label className="label">Descripción</label>
                    <input 
                        aria-label="Descripción del gasto" 
                        className="input px-4 py-2.5 w-full" 
                        placeholder="Ej: Cena en restaurante"
                        value={expense.name} 
                        onChange={e => onChange({ ...expense, name: e.target.value })} 
                    />
                </div>
                <div className="flex gap-3">
                    <div className="flex-1 min-w-0">
                        <label className="label">Categoría</label>
                        <select 
                            aria-label="Categoría del gasto" 
                            className="input px-4 py-2.5 w-full"
                            value={expense.category} 
                            onChange={e => onChange({ ...expense, category: e.target.value })}
                        >
                            {categories.map(c => <option key={c}>{c}</option>)}
                        </select>
                    </div>
                    <div className="flex-1 min-w-0">
                        <label className="label">Importe (€)</label>
                        <input 
                            aria-label="Importe del gasto" 
                            type="number" 
                            className="input px-4 py-2.5 w-full" 
                            placeholder="0.00"
                            value={expense.amount} 
                            onChange={e => onChange({ ...expense, amount: e.target.value })} 
                        />
                    </div>
                </div>
                <div>
                    <label className="label">Fecha</label>
                    <input 
                        aria-label="Fecha del gasto" 
                        type="date" 
                        className="input px-4 py-2.5 w-full"
                        value={expense.date} 
                        onChange={e => onChange({ ...expense, date: e.target.value })} 
                    />
                </div>
            </div>
            <div className="flex gap-2 mt-5">
                <button 
                    aria-label="Guardar gasto" 
                    onClick={onSave} disabled={saving}
                    className="flex-1 btn py-2.5 text-sm disabled:opacity-50"
                >
                    {saving ? 'Guardando...' : 'Guardar'}
                </button>
                <button 
                    aria-label="Cancelar" 
                    onClick={onClose}
                    className="flex-1 border border-border text-text-secondary py-2.5 rounded-full text-sm transition hover:bg-bg-section"
                >
                    Cancelar
                </button>
            </div>
        </div>
    </div>
);