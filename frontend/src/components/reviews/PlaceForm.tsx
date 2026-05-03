import { useState } from 'react';
import { placeTypeConfig } from '../trips/PlaceCard';
import { StarPicker } from './StarPicker';
import { Activity } from '../../types/reviews';

const placeTypeOptions = Object.entries(placeTypeConfig).map(([value, cfg]) => ({ value, ...cfg }));

interface Props {
    activities: Activity[];
    saving: boolean;
    onSave: (data: any) => void;
    onClose: () => void;
}

export const PlaceForm = ({ activities, saving, onSave, onClose }: Props) => {
    const [useActivityName, setUseActivityName] = useState(false);
    const [form, setForm] = useState({ name: '', type: 'Actividad', rating: 0, review: '', address: '', dish: '', customName: '' });
    const [errors, setErrors] = useState<{ name?: string; rating?: string }>({});
    const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
    const [deselectedPhotos, setDeselectedPhotos] = useState<string[]>([]);
    const [extraPhotos, setExtraPhotos] = useState<File[]>([]);
    const [extraPreviews, setExtraPreviews] = useState<string[]>([]);

    const handleSubmit = () => {
        const name = useActivityName ? form.name : form.customName;
        const errs: { name?: string; rating?: string } = {};
        if (!name) errs.name = 'El nombre del lugar es obligatorio';
        if (!form.rating) errs.rating = 'La valoración es obligatoria';
        if (Object.keys(errs).length > 0) { setErrors(errs); return; }
        setErrors({});

        const photosToUse = selectedPhotos.filter(p => !deselectedPhotos.includes(p));
        onSave({ ...form, name, photosToUse, extraPhotos });
    };

    const addExtraPhoto = (file: File) => {
        setExtraPhotos(prev => [...prev, file]);
        setExtraPreviews(prev => [...prev, URL.createObjectURL(file)]);
    };

    const removeExtraPhoto = (i: number) => {
        setExtraPhotos(prev => prev.filter((_, idx) => idx !== i));
        setExtraPreviews(prev => prev.filter((_, idx) => idx !== i));
    };

    const PhotoUploadArea = () => (
        <div className="flex gap-2 flex-wrap">
            {extraPreviews.map((preview, i) => (
                <div key={i} className="relative w-24 h-20 rounded-xl overflow-hidden">
                    <img src={preview} alt="Foto adicional" className="w-full h-full object-cover" />
                    <button 
                        aria-label="Eliminar foto" 
                        onClick={() => removeExtraPhoto(i)}
                        className="absolute top-1 right-1 bg-black/50 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                    >
                        ✕
                    </button>
                </div>
            ))}
            {extraPreviews.length < 5 && (
                <label className="w-24 h-20 rounded-xl border border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:bg-bg-section transition gap-1">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    <span className="text-xs text-text-soft">Añadir</span>
                    <input 
                        aria-label="Añadir foto" 
                        type="file" 
                        accept="image/*" 
                        className="hidden"
                        onChange={e => { const f = e.target.files?.[0]; if (f) addExtraPhoto(f); e.target.value = ''; }} 
                    />
                </label>
            )}
        </div>
    );

    return (
        <div className="card rounded-3xl p-5 space-y-4">
            <h3 className="font-semibold text-text">Nuevo lugar</h3>

            <div className="space-y-2">
                <div className="flex gap-2">
                    <button 
                        aria-label="Usar nombre de actividad" 
                        onClick={() => setUseActivityName(true)}
                        className={`flex-1 py-2 rounded-xl text-xs font-medium border transition ${useActivityName 
                            ? 'bg-primary text-white border-primary' 
                            : 'border-border text-text-secondary hover:bg-primary-light'
                        }`}
                    >
                        Desde mis actividades
                    </button>
                    <button 
                        aria-label="Escribir nombre" 
                        onClick={() => setUseActivityName(false)}
                        className={`flex-1 py-2 rounded-xl text-xs font-medium border transition ${!useActivityName 
                            ? 'bg-primary text-white border-primary' 
                            : 'border-border text-text-secondary hover:bg-primary-light'
                        }`}
                    >
                        Escribir nombre
                    </button>
                </div>

                {useActivityName ? (
                    <div className="space-y-3">
                        <select 
                            aria-label="Seleccionar actividad" 
                            className="input px-3 py-2.5 w-full" 
                            value={form.name}
                            onChange={e => {
                                const name = e.target.value;
                                setForm({ ...form, name });
                                const act = activities.find(a => a.name === name);
                                setSelectedPhotos(act?.photos || []);
                            }}
                        >
                            <option value="">
                                Selecciona una actividad...
                            </option>
                            {activities.map(act => <option key={act.id} value={act.name}>{act.name}</option>)}
                        </select>

                        {selectedPhotos.length > 0 && (
                            <div>
                                <p className="label">Fotos de la actividad</p>
                                <div className="flex gap-2 flex-wrap">
                                    {selectedPhotos.map((photo, i) => {
                                        const isOn = !deselectedPhotos.includes(photo);
                                        return (
                                            <div key={i} className="relative w-24 h-20 rounded-xl overflow-hidden cursor-pointer"
                                                onClick={() => setDeselectedPhotos(prev => prev.includes(photo) ? prev.filter(p => p !== photo) : [...prev, photo])}>
                                                <img src={photo} alt="Foto de actividad" className="w-full h-full object-cover" />
                                                <div className={`absolute inset-0 flex items-center justify-center transition ${isOn ? 'bg-primary/20' : 'bg-black/50'}`}>
                                                    {isOn
                                                        ? <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M20 6L9 17l-5-5" strokeLinecap="round" /></svg>
                                                        </div>
                                                        : <div className="w-6 h-6 bg-white/30 rounded-full border-2 border-white" />
                                                    }
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                        <div><p className="label">Fotos adicionales</p><PhotoUploadArea /></div>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <input 
                            aria-label="Nombre del lugar" 
                            className="input px-3 py-2.5 w-full" 
                            placeholder="Nombre del lugar"
                            value={form.customName} 
                            onChange={e => setForm({ ...form, customName: e.target.value })} 
                        />
                        <div>
                            <p className="label">
                                Fotos (opcional)
                            </p>
                            <PhotoUploadArea />
                        </div>
                    </div>
                )}
                {errors.name && <p className="field-error">{errors.name}</p>}
            </div>

            <div>
                <label className="label">Tipo</label>
                <div className="grid grid-cols-3 gap-2">
                    {placeTypeOptions.map(opt => (
                        <button 
                            aria-label={`Seleccionar tipo ${opt.label}`} 
                            key={opt.value} 
                            type="button"
                            onClick={() => setForm({ ...form, type: opt.value })}
                            className={`py-2 rounded-xl text-xs font-medium border transition flex items-center justify-center gap-1.5 ${
                                form.type === opt.value 
                                ? 'bg-primary text-white border-primary' 
                                : 'border-border text-text-secondary hover:bg-primary-light'
                            }`}
                        >
                            <opt.Icon size={12} /> {opt.label}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label className="label">Valoración</label>
                <StarPicker value={form.rating} onChange={v => setForm({ ...form, rating: v })} />
                {errors.rating && <p className="field-error">{errors.rating}</p>}
            </div>

            <div>
                <label className="label">Dirección (opcional)</label>
                <input 
                    aria-label="Dirección del lugar" 
                    className="input px-3 py-2.5 w-full" 
                    placeholder="Ej: Calle Mayor 1"
                    value={form.address} 
                    onChange={e => setForm({ ...form, address: e.target.value })} 
                />
            </div>

            {form.type === 'Restaurante' && (
                <div>
                    <label className="label">Plato o bebida recomendada</label>
                    <input 
                        aria-label="Plato recomendado" 
                        className="input px-3 py-2.5 w-full" 
                        placeholder="Opcional"
                        value={form.dish} 
                        onChange={e => setForm({ ...form, dish: e.target.value })} 
                    />
                </div>
            )}

            <div>
                <label className="label">Reseña</label>
                <textarea 
                    className="input px-3 py-2.5 resize-none w-full" 
                    placeholder="Escribe tu reseña..." rows={3}
                    value={form.review} 
                    onChange={e => setForm({ ...form, review: e.target.value })} 
                />
            </div>

            <div className="flex gap-3">
                <button 
                    aria-label="Cancelar" 
                    onClick={onClose}
                    className="flex-1 px-4 py-2.5 rounded-full border border-border text-text-secondary text-sm hover:bg-bg-section transition"
                >
                    Cancelar
                </button>
                <button 
                    aria-label="Guardar lugar" 
                    onClick={handleSubmit} 
                    disabled={saving}
                    className="flex-1 btn justify-center disabled:opacity-50"
                >
                    {saving ? 'Guardando...' : 'Guardar lugar'}
                </button>
            </div>
        </div>
    );
};