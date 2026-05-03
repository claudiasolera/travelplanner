import { useState } from 'react';
import { tipCategoryColors } from '../../types/reviews';

interface Props {
    saving: boolean;
    onSave: (data: { category: string; content: string }) => void;
    onClose: () => void;
}

export const TipForm = ({ saving, onSave, onClose }: Props) => {
    const [form, setForm] = useState({ category: 'cultura', content: '' });

    return (
        <div className="card rounded-3xl p-5 space-y-4">
            <h3 className="font-semibold text-text">Nuevo consejo</h3>
            <div className="grid grid-cols-3 gap-2">
                {Object.keys(tipCategoryColors).map(key => (
                    <button 
                        key={key} 
                        type="button" 
                        aria-label={`Categoría ${key}`}
                        onClick={() => setForm({ ...form, category: key })}
                        className={`py-2 rounded-xl text-xs font-medium border transition flex items-center justify-center gap-1 ${
                            form.category === key 
                            ? 'bg-primary text-white border-primary' 
                            : 'border-border text-text-secondary hover:bg-primary-light'
                        }`}
                    >
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                    </button>
                ))}
            </div>
            <textarea 
                className="w-full input px-3 py-2.5 resize-none" 
                placeholder="Escribe tu consejo..." 
                rows={4}
                value={form.content} 
                onChange={e => setForm({ ...form, content: e.target.value })} 
            />
            <div className="flex gap-3">
                <button 
                    aria-label="Cancelar" 
                    onClick={onClose}
                    className="flex-1 px-4 py-2.5 rounded-full border border-border text-text-secondary text-sm hover:bg-bg-section transition"
                >
                    Cancelar
                </button>
                <button 
                    aria-label="Guardar consejo" 
                    onClick={() => form.content.trim() && onSave(form)} 
                    disabled={saving}
                    className="flex-1 btn justify-center disabled:opacity-50"
                >
                    {saving ? 'Guardando...' : 'Guardar consejo'}
                </button>
            </div>
        </div>
    );
};