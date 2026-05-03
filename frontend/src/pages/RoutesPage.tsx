import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { predefinedRoutes } from '../data/predefinedRoutes';
import { useAuth } from '../context/AuthContext';
import { DayCard } from '../components/trips/DayCard';
import { tripService } from '../services/tripService';

export const RoutePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [selectedDay, setSelectedDay] = useState<number | null>(null);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const route = predefinedRoutes.find(r => r.id === id);

    if (!route) return (
        <div className="min-h-screen bg-bg flex items-center justify-center">
            <div className="text-center">
                <span className="text-6xl">🗺️</span>
                <p className="mt-4 text-text-secondary">Ruta no encontrada.</p>
            </div>
        </div>
    );

    const handleUseTemplate = async () => {
        if (!user) { navigate('/login'); return; }
        setSaving(true);
        try {
            const today = new Date();
            const endDate = new Date(today);
            endDate.setDate(today.getDate() + route.days - 1);

            const response = await tripService.createTrip({
                destination: route.destination.includes(',')
                    ? route.destination
                    : `${route.destination}, ${route.destination}`,
                origin: '',
                startDate: today.toISOString().split('T')[0],
                endDate: endDate.toISOString().split('T')[0],
                budget: 0,
                currency: 'EUR',
                people: 1,
                travelMode: 'Aventura'
            });

            const trip = response.trip;

            const tripData = await tripService.getTripById(trip.id);
            const itineraries = tripData.itineraries || [];

            for (const day of route.itinerary) {
                const itineraryDay = itineraries.find((it: any) => it.day === day.dayNumber);
                if (!itineraryDay) continue;

                for (const event of day.events) {
                    await tripService.addActivity(itineraryDay.id, {
                        name: event.title,
                        type: event.type,
                        time: event.time,
                        notes: event.description,
                        lat: null,
                        lon: null
                    });
                }
            }

            setSaved(true);
        } catch (error) {
            console.error('Error al guardar plantilla:', error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-bg">

            {/* ── HERO ── */}
            <div className="relative h-72 md:h-150 overflow-hidden">
                <img src={route.cover} alt={route.title} className="w-full h-full object-cover" />
                <div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.25) 55%, transparent 100%)' }}
                />
                <button
                    aria-label="Volver"
                    onClick={() => navigate(-1)}
                    className="absolute top-10 left-6 flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white text-xs font-medium px-4 py-2 rounded-xl transition"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                        <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Volver
                </button>
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10">
                    <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-2">{route.title}</h1>
                    <p className="text-white/75 text-sm max-w-xl mb-4">{route.description}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                        {[route.destination, `${route.days} Días`, route.tag].map(tag => (
                            <span
                                key={tag}
                                className="text-xs text-white font-medium px-3 py-1 rounded-full backdrop-blur-sm"
                                style={{
                                    background: 'rgba(255,255,255,0.15)',
                                    border: '1px solid rgba(255,255,255,0.3)',
                                }}
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── ITINERARIO ── */}
            <div className="max-w-5xl mx-auto px-4 py-10">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text">
                            <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3" strokeLinecap="round" strokeLinejoin="round"/>
                            <rect x="9" y="11" width="14" height="10" rx="2"/>
                        </svg>
                        <h2 className="text-xl font-bold text-text">Itinerario</h2>
                    </div>
                    <button
                        aria-label="Guardar Plantilla"
                        onClick={handleUseTemplate}
                        disabled={saving || saved}
                        className={`btn flex items-center gap-2 px-3 py-2 text-sm transition ${saved ? 'bg-primary text-white' : ''}`}
                    >
                        {saved ? (
                            <>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <polyline points="20 6 9 17 4 12" strokeLinecap="round"/>
                                </svg>
                                Guardado
                            </>
                        ) : saving ? (
                            <>
                                <div className="spinner-sm" style={{ borderTopColor: 'white', borderColor: 'rgba(255,255,255,0.3)' }}/>
                                Guardando...
                            </>
                        ) : (
                            <>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                Guardar Plantilla
                            </>
                        )}
                    </button>
                </div>

                {/* Sidebar + Cards alineadas */}
                <div className="flex flex-col gap-0">
                    {route.itinerary.map((day, idx) => {
                        const isSelected = selectedDay === day.dayNumber;
                        const isLast = idx === route.itinerary.length - 1;

                        return (
                            <div key={day.dayNumber} className="flex gap-6 items-start">

                                {/* ── Sidebar column ── */}
                                <div className="hidden md:flex flex-col items-center shrink-0 w-16 pt-5">
                                    {/* Dot + label */}
                                    <div
                                        className="flex flex-col items-center gap-1.5 cursor-pointer"
                                        onClick={() => setSelectedDay(isSelected ? null : day.dayNumber)}
                                    >
                                        <div
                                            className="w-3.5 h-3.5 rounded-full border-2 transition-all duration-200"
                                            style={{
                                                borderColor: isSelected ? '#3b82f6' : '#cbd5e1',
                                                background: isSelected ? '#3b82f6' : 'white',
                                                transform: isSelected ? 'scale(1.25)' : 'scale(1)',
                                            }}
                                        />
                                        <span className={`text-xs transition-colors ${isSelected ? 'text-blue-500 font-semibold' : 'text-text-secondary'}`}>
                                            Día {day.dayNumber}
                                        </span>
                                    </div>
                                    {/* Línea conectora hacia abajo */}
                                    {!isLast && (
                                        <div
                                            className="w-px flex-1 mt-1"
                                            style={{
                                                minHeight: isSelected ? '280px' : '120px',
                                                background: '#e2e8f0',
                                                transition: 'min-height 0.3s ease',
                                            }}
                                        />
                                    )}
                                </div>

                                {/* ── Card ── */}
                                <div className="flex-1 mb-4">
                                    <DayCard
                                        day={day}
                                        isSelected={isSelected}
                                        onSelect={() => setSelectedDay(isSelected ? null : day.dayNumber)}
                                    />
                                </div>

                            </div>
                        );
                    })}
                </div>

            </div>
        </div>
    );
};