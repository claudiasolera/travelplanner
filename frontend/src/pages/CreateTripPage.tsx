import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { tripService } from '../services/tripService';
import { ErrorAlert } from '../components/ui/ErrorAlert';

const travelModes = [
    { mode: 'Aventura', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 17l4-8 4 4 4-6 4 10H3z"/></svg> },
    { mode: 'Relax',    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg> },
    { mode: 'Cultura',  icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 22V8l9-6 9 6v14"/><rect x="9" y="14" width="6" height="8"/></svg> },
    { mode: 'Fiesta',   icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z"/></svg> },
];

const steps = [
    { label: 'Destino',    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="10" r="4"/><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg> },
    { label: 'Fechas',     icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M3 9h18M8 2v4M16 2v4" strokeLinecap="round"/></svg> },
    { label: 'Preferencias', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M12 6v2M12 16v2M9 9.5h4.5a1.5 1.5 0 010 3H10a1.5 1.5 0 000 3H15" strokeLinecap="round"/></svg> },
];

export const CreateTripPage = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    const [formData, setFormData] = useState({
        origin: '', destination: '', startDate: '', endDate: '',
        people: 1, budget: '', travelMode: 'Aventura',
    });

    const [originSuggestions, setOriginSuggestions] = useState<string[]>([]);
    const [destSuggestions, setDestSuggestions] = useState<string[]>([]);
    const [showOriginSugg, setShowOriginSugg] = useState(false);
    const [showDestSugg, setShowDestSugg] = useState(false);

    const fetchSuggestions = async (query: string, setter: (s: string[]) => void) => {
        if (query.length < 2) { setter([]); return; }
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&featuretype=city`, { headers: { 'Accept-Language': 'es' } });
            const data = await res.json();
            const names = data.map((item: any) => {
                const parts = item.display_name.split(',');
                return `${item.name || parts[0].trim()}, ${parts[parts.length - 1].trim()}`;
            });
            setter([...new Set(names)] as string[]);
        } catch { setter([]); }
    };

    const handleGenerate = async () => {
        setFieldErrors({}); setError(null);
        const errors: Record<string, string> = {};
        if (!formData.origin) errors.origin = 'El origen es obligatorio';
        if (!formData.destination) errors.destination = 'El destino es obligatorio';
        if (!formData.startDate) errors.startDate = 'La fecha de ida es obligatoria';
        if (!formData.endDate) errors.endDate = 'La fecha de vuelta es obligatoria';
        if (!formData.budget) errors.budget = 'El presupuesto es obligatorio';
        if (!formData.travelMode) errors.travelMode = 'El modo de viaje es obligatorio';
        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return;
        }
        setIsGenerating(true);
        try {
            const response = await tripService.createTrip(formData);
            const tripId = response.trip?.id || response.id;
            navigate(`/trip/${tripId}`);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Error al conectar con el servidor');
            setIsGenerating(false);
        }
    };

    const handleNext = () => {
        setFieldErrors({});
        if (step === 1) {
            const errors: Record<string, string> = {};
            if (!formData.origin) errors.origin = 'El origen es obligatorio';
            if (!formData.destination) errors.destination = 'El destino es obligatorio';
            if (Object.keys(errors).length > 0) { setFieldErrors(errors); return; }
        }
        if (step === 2) {
            const errors: Record<string, string> = {};
            if (!formData.startDate) errors.startDate = 'La fecha de ida es obligatoria';
            if (!formData.endDate) errors.endDate = 'La fecha de vuelta es obligatoria';
            if (Object.keys(errors).length > 0) { setFieldErrors(errors); return; }
        }
        setStep(p => Math.min(p + 1, 3));
    };

    if (isGenerating) return (
        <div className="min-h-screen bg-bg flex items-center justify-center">
            <div className="text-center space-y-4">
                <div className="spinner-lg mx-auto"/>
                <p className="text-text font-semibold">Creando tu viaje...</p>
                <p className="text-sm text-text-secondary">Esto puede tardar unos segundos.</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-bg-section py-12 px-4">
            <div className="max-w-lg mx-auto">

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-text mb-1">Crea tu viaje</h1>
                    <p className="text-text-secondary text-sm">Planifica tu próxima aventura en 3 pasos</p>
                </div>

                {/* Steps */}
                <div className="flex items-center justify-center gap-2 mb-8">
                    {steps.map((s, i) => {
                        const num = i + 1;
                        const isActive = step === num;
                        const isDone = step > num;
                        return (
                            <React.Fragment key={s.label}>
                                <div className="flex flex-col items-center gap-1">
                                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                                        isDone  ? 'bg-primary text-white' :
                                        isActive ? 'bg-primary text-white shadow-lg' :
                                        'bg-card text-text-soft border border-border'
                                    }`}>
                                        {isDone ? (
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                                                <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        ) : s.icon}
                                    </div>
                                    <span className={`text-xs font-medium ${isActive ? 'text-primary' : 'text-text-soft'}`}>
                                        {s.label}
                                    </span>
                                </div>
                                {i < steps.length - 1 && (
                                    <div className={`w-12 h-0.5 mb-4 rounded-full transition-all ${step > i + 1 ? 'bg-primary' : 'bg-border'}`}/>
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>

                <ErrorAlert message={error} onClose={() => setError(null)} />

                {/* Card */}
                <div className="card rounded-3xl p-6">

                    {step === 1 && (
                        <div className="space-y-4">
                            <div>
                                <h2 className="text-center text-lg font-semibold text-text mb-0.5">¿De dónde sales y a dónde vas?</h2>
                                <p className="text-center text-xs text-text-soft mb-4">Escribe la ciudad y selecciona una sugerencia</p>
                            </div>

                            <div className="relative">
                                <label className="label">Origen</label>
                                <div className="relative">
                                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-text-soft" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="10" r="4"/><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                                    </svg>
                                    <input 
                                        aria-label="Origen del viaje, por ejemplo Madrid, España"
                                        type="text" 
                                        placeholder="Ej: Madrid, España"
                                        className="w-full input px-4 py-2.5 pl-9"
                                        value={formData.origin}
                                        onChange={e => { setFormData({ ...formData, origin: e.target.value }); fetchSuggestions(e.target.value, setOriginSuggestions); setShowOriginSugg(true); }}
                                        onBlur={() => setTimeout(() => setShowOriginSugg(false), 150)}
                                        onFocus={() => originSuggestions.length > 0 && setShowOriginSugg(true)} 
                                    />
                                </div>
                                {fieldErrors.origin && <p className="field-error">{fieldErrors.origin}</p>}
                                {showOriginSugg && originSuggestions.length > 0 && (
                                    <ul className="absolute z-10 w-full bg-card border border-border rounded-2xl mt-1 shadow-lg">
                                        {originSuggestions.map((s, i) => (
                                            <li key={i} className="flex items-center gap-2 px-4 py-2.5 text-sm text-text hover:bg-primary-light cursor-pointer transition"
                                                onClick={() => { setFormData({ ...formData, origin: s }); setShowOriginSugg(false); }}>
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2"><circle cx="12" cy="10" r="4"/><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>
                                                {s}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            <div className="relative">
                                <label className="label">Destino</label>
                                <div className="relative">
                                    <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2">
                                        <circle cx="12" cy="10" r="4" fill="#dbeafe"/><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                                    </svg>
                                    <input 
                                        aria-label="Destino del viaje"
                                        type="text" placeholder="Ej: Kioto, Japón"
                                        className="w-full input px-4 py-2.5 pl-9"
                                        value={formData.destination}
                                        onChange={e => { setFormData({ ...formData, destination: e.target.value }); fetchSuggestions(e.target.value, setDestSuggestions); setShowDestSugg(true); }}
                                        onBlur={() => setTimeout(() => setShowDestSugg(false), 150)}
                                        onFocus={() => destSuggestions.length > 0 && setShowDestSugg(true)} 
                                    />
                                </div>
                                {fieldErrors.destination && <p className="field-error">{fieldErrors.destination}</p>}
                                {showDestSugg && destSuggestions.length > 0 && (
                                    <ul className="absolute z-10 w-full bg-card border border-border rounded-2xl mt-1 shadow-lg">
                                        {destSuggestions.map((s, i) => (
                                            <li key={i} className="flex items-center gap-2 px-4 py-2.5 text-sm text-text hover:bg-primary-light cursor-pointer transition"
                                                onClick={() => { setFormData({ ...formData, destination: s }); setShowDestSugg(false); }}>
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2"><circle cx="12" cy="10" r="4" fill="#dbeafe"/><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>
                                                {s}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4">
                            <div>
                                <h2 className="text-center text-lg font-semibold text-text mb-0.5">¿Cuándo y con quién?</h2>
                                <p className="text-center text-xs text-text-soft mb-4">Elige las fechas y el número de viajeros</p>
                            </div>

                            <div>
                                <label className="label">Fecha de ida</label>
                                <input 
                                    aria-label="Fecha de ida del viaje"
                                    type="date" className="w-full input px-4 py-2.5"
                                    value={formData.startDate}
                                    onChange={e => setFormData({ ...formData, startDate: e.target.value })} 
                                />
                                {fieldErrors.startDate && <p className="field-error">{fieldErrors.startDate}</p>}
                            </div>

                            <div>
                                <label className="label">Fecha de vuelta</label>
                                <input 
                                    aria-label="Fecha de vuelta del viaje"
                                    type="date" className="w-full input px-4 py-2.5"
                                    value={formData.endDate}
                                    onChange={e => setFormData({ ...formData, endDate: e.target.value })} 
                                />
                                {fieldErrors.endDate && <p className="field-error">{fieldErrors.endDate}</p>}
                            </div>

                            <div>
                                <label className="label">Número de viajeros</label>
                                <div className="flex items-center gap-4">
                                    <button 
                                        aria-label="Reducir número de viajeros"
                                        onClick={() => setFormData({ ...formData, people: Math.max(1, formData.people - 1) })}
                                        className="w-10 h-10 bg-primary-light hover:bg-primary hover:text-white text-primary rounded-2xl font-bold transition flex items-center justify-center border border-border"
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14" strokeLinecap="round"/></svg>
                                    </button>
                                    <span className="text-xl font-bold text-text w-6 text-center">{formData.people}</span>
                                    <button 
                                        aria-label="Aumentar número de viajeros"
                                        onClick={() => setFormData({ ...formData, people: formData.people + 1 })}
                                        className="w-10 h-10 bg-primary-light hover:bg-primary hover:text-white text-primary rounded-2xl font-bold transition flex items-center justify-center border border-border"
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14" strokeLinecap="round"/></svg>
                                    </button>
                                    <span className="text-sm text-text-secondary">{formData.people === 1 ? 'viajero' : 'viajeros'}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-4">
                            <div>
                                <h2 className="text-lg font-semibold text-text mb-0.5">Estilo y presupuesto</h2>
                                <p className="text-xs text-text-soft mb-4">¿Cómo quieres viajar?</p>
                            </div>

                            <div>
                                <label className="label">Presupuesto total (€)</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-soft text-sm font-medium">€</span>
                                    <input 
                                        aria-label="Presupuesto total"
                                        type="number" 
                                        placeholder="Ej: 1500"
                                        className="input px-4 py-2.5 pl-8"
                                        value={formData.budget}
                                        onChange={e => setFormData({ ...formData, budget: e.target.value })} 
                                    />
                                        {fieldErrors.budget && <p className="field-error">{fieldErrors.budget}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="label">Modo de viaje</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {travelModes.map(({ mode, icon }) => (
                                        <button 
                                            key={mode}
                                            aria-label={mode}
                                            onClick={() => setFormData({ ...formData, travelMode: mode })}
                                            className={`flex items-center gap-2 py-3 px-4 rounded-2xl border text-sm font-medium transition ${
                                                formData.travelMode === mode
                                                    ? 'border-primary bg-primary-light text-primary'
                                                    : 'border-border text-text-secondary hover:bg-bg-section'
                                            }`}
                                        >
                                            {icon}{mode}
                                        </button>
                                    ))}
                                </div>
                                {fieldErrors.travelMode && <p className="field-error">{fieldErrors.travelMode}</p>}
                            </div>
                        </div>
                    )}
                </div>

                {/* Navegación */}
                <div className="flex justify-between mt-5">
                    <button
                        aria-label='Volver atrás'
                        onClick={() => setStep(p => Math.max(p - 1, 1))}
                        className={`flex items-center gap-2 px-4 py-2.5 border border-border rounded-full text-sm text-text-secondary hover:bg-card transition ${step === 1 ? 'invisible' : ''}`}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" strokeLinecap="round"/></svg>
                        Atrás
                    </button>
                    {step < 3 ? (
                        <button 
                            aria-label='Siguiente'
                            onClick={handleNext} 
                            className="btn flex items-center gap-2 px-6"
                        >
                            Siguiente
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                <path d="M9 18l6-6-6-6" strokeLinecap="round"/>
                            </svg>
                        </button>
                    ) : (
                        <button
                            aria-label='Crear viaje' 
                            onClick={handleGenerate}
                            className="btn flex items-center gap-2 px-6"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 00-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                            </svg>
                            Crear viaje
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};