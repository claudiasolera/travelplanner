import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { tripService } from '../services/tripService';
import { ITrip } from '../types/ITrip';
import { InfoCard } from '../components/ui/InfoCard';
import { CollaboratorsPanel } from '../components/trips/CollaboratorsPanel';
import { apiClient } from '../services/apiClient';
import { ConfirmModal } from '../components/ui/ConfirmModal';

const TRAVEL_STYLES = ['Aventura', 'Relax', 'Cultura', 'Fiesta', 'Romántico', 'Familiar', 'Negocios'];

export const TripDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { trip: contextTrip } = useOutletContext<{ trip: ITrip | null }>();
    const [trip, setTrip] = useState<ITrip | null>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [editData, setEditData] = useState<any>({});
    const [collaborators, setCollaborators] = useState<any[]>([]);
    const [coverPreview, setCoverPreview] = useState<string | null>(null);
    const [uploadingCover, setUploadingCover] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingTrip, setDeletingTrip] = useState(false);

    useEffect(() => {
        if (contextTrip) {
            setTrip(contextTrip);
            setLoading(false);
            return;
        }
        const fetchDetails = async () => {
            try {
                setLoading(true);
                if (id) {
                    const data = await tripService.getTripById(id);
                    if (data) setTrip(data.trip || data);
                    else setTrip(null);
                }
            } catch {
                setTrip(null);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id]);

    useEffect(() => {
        if (id) {
            tripService.getCollaborators(id)
                .then(r => setCollaborators(r.collaborators || []))
                .catch(() => {});
        }
    }, [id]);

    const handleSave = async () => {
        try {
            await tripService.updateTrip(id!, editData);
            setTrip({ ...trip!, ...editData });
            setEditing(false);
        } catch { alert('Error al guardar'); }
    };

    const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setCoverPreview(URL.createObjectURL(file));
        setUploadingCover(true);
        try {
            const formData = new FormData();
            formData.append('photo', file);
            const result = await apiClient(`/trips/${id}/cover`, {
                method: 'POST',
                body: formData,
            });
            setTrip(prev => prev ? { ...prev, coverImage: result.coverImage } : prev);
        } catch {
            setCoverPreview(null);
        } finally {
            setUploadingCover(false);
        }
    };

    const handleRemoveCover = async () => {
        try {
            await tripService.updateTrip(id!, { coverImage: null });
            setTrip(prev => prev ? { ...prev, coverImage: null } : prev);
            setCoverPreview(null);
        } catch {}
    };

    if (loading) return (
        <div className="flex items-center gap-2 text-text-secondary py-10 justify-center">
            <div className="spinner-sm"/>
            Cargando viaje...
        </div>
    );

    if (!trip) return (
        <div className="text-center py-10 space-y-3">
            <p className="text-text-secondary text-sm">Viaje no encontrado.</p>
            <button 
                aria-label="Volver a mis viajes"
                onClick={() => navigate('/my-trips')} 
                className="text-accent hover:underline text-sm"
            >
                Volver a mis viajes
            </button>
        </div>
    );

    const isCollaborator = !!(trip as any)?.isCollaborator;
    const ownerName = (trip as any)?.user?.name;
    const coverSrc = coverPreview || (trip as any)?.coverImage || null;

    return (
        <div className="space-y-5">

            {/* Título */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-semibold text-text">{trip.destination}</h1>
                    <p className="text-xs text-text-secondary mt-0.5">
                        {isCollaborator && ownerName
                            ? `Creado por ${ownerName}`
                            : `Creado: ${trip.createdAt ? new Date(trip.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Reciente'}`
                        }
                    </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    {!isCollaborator && (
                        <button
                            aria-label="Cambiar visibilidad"
                            onClick={async () => {
                                await tripService.updateTrip(id!, { isPublic: !trip.isPublic });
                                setTrip({ ...trip, isPublic: !trip.isPublic });
                            }}
                            className={`border text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1.5 transition ${
                                trip.isPublic
                                    ? 'border-green-400 bg-green-200 text-secondary-dark hover:bg-green-400'
                                    : 'border-red-400 bg-red-200 text-text-secondary hover:bg-red-400'
                            }`}>
                            <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor">
                                <circle cx="12" cy="12" r="6"/>
                            </svg>
                            {trip.isPublic ? 'Público' : 'Privado'}
                        </button>
                    )}
                    <button
                        aria-label="Editar viaje"
                        onClick={() => {
                            setEditing(!editing);
                            setEditData({
                                startDate: trip.startDate?.split('T')[0],
                                endDate: trip.endDate?.split('T')[0],
                                budget: trip.budget,
                                travelersCount: trip.travelersCount,
                                travelStyle: trip.travelStyle
                            });
                        }}
                        className="btn-login flex items-center gap-1.5 text-xs py-1.5 px-3"
                    >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                        <span className="hidden sm:inline">{editing ? 'Cancelar' : 'Editar'}</span>
                    </button>
                    <button
                        aria-label="Descargar itinerario en PDF"
                        onClick={async () => {
                            try {
                                const token = localStorage.getItem('token');
                                const res = await fetch(`https://proyectofinal-backend-production-7188.up.railway.app/api/trips/${id}/pdf`, {
                                    headers: { 'Authorization': `Bearer ${token}` }
                                });

                                if (!res.ok) throw new Error();

                                const blob = await res.blob();
                                if (blob.type !== 'application/pdf') throw new Error();

                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = `Itinerario_${trip?.destination || 'viaje'}.pdf`;
                                document.body.appendChild(a);
                                a.click();
                                document.body.removeChild(a);
                                URL.revokeObjectURL(url);
                            } catch (err) { 
                                alert('Error al descargar el PDF. Asegúrate de estar logueado.'); 
                            }
                        }}
                        className="flex items-center gap-1.5 text-xs py-1.5 px-3 rounded-xl border border-primary/30 bg-primary-light text-primary hover:bg-primary hover:text-white transition"
                    >
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="14" 
                            height="14" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                        >
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        <span>PDF</span>
                    </button>
                    {!isCollaborator && (
                        <button
                            aria-label="Eliminar viaje"
                            onClick={() => setShowDeleteModal(true)}
                            className="flex items-center gap-1.5 text-xs py-1.5 px-3 rounded-xl border border-red-300 bg-red-50 text-red-600 hover:bg-red-100 transition">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="3 6 5 6 21 6"/>
                                <path d="M19 6l-1 14H6L5 6"/>
                                <path d="M10 11v6M14 11v6"/>
                                <path d="M9 6V4h6v2"/>
                            </svg>
                            <span className="hidden sm:inline">Eliminar</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Foto de portada */}
            <div className="card-lg relative w-70 h-50 rounded-2xl overflow-hidden bg-bg-section shrink-0">
                {coverSrc ? (
                    <img src={coverSrc} alt="Portada" className="w-full h-full object-cover"/>
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-text-soft">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <rect x="3" y="3" width="18" height="18" rx="2"/>
                            <circle cx="8.5" cy="8.5" r="1.5"/>
                            <path d="M21 15l-5-5L5 21"/>
                        </svg>
                        <p className="text-xs">Sin foto de portada</p>
                    </div>
                )}
                <div className="absolute bottom-2 right-2 flex gap-1.5">
                    {coverSrc && (
                        <button 
                            aria-label="Eliminar foto de portada"
                            onClick={handleRemoveCover}
                            className="bg-black/50 hover:bg-red-500/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-lg transition"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                <polyline points="3 6 5 6 21 6"/>
                                <path d="M19 6l-1 14H6L5 6"/>
                                <path d="M10 11v6M14 11v6"/>
                                <path d="M9 6V4h6v2"/>
                            </svg>
                        </button>
                    )}
                    <label className="flex items-center gap-1 bg-black/50 hover:bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-lg cursor-pointer transition"
                        aria-label="Cambiar foto de portada">
                        {uploadingCover ? (
                            <div className="spinner-sm" style={{ width: '0.75rem', height: '0.75rem', borderTopColor: 'white', borderColor: 'rgba(255,255,255,0.3)' }}/>
                        ) : (
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                                <polyline points="17 8 12 3 7 8"/>
                                <line x1="12" y1="3" x2="12" y2="15"/>
                            </svg>
                        )}
                        {uploadingCover ? 'Subiendo...' : 'Cambiar'}
                        <input 
                            aria-label="Seleccionar foto de portada"
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={handleCoverChange}
                        />
                    </label>
                </div>
            </div>

            <div className="card rounded-2xl p-5">
                {editing ? (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            <div>
                                <label className="label">Fecha de salida</label>
                                <input 
                                    aria-label="Fecha de salida del viaje"
                                    type="date" 
                                    className="input px-3 py-2"
                                    value={editData.startDate || ''}
                                    onChange={e => setEditData({ ...editData, startDate: e.target.value })} 
                                />
                            </div>
                            <div>
                                <label className="label">Fecha de regreso</label>
                                <input 
                                    aria-label="Fecha de regreso del viaje"
                                    type="date" className="input px-3 py-2"
                                    value={editData.endDate || ''}
                                    onChange={e => setEditData({ ...editData, endDate: e.target.value })} 
                                />
                            </div>
                            <div>
                                <label className="label">Presupuesto (€)</label>
                                <input 
                                    aria-label="Presupuesto del viaje en euros"
                                    type="number" 
                                    className="input px-3 py-2"
                                    value={editData.budget || ''}
                                    onChange={e => setEditData({ ...editData, budget: parseFloat(e.target.value) })} 
                                />
                            </div>
                            <div>
                                <label className="label">Viajeros</label>
                                <input 
                                    aria-label="Número de viajeros"
                                    type="number" 
                                    min={1} 
                                    className="input px-3 py-2"
                                    value={editData.travelersCount || ''}
                                    onChange={e => setEditData({ ...editData, travelersCount: parseInt(e.target.value) })} 
                                />
                            </div>
                            <div>
                                <label className="label">Estilo del viaje</label>
                                <select 
                                    aria-label="Estilo del viaje"
                                    className="input px-3 py-2"
                                    value={editData.travelStyle || ''}
                                    onChange={e => setEditData({ ...editData, travelStyle: e.target.value })}
                                >
                                    {TRAVEL_STYLES.map(s => <option key={s}>{s}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button 
                                aria-label="Guardar cambios del viaje"
                                onClick={handleSave} 
                                className="btn text-sm py-2 px-5"
                            >
                                Guardar cambios
                            </button>
                            <button 
                                aria-label="Cancelar edición del viaje"
                                onClick={() => setEditing(false)}
                                className="text-sm text-text-secondary hover:text-text px-3 py-2 bg-primary-light rounded-xl transition"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        <InfoCard label="Fecha de salida"
                            value={new Date(trip.startDate).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                            icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M3 9h18M8 2v4M16 2v4" strokeLinecap="round"/></svg>}
                        />
                        <InfoCard label="Fecha de regreso"
                            value={new Date(trip.endDate).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                            icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M3 9h18M8 2v4M16 2v4" strokeLinecap="round"/><path d="M9 14l2 2 4-4" strokeLinecap="round"/></svg>}
                        />
                        <InfoCard label="Presupuesto"
                            value={`${trip.totalPrice ?? trip.budget ?? '—'}€`}
                            icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M12 6v2M12 16v2M9 9.5h4.5a1.5 1.5 0 010 3H10a1.5 1.5 0 000 3H15" strokeLinecap="round"/></svg>}
                        />
                        <InfoCard label="Viajeros"
                            value={String(trip.travelersCount ?? '—')}
                            icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="7" r="3"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17" cy="7" r="2.5"/><path d="M21 20c0-2.8-1.8-5-4-5.5" strokeLinecap="round"/></svg>}
                        />
                        <InfoCard label="Estilo del viaje"
                            value={trip.travelStyle ?? '—'}
                            icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z"/></svg>}
                        />
                    </div>
                )}
            </div>

            {collaborators.length > 0 && (
                <div className="card rounded-2xl p-4">
                    <p className="text-lg font-semibold text-text-secondary mb-3">
                        Colaboradores
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex -space-x-2">
                            {collaborators.map(c => (
                                <div key={c.id} title={c.name}
                                    className="w-9 h-9 rounded-full overflow-hidden shrink-0"
                                    style={{ border: '2px solid white' }}
                                >
                                    {c.avatar?.startsWith('http') || c.avatar?.startsWith('data:') ? (
                                        <img src={c.avatar} alt={c.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-accent flex items-center justify-center text-white text-sm font-medium">
                                            {c.avatar || c.name?.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        <p className="text-xs text-text-secondary">
                            {collaborators.map(c => c.name).join(', ')}
                        </p>
                    </div>
                </div>
            )}

            {!isCollaborator && <CollaboratorsPanel tripId={id!} />}
        
            {showDeleteModal && (
                <ConfirmModal
                    title="Eliminar viaje"
                    description={`¿Estás seguro de que quieres eliminar el viaje?`}
                    confirmLabel="Sí, eliminar"
                    loading={deletingTrip}
                    onCancel={() => setShowDeleteModal(false)}
                    onConfirm={async () => {
                        setDeletingTrip(true);
                        try {
                            await tripService.deleteTrip(id!);
                            navigate('/my-trips');
                        } catch {
                            setShowDeleteModal(false);
                        } finally {
                            setDeletingTrip(false);
                        }
                    }}
                />
            )}
        </div>
    );
};