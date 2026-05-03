import { useEffect, useState } from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
import { apiClient } from '../services/apiClient';
import { tripService } from '../services/tripService';
import { PlaceCard } from '../components/trips/PlaceCard';
import { PlaceForm } from '../components/reviews/PlaceForm';
import { TipForm } from '../components/reviews/TipForm';
import { TipCard } from '../components/reviews/TipCard';
import { PlusIcon } from '../components/itinerary/icons';
import type { Place, Tip, Activity } from '../types/reviews';

export const ReviewsPage = () => {
    const { id } = useParams();
    const { trip } = useOutletContext<any>();

    const [activeTab, setActiveTab] = useState<'places' | 'tips'>('places');
    const [places, setPlaces] = useState<Place[]>([]);
    const [tips, setTips] = useState<Tip[]>([]);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);
    const [showPlaceForm, setShowPlaceForm] = useState(false);
    const [showTipForm, setShowTipForm] = useState(false);
    const [savingPlace, setSavingPlace] = useState(false);
    const [savingTip, setSavingTip] = useState(false);

    useEffect(() => {
        if (!id) return;
        Promise.all([
            apiClient(`/trips/${id}/places`).then(d => setPlaces(Array.isArray(d) ? d : [])).catch(() => setPlaces([])),
            apiClient(`/trips/${id}/tips`).then(d => setTips(Array.isArray(d) ? d : [])).catch(() => setTips([])),
            tripService.getTripById(id).then((data: any) => {
                const acts: Activity[] = [];
                (data.trip || data).itineraries?.forEach((it: any) => {
                    it.activities?.forEach((act: any) => {
                        acts.push({ id: act.id, name: act.name, type: act.type, time: act.time, photos: act.photos || [] });
                    });
                });
                setActivities(acts);
            }).catch(() => {})
        ]).finally(() => setLoading(false));
    }, [id]);

    const handleAddPlace = async (data: any) => {
        setSavingPlace(true);
        try {
            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('type', data.type);
            formData.append('rating', String(data.rating));
            formData.append('review', data.review);
            formData.append('address', data.address);
            formData.append('dish', data.dish);
            data.photosToUse?.forEach((url: string) => formData.append('activityPhotos', url));
            data.extraPhotos?.forEach((file: File) => formData.append('photo', file));

            const newPlace = await apiClient(`/trips/${id}/places`, { method: 'POST', body: formData });
            setPlaces(prev => [newPlace, ...prev]);
            setShowPlaceForm(false);
        } catch {} finally { setSavingPlace(false); }
    };

    const handleAddTip = async (data: { category: string; content: string }) => {
        setSavingTip(true);
        try {
            const newTip = await apiClient(`/trips/${id}/tips`, { method: 'POST', body: JSON.stringify(data) });
            setTips(prev => [newTip, ...prev]);
            setShowTipForm(false);
        } catch {} finally { setSavingTip(false); }
    };

    const handleDeletePlace = async (placeId: string) => {
        try {
            await apiClient(`/trips/${id}/places/${placeId}`, { method: 'DELETE' });
            setPlaces(prev => prev.filter(p => p.id !== placeId));
        } catch {}
    };

    const handleDeleteTip = async (tipId: string) => {
        try {
            await apiClient(`/trips/${id}/tips/${tipId}`, { method: 'DELETE' });
            setTips(prev => prev.filter(t => t.id !== tipId));
        } catch {}
    };

    if (loading) return (
        <div className="flex items-center gap-2 py-16 justify-center">
            <div className="spinner-sm" /><span className="text-sm text-text-secondary">Cargando...</span>
        </div>
    );

    return (
        <div className="w-full max-w-5xl space-y-6">
            <div>
                <h2 className="text-2xl font-semibold text-text">Reseñas</h2>
                <p className="text-sm text-text-secondary mt-0.5">Añade lugares que has visitado y consejos para otros viajeros.</p>
            </div>

            <div className="flex gap-2 border-b border-border">
                {[
                    { key: 'places', label: `Lugares (${places.length})` },
                    { key: 'tips', label: `Consejos (${tips.length})` },
                ].map(t => (
                    <button aria-label={t.label} key={t.key} onClick={() => setActiveTab(t.key as any)}
                        className={`px-4 py-2.5 text-sm font-medium rounded-t-xl transition ${
                            activeTab === t.key ? 'bg-white border border-b-white border-border text-text -mb-px' : 'text-text-secondary hover:text-text'
                        }`}>{t.label}</button>
                ))}
            </div>

            {activeTab === 'places' && (
                <div className="space-y-4">
                    {!showPlaceForm && (
                        <button aria-label="Añadir lugar" onClick={() => setShowPlaceForm(true)} className="btn flex items-center gap-2">
                            <PlusIcon size={14} /> Añadir lugar
                        </button>
                    )}
                    {showPlaceForm && (
                        <PlaceForm activities={activities} saving={savingPlace} onSave={handleAddPlace} onClose={() => setShowPlaceForm(false)} />
                    )}
                    {places.length === 0 ? (
                        <div className="empty-state rounded-2xl"><p className="text-text-soft text-sm">Aún no has añadido ningún lugar.</p></div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {places.map(place => <PlaceCard key={place.id} place={place} onDelete={() => handleDeletePlace(place.id)} />)}
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'tips' && (
                <div className="space-y-4">
                    {!showTipForm && (
                        <button aria-label="Añadir consejo" onClick={() => setShowTipForm(true)} className="btn flex items-center gap-2">
                            <PlusIcon size={14} /> Añadir consejo
                        </button>
                    )}
                    {showTipForm && (
                        <TipForm saving={savingTip} onSave={handleAddTip} onClose={() => setShowTipForm(false)} />
                    )}
                    {tips.length === 0 ? (
                        <div className="empty-state rounded-2xl"><p className="text-text-soft text-sm">Aún no has añadido ningún consejo.</p></div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {tips.map(tip => <TipCard key={tip.id} tip={tip} onDelete={() => handleDeleteTip(tip.id)} />)}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};