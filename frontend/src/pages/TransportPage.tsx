import React, { useEffect, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import { ITrip } from '../types/ITrip';
import { SavedTransport } from '../types/transport';
import { useTransport } from '../hooks/useTransport';
import { tripService } from '../services/tripService';
import { TransportModeSelector } from '../components/transport/TransportModeSelector';
import { TransportInputForm } from '../components/transport/TransportInputForm';
import { TransportSummary } from '../components/transport/TransportSummary';
import { TransportMatrix } from '../components/transport/TransportMatrix';
import { TransportAdvice } from '../components/transport/TransportAdvice';
import { SavedTransports } from '../components/transport/SavedTransports';
import { ToastContainer } from '../components/ui/ToastContainer';

export const TransportPage = () => {
    const { id: tripId } = useParams<{ id: string }>();
    const { trip } = useOutletContext<{ trip: ITrip | null }>();

    const hotel = trip?.hotels?.[0];
    const ciudad = trip?.destination?.split(',')[0]?.trim() || '';
    const alojamiento = hotel ? `${hotel.address || hotel.name}, ${ciudad}` : null;

    const {
        mode, changeMode,
        aeropuerto, aeropuertoDisplay,
        handleAeropuertoChange,
        equipaje, setEquipaje,
        horaLlegada, setHoraLlegada,
        loading, compare,
        result, fromCoords, toCoords, routePoints,
        toasts, removeToast, showToast
    } = useTransport({ alojamiento });

    const [saved, setSaved] = useState<SavedTransport[]>([]);
    const [savingTransport, setSavingTransport] = useState(false);
    const [activeTab, setActiveTab] = useState<'search' | 'saved'>('search');

    useEffect(() => {
        if (!tripId) return;
        tripService.getSavedTransports(tripId)
            .then((data: any) => setSaved(Array.isArray(data) ? data : []))
            .catch(() => setSaved([]));
    }, [tripId]);

    const handleSaveTransport = async (opcion: any, tipo: 'publico' | 'privado') => {
        if (!tripId || !result) return;
        setSavingTransport(true);
        try {
            const transport = await tripService.saveTransport(tripId, {
                mode: tipo,
                origin: alojamiento || 'Alojamiento',
                destination: aeropuertoDisplay || 'Aeropuerto',
                duration: opcion.tiempo_min || null,
                price: opcion.precio_eur || null,
                lineaRecomendada: opcion.lineaRecomendada?.linea || null,
                tipoTransporte: opcion.medio || null,
                operador: opcion.operador || null,
                notas: opcion.descripcion_corta || null,
            });
            setSaved(prev => [transport, ...prev]);
            showToast('Transporte guardado', 'success');
        } catch {
            showToast('Error al guardar transporte', 'error');
        } finally {
            setSavingTransport(false);
        }
    };

    const handleDeleteTransport = async (transportId: string) => {
        if (!tripId) return;
        try {
            await tripService.deleteTransport(tripId, transportId);
            setSaved(prev => prev.filter(t => t.id !== transportId));
        } catch {}
    };

    return (
        <div className="space-y-6">
            <div className="flex gap-2 border-b border-border">
                {[
                    { key: 'search', label: 'Buscar transporte' },
                    { key: 'saved', label: `Guardados (${saved.length})` },
                ].map(t => (
                    <button aria-label={t.label} key={t.key} onClick={() => setActiveTab(t.key as any)}
                        className={`px-4 py-2.5 text-sm font-medium rounded-t-xl transition ${
                            activeTab === t.key
                                ? 'bg-white border border-b-white border-border text-text -mb-px'
                                : 'text-text-secondary hover:text-text'
                        }`}>
                        {t.label}
                    </button>
                ))}
            </div>

            {activeTab === 'search' && (
                <>
                    <TransportModeSelector mode={mode} onChange={changeMode} />
                    <TransportInputForm
                        mode={mode} alojamiento={alojamiento} aeropuertoDisplay={aeropuertoDisplay}
                        equipaje={equipaje} horaLlegada={horaLlegada} loading={loading}
                        hasAeropuerto={!!aeropuerto} onAeropuertoChange={handleAeropuertoChange}
                        onEquipajeChange={setEquipaje} onHoraChange={setHoraLlegada} onCompare={compare}
                    />
                    {loading && (
                        <div className="flex items-center justify-center py-12 gap-3">
                            <div className="spinner" />
                            <p className="text-sm text-text-secondary">Analizando rutas, clima y equipaje con IA...</p>
                        </div>
                    )}
                    {result && fromCoords && toCoords && (
                        <div className="space-y-5">
                            <TransportAdvice recomendacion={result.recomendacion} avisoContextual={result.avisoContextual} />
                            <TransportSummary result={result} fromCoords={fromCoords} toCoords={toCoords} routePoints={routePoints} />
                            {result.opciones && (
                                <>
                                    <TransportMatrix opciones={result.opciones} />
                                    <div className="flex flex-wrap gap-3">
                                        {result.opciones.publico && (
                                            <button aria-label="Guardar transporte público" onClick={() => handleSaveTransport(result.opciones!.publico, 'publico')}
                                                disabled={savingTransport}
                                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-primary/30 bg-primary-light text-primary text-sm font-medium hover:bg-primary hover:text-white transition disabled:opacity-50">
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
                                                    <polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" />
                                                </svg>
                                                Guardar transporte público
                                            </button>
                                        )}
                                        {result.opciones.privado && (
                                            <button aria-label="Guardar taxi/VTC" onClick={() => handleSaveTransport(result.opciones!.privado, 'privado')}
                                                disabled={savingTransport}
                                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card text-text-secondary text-sm font-medium hover:bg-primary-light hover:text-primary transition disabled:opacity-50">
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
                                                    <polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" />
                                                </svg>
                                                Guardar taxi / VTC
                                            </button>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </>
            )}

            {activeTab === 'saved' && (
                <SavedTransports transports={saved} onDelete={handleDeleteTransport} />
            )}

            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </div>
    );
};