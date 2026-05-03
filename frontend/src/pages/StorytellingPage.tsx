import React, { JSX, useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { apiClient } from '../services/apiClient';
import { ITrip } from '../types/ITrip';

type Tab = 'historia' | 'curiosidades' | 'costumbres' | 'leyendas' | 'documentos' | 'moneda' | 'vacunas' | 'practicos';

export const StorytellingPage = () => {
    const { trip } = useOutletContext<{ trip: ITrip | null }>();
    const [info, setInfo] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [activeTab, setActiveTab] = useState<Tab>('historia');

    const destination = trip?.destination?.split(',')[0] || '';
    const country = trip?.country || '';

    useEffect(() => {
        if (!destination) return;
        setLoading(true);
        apiClient(`/ai/destination/${encodeURIComponent(destination)}?${country ? `country=${encodeURIComponent(country)}&` : ''}tripId=${trip?.id || ''}`)
            .then(data => setInfo(data))
            .catch(() => setError(true))
            .finally(() => setLoading(false));
    }, [destination]);

    const tabs: { key: Tab; label: string }[] = [
        { key: 'historia',     label: 'Historia' },
        { key: 'curiosidades', label: 'Curiosidades' },
        { key: 'costumbres',   label: 'Costumbres' },
        { key: 'leyendas',     label: 'Leyendas' },
        { key: 'documentos',   label: 'Documentos' },
        { key: 'moneda',       label: 'Moneda' },
        { key: 'vacunas',      label: 'Vacunas' },
        { key: 'practicos',    label: 'Datos prácticos' },
    ];

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="relative w-14 h-14">
                <div className="absolute inset-0 rounded-full border-4 border-border"/>
                <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"/>
                <div className="absolute inset-0 flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2">
                        <circle cx="12" cy="12" r="9"/><path d="M2 12h20M12 2a15 15 0 010 20"/>
                    </svg>
                </div>
            </div>
            <p className="text-text font-semibold text-sm">Cargando guía de {destination}...</p>
            <p className="text-text-soft text-xs">Obteniendo información del destino</p>
        </div>
    );

    if (error || !info) return (
        <div className="space-y-4">
            <h1 className="text-2xl font-semibold text-text">Destino</h1>
            <div className="empty-state rounded-2xl">
                <p className="text-text-soft text-sm">No se pudo cargar la información del destino.</p>
            </div>
        </div>
    );

    return (
        <div className="space-y-5">

            {/* Header */}
            <div className="card-lg rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-4">
                    {info.bandera && <span className="text-5xl">{info.bandera}</span>}
                    <div className="flex-1">
                        <h1 className="text-xl font-semibold text-text">{info.ciudad}</h1>
                        <p className="text-sm text-text-secondary">{info.pais}</p>
                        {info.wikipedia_url && (
                            <a 
                                href={info.wikipedia_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-xs text-primary hover:underline mt-1 inline-flex items-center gap-1"
                                aria-label="Ver en Wikipedia"
                            >
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                                    <polyline points="15,3 21,3 21,9"/><line x1="10" y1="14" x2="21" y2="3"/>
                                </svg>
                                Ver en Wikipedia
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 border-b border-border overflow-x-auto sticky top-0 bg-white z-10">
                {tabs.map(tab => (
                    <button 
                        aria-label={tab.label}
                        key={tab.key} onClick={() => setActiveTab(tab.key)}
                        className={`px-4 py-2.5 text-sm font-medium rounded-t-xl transition whitespace-nowrap shrink-0 ${
                            activeTab === tab.key
                                ? 'bg-white border border-b-white border-border text-text -mb-px'
                                : 'text-text-secondary hover:text-text'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 280px)' }}>

                {/* HISTORIA */}
                {activeTab === 'historia' && (
                    <div className="card-lg rounded-2xl p-5 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-primary-light rounded-xl flex items-center justify-center shrink-0">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2">
                                    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z"/>
                                </svg>
                            </div>
                            <h2 className="font-semibold text-text">Historia de {info.ciudad}</h2>
                        </div>
                        <p className="text-text-secondary text-sm leading-relaxed">{info.historia}</p>
                        {info.wikipedia_url && (
                            <a 
                                href={info.wikipedia_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline border border-primary/20 bg-primary-light px-3 py-1.5 rounded-xl"
                                aria-label="Ver en Wikipedia"
                            >
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                                    <polyline points="15,3 21,3 21,9"/><line x1="10" y1="14" x2="21" y2="3"/>
                                </svg>
                                Leer artículo completo en Wikipedia
                            </a>
                        )}
                    </div>
                )}

                {/* CURIOSIDADES */}
                {activeTab === 'curiosidades' && (
                    <div className="space-y-3">
                        {(info.curiosidades || []).map((c: string, i: number) => (
                            <div key={i} className="card-lg rounded-2xl p-4 flex items-start gap-3">
                                <div className="w-7 h-7 bg-primary-light rounded-xl flex items-center justify-center shrink-0 font-bold text-primary text-xs">
                                    {i + 1}
                                </div>
                                <p className="text-sm text-text-secondary leading-relaxed">{c}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* COSTUMBRES */}
                {activeTab === 'costumbres' && (
                    <div className="space-y-3">
                        {(info.costumbres || []).map((c: string, i: number) => (
                            <div key={i} className="card-lg rounded-2xl p-4 flex items-start gap-3">
                                <div className="w-7 h-7 bg-primary-light rounded-xl flex items-center justify-center shrink-0">
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2">
                                        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                                        <circle cx="9" cy="7" r="4"/>
                                    </svg>
                                </div>
                                <p className="text-sm text-text-secondary leading-relaxed">{c}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* LEYENDAS */}
                {activeTab === 'leyendas' && (
                    <div className="space-y-4">
                        {(info.leyendas || []).map((l: string, i: number) => (
                            <div key={i} className="card-lg rounded-2xl p-5 space-y-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 bg-primary-light rounded-xl flex items-center justify-center shrink-0">
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
                                            <path d="M12 6v6l4 2" strokeLinecap="round"/>
                                        </svg>
                                    </div>
                                    <p className="font-semibold text-text text-sm">Leyenda {i + 1}</p>
                                </div>
                                <p className="text-sm text-text-secondary leading-relaxed italic">{l}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* DOCUMENTOS */}
                {activeTab === 'documentos' && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { label: 'Visado', value: info.documentos?.visado },
                                { label: 'Pasaporte', value: info.documentos?.pasaporte },
                            ].map(item => (
                                <div key={item.label} className="card-lg rounded-2xl p-5 space-y-4">
                                    <p className="font-semibold text-text text-sm">{item.label}</p>
                                    <p className="text-sm text-text-secondary leading-relaxed">{item.value}</p>
                                </div>
                            ))}
                        </div>
                        <div className="card-lg rounded-2xl p-5 space-y-4">
                            <p className="font-semibold text-text text-sm mb-2">Documentos recomendados</p>
                            <div className="space-y-2">
                                {(info.documentos?.otros || []).map((d: string, i: number) => (
                                    <div key={i} className="flex items-center gap-2 text-sm text-text-secondary">
                                        <div className="w-1.5 h-1.5 bg-primary rounded-full shrink-0"/>
                                        {d}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex items-start gap-3 bg-primary-light border border-primary/20 rounded-2xl p-4">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" className="shrink-0 mt-0.5">
                                <circle cx="12" cy="12" r="10"/>
                                <line x1="12" y1="8" x2="12" y2="12"/>
                                <line x1="12" y1="16" x2="12.01" y2="16"/>
                            </svg>
                            <p className="text-xs text-primary">
                                Consulta siempre la información actualizada en el portal del{' '}
                                <a 
                                    href="https://www.exteriores.gob.es/es/ServiciosAlCiudadano/Paginas/Asistencia-en-viaje.aspx"
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="font-bold underline"
                                    aria-label="Ver información en el Ministerio de Asuntos Exteriores"
                                >
                                    Ministerio de Asuntos Exteriores de España
                                </a>
                            </p>
                        </div>
                    </div>
                )}

                {/* MONEDA */}
                {activeTab === 'moneda' && (
                    <div className="space-y-4">
                        <div className="card-lg rounded-2xl p-5 space-y-4">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-16 h-16 bg-primary-light rounded-2xl flex items-center justify-center text-2xl font-bold text-primary shrink-0">
                                    {info.moneda?.simbolo || info.moneda?.codigo}
                                </div>
                                <div>
                                    <p className="font-semibold text-text text-lg">{info.moneda?.nombre}</p>
                                    <p className="text-sm text-text-secondary">Código: {info.moneda?.codigo}</p>
                                    <p className="text-xs text-primary mt-1">{info.moneda?.cambio_aproximado}</p>
                                </div>
                            </div>
                            <div className="border-t border-border pt-4 space-y-2">
                                <p className="text-xs font-semibold text-text-soft uppercase tracking-wide mb-3">Consejos de pago</p>
                                {(info.moneda?.consejos || []).map((c: string, i: number) => (
                                    <div key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                                        <div className="w-1.5 h-1.5 bg-primary rounded-full shrink-0 mt-1.5"/>
                                        {c}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* VACUNAS */}
                {activeTab === 'vacunas' && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="card-lg rounded-2xl p-5 space-y-4">
                                <p className="font-semibold text-text text-sm mb-3">Vacunas recomendadas</p>
                                <div className="space-y-2">
                                    {(info.vacunas?.recomendadas || []).map((v: string, i: number) => (
                                        <div key={i} className="flex items-center gap-2 text-sm text-text-secondary">
                                            <div className="w-1.5 h-1.5 bg-primary rounded-full shrink-0"/>
                                            {v}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="card-lg rounded-2xl p-5 space-y-4">
                                <p className="font-semibold text-text text-sm mb-3">Vacunas obligatorias</p>
                                <div className="space-y-2">
                                    {(info.vacunas?.obligatorias || []).map((v: string, i: number) => (
                                        <div key={i} className="flex items-center gap-2 text-sm text-text-secondary">
                                            <div className="w-1.5 h-1.5 bg-red-400 rounded-full shrink-0"/>
                                            {v}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 bg-primary-light border border-primary/20 rounded-2xl p-4">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" className="shrink-0 mt-0.5">
                                <circle cx="12" cy="12" r="10"/>
                                <line x1="12" y1="8" x2="12" y2="12"/>
                                <line x1="12" y1="16" x2="12.01" y2="16"/>
                            </svg>
                            <p className="text-sm text-primary">{info.vacunas?.consejo}</p>
                        </div>
                    </div>
                )}

                {/* DATOS PRÁCTICOS */}
                {activeTab === 'practicos' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            { label: 'Idioma principal',  value: info.datos_practicos?.idioma,            icon: '🗣️' },
                            { label: 'Enchufe',           value: info.datos_practicos?.enchufe,           icon: '🔌' },
                            { label: 'Voltaje',           value: info.datos_practicos?.voltaje,           icon: '⚡' },
                            { label: 'Propinas',          value: info.datos_practicos?.propinas,          icon: '💵' },
                            { label: 'Seguridad',         value: info.datos_practicos?.seguridad,         icon: '🔒' },
                            { label: 'Mejor época',       value: info.datos_practicos?.mejor_epoca,       icon: '📅' },
                            { label: 'Transporte local',  value: info.datos_practicos?.transporte_local,  icon: '🚇' },
                            ...(info.datos_practicos?.otros_idiomas?.length > 0 ? [{
                                label: 'Otros idiomas',
                                value: info.datos_practicos.otros_idiomas.join(', '),
                                icon: '🌐'
                            }] : [])
                        ].map((item, i) => (
                            <div key={i} className="card-lg rounded-2xl p-4 flex items-start gap-3">
                                <div className="w-9 h-9 bg-primary-light rounded-xl flex items-center justify-center shrink-0 text-lg">
                                    {item.icon}
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-text-soft uppercase tracking-wide">{item.label}</p>
                                    <p className="text-sm text-text mt-0.5 leading-relaxed">{item.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};