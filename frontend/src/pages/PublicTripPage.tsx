import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePublicTrip } from '../hooks/usePublicTrip';
import { CommentsPanel } from '../components/community/CommentsPanel';
import { CloneModal } from '../components/community/CloneModal';
import { BuildingIcon } from '../components/itinerary/icons';
import { PlaceCard, placeTypeConfig } from '../components/trips/PlaceCard';
import { TransactionList } from '../components/budget/TransactionList';
import { CategoryBreakdown } from '../components/budget/CategoryBreakdown';
import { DonutChart } from '../components/budget/DonutChart';

const tipCategoryColors: Record<string, { bg: string; text: string; icon: string; border: string }> = {
    clima:      { bg: 'bg-sky-50',    text: 'text-sky-600',    icon: '🌤', border: '#0284c7' },
    transporte: { bg: 'bg-amber-50',  text: 'text-amber-600',  icon: '🚌', border: '#d97706' },
    cultura:    { bg: 'bg-purple-50', text: 'text-purple-600', icon: '🏛', border: '#9333ea' },
    dinero:     { bg: 'bg-green-50',  text: 'text-green-600',  icon: '💶', border: '#16a34a' },
    seguridad:  { bg: 'bg-red-50',    text: 'text-red-600',    icon: '🛡', border: '#dc2626' },
};

export const PublicTripPage = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const {
        trip, loading, navigate,
        showComments, setShowComments, newComment, setNewComment, commentsLoading,
        isLiked, isSaved, showCloneModal, setShowCloneModal,
        cloneStart, setCloneStart, cloneEnd, setCloneEnd, cloning,
        activeDay, setActiveDay, activeSection, setActiveSection,
        getDays, handleLike, handleSave, handleComment, handleClone, getTotalExpenses
    } = usePublicTrip(id);

    const totalExpenses = getTotalExpenses();

    if (loading) return (
        <div className="min-h-screen bg-bg flex items-center justify-center gap-3">
            <div className="spinner" />
            <p className="text-text-secondary text-sm">Cargando viaje...</p>
        </div>
    );

    if (!trip) return null;

    const sections = [
        { key: 'itinerary', label: 'Itinerario' },
        { key: 'hotels',    label: 'Alojamiento' },
        { key: 'places',    label: 'Reseñas' },
        { key: 'expenses',  label: 'Gastos reales' },
        { key: 'tips',      label: 'Consejos' },
    ];

    return (
        <div className="min-h-screen bg-bg">

            {/* ── HERO ── */}
            <div className="relative h-72 md:h-96 overflow-hidden">
                {trip.coverImage ? (
                    <img
                        src={trip.coverImage}
                        alt={trip.destination}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-primary-light flex items-center justify-center">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-primary opacity-30">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                            <circle cx="12" cy="10" r="3" />
                        </svg>
                    </div>
                )}
                <div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)' }}
                />

                <button
                    aria-label="Volver"
                    onClick={() => navigate(-1)}
                    className="absolute top-8 left-4 md:top-12 md:left-6 flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white text-xs font-medium px-4 py-2 rounded-xl transition z-10"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                        <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Volver
                </button>

                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-10">
                    <div className="max-w-5xl mx-auto">
                        <p className="text-white/60 text-sm mb-1">{trip.country}</p>
                        <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">
                            {trip.destination}
                        </h1>
                        <div className="flex items-center gap-2 md:gap-3 flex-wrap text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full overflow-hidden bg-primary flex items-center justify-center text-xs font-bold text-white shrink-0">
                                    {trip.user?.avatar?.startsWith('http') || trip.user?.avatar?.startsWith('data:') ? (
                                        <img
                                            src={trip.user.avatar}
                                            alt={trip.user.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span>
                                            {trip.user?.avatar || trip.user?.name?.charAt(0).toUpperCase() || '?'}
                                        </span>
                                    )}
                                </div>
                                <span className="text-white/80">
                                    por{' '}
                                    <Link
                                        to={`/user/${trip.user?.id}`}
                                        className="font-semibold text-white hover:underline"
                                    >
                                        {trip.user?.name}
                                    </Link>
                                </span>
                            </div>
                            <span className="text-white/40 hidden sm:inline">·</span>
                            <span className="text-white/70">
                                {getDays(trip.startDate, trip.endDate)} días
                            </span>
                            <span className="text-white/40 hidden sm:inline">·</span>
                            <span className="text-white/70">
                                {trip.travelersCount} viajero{trip.travelersCount > 1 ? 's' : ''}
                            </span>
                        </div>

                        {/* Botones de acción */}
                        <div className="flex gap-2 mt-4 flex-wrap">
                            <button
                                aria-label={isLiked ? 'Quitar me gusta' : 'Me gusta'}
                                onClick={handleLike}
                                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition backdrop-blur-sm ${
                                    isLiked
                                        ? 'bg-red-500 text-white'
                                        : 'bg-white/20 text-white hover:bg-white/30'
                                }`}
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill={isLiked ? 'white' : 'none'} stroke="white" strokeWidth="2">
                                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                                </svg>
                                {trip._count?.likes || 0}
                            </button>
                            <button
                                aria-label={isSaved ? 'Quitar de guardados' : 'Guardar'}
                                onClick={handleSave}
                                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition backdrop-blur-sm ${
                                    isSaved
                                        ? 'bg-primary text-white'
                                        : 'bg-white/20 text-white hover:bg-white/30'
                                }`}
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill={isSaved ? 'white' : 'none'} stroke="white" strokeWidth="2">
                                    <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
                                </svg>
                                <span className="hidden sm:inline">
                                    {isSaved ? 'Guardado' : 'Guardar'}
                                </span>
                            </button>
                            <button
                                aria-label="Ver comentarios"
                                onClick={() => setShowComments(true)}
                                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white transition"
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                                </svg>
                                {trip.comments?.length || 0}
                            </button>
                            <button
                                aria-label="Usar este viaje"
                                onClick={() => setShowCloneModal(true)}
                                className="btn px-4 py-2 text-sm"
                            >
                                <span className="hidden sm:inline">Usar este viaje →</span>
                                <span className="sm:hidden">Usar →</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── CONTENIDO ── */}
            <div className="max-w-5xl mx-auto px-4 py-10">

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-10">
                    {[
                        { label: 'Duración', value: `${getDays(trip.startDate, trip.endDate)} días` },
                        { label: 'Presupuesto', value: trip.budget ? `${trip.budget}€` : '—' },
                        { label: 'Gasto real', value: totalExpenses > 0 ? `${totalExpenses.toFixed(0)}€` : '—' },
                        { label: 'Estilo', value: trip.travelStyle || '—' },
                    ].map(s => (
                        <div key={s.label} className="card rounded-2xl p-4 text-center">
                            <p className="text-xs text-text-soft mb-1">{s.label}</p>
                            <p className="font-semibold text-text text-sm">{s.value}</p>
                        </div>
                    ))}
                </div>

                <div className="flex gap-2 mb-8 border-b border-border overflow-x-auto pb-0">
                    {sections.map(s => (
                        <button
                            aria-label={s.label}
                            key={s.key}
                            onClick={() => setActiveSection(s.key as any)}
                            className={`px-4 py-2.5 text-sm font-medium rounded-t-xl whitespace-nowrap shrink-0 transition ${
                                activeSection === s.key
                                    ? 'bg-white border border-b-white border-border text-text -mb-px'
                                    : 'text-text-secondary hover:text-text'
                            }`}
                        >
                            {s.label}
                        </button>
                    ))}
                </div>

                {/* ── ITINERARIO ── */}
                {activeSection === 'itinerary' && (
                    <div className="flex flex-col gap-0">
                        {trip.itineraries?.length === 0 ? (
                            <p className="text-text-soft text-sm">No hay itinerario disponible.</p>
                        ) : trip.itineraries?.map((day: any, idx: number) => {
                            const isSelected = activeDay === day.day;
                            const isLast = idx === trip.itineraries.length - 1;
                            const activities: any[] = Array.isArray(day.activities)
                                ? day.activities
                                : (typeof day.activities === 'string' ? JSON.parse(day.activities) : []);
                            return (
                                <div key={day.id} className="flex gap-4 md:gap-6 items-start">
                                    <div className="hidden md:flex flex-col items-center shrink-0 w-16 pt-5">
                                        <div
                                            className="flex flex-col items-center gap-1.5 cursor-pointer"
                                            onClick={() => activities.length > 0 && setActiveDay(isSelected ? null : day.day)}
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
                                                Día {day.day}
                                            </span>
                                        </div>
                                        {!isLast && (
                                            <div
                                                className="w-px flex-1 mt-1"
                                                style={{
                                                    minHeight: isSelected && activities.length > 0 ? '280px' : '80px',
                                                    background: '#e2e8f0',
                                                    transition: 'min-height 0.3s ease',
                                                }}
                                            />
                                        )}
                                    </div>

                                    <div
                                        className="flex-1 mb-4"
                                        onClick={() => activities.length > 0 && setActiveDay(isSelected ? null : day.day)}
                                        style={{
                                            cursor: activities.length > 0 ? 'pointer' : 'default',
                                            borderRadius: '1rem',
                                            overflow: 'hidden',
                                            border: isSelected ? '2px solid #3b82f6' : '1.5px solid white',
                                            boxShadow: isSelected ? '0 8px 32px rgba(59,130,246,0.18)' : '0 2px 12px rgba(0,0,0,0.08)',
                                            background: isSelected ? '#eff6ff' : 'white',
                                            transition: 'all 0.3s',
                                        }}
                                    >
                                        <div className="p-4 flex flex-col gap-3">
                                            <div>
                                                <p className="text-[11px] text-text-secondary font-medium mb-0.5">
                                                    Día {day.day} · {new Date(day.date).toLocaleDateString('es-ES', { weekday: 'long', day: '2-digit', month: 'short' })}
                                                </p>
                                                <p className="font-bold text-text text-base leading-snug">
                                                    {day.title || `Día ${day.day}`}
                                                </p>
                                                {day.notes && (
                                                    <p className="text-xs text-text-secondary mt-1">{day.notes}</p>
                                                )}
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                {activities.slice(0, isSelected ? activities.length : 3).map((act: any, i: number) => {
                                                    const tc = placeTypeConfig[act.type] ?? placeTypeConfig['Otro'];
                                                    return (
                                                        <div key={i} className="flex items-center gap-2 text-xs">
                                                            <span className={`flex items-center justify-center w-6 h-6 rounded-lg shrink-0 ${tc.bg} ${tc.text}`}>
                                                                <tc.Icon size={11} />
                                                            </span>
                                                            <div className="flex items-center gap-1.5 min-w-0">
                                                                {act.time && (
                                                                    <span className="text-text-secondary text-[10px] shrink-0 font-medium">
                                                                        {act.time}
                                                                    </span>
                                                                )}
                                                                <span className="text-text truncate">{act.name}</span>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                                {!isSelected && activities.length > 3 && (
                                                    <p className="text-[10px] text-text-secondary pl-1">
                                                        +{activities.length - 3} más
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {isSelected && activities.length > 0 && (
                                            <div className="border-t border-blue-100 px-4 pb-4 pt-3 flex flex-col gap-4">
                                                {activities.map((act: any, i: number) => (
                                                    <div key={i} className="flex gap-3 items-start">
                                                        {act.photos?.[0] && (
                                                            <div className="w-24 md:w-32 h-20 md:h-24 rounded-xl overflow-hidden shrink-0">
                                                                <img
                                                                    src={act.photos[0]}
                                                                    alt={act.name}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </div>
                                                        )}
                                                        <div className="flex flex-col gap-1 min-w-0">
                                                            <div className="flex items-center gap-2 flex-wrap">
                                                                {act.time && (
                                                                    <span className="text-[10px] text-text-secondary font-medium">
                                                                        {act.time}
                                                                    </span>
                                                                )}
                                                                <span className="text-xs font-semibold text-text">
                                                                    {act.name}
                                                                </span>
                                                            </div>
                                                            {act.notes && (
                                                                <p className="text-xs text-text-secondary leading-relaxed">
                                                                    {act.notes}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* ── ALOJAMIENTO ── */}
                {activeSection === 'hotels' && (
                    <div className="space-y-4">
                        {trip.hotels?.length === 0 ? (
                            <p className="text-text-soft text-sm">No hay alojamiento registrado.</p>
                        ) : trip.hotels?.map((h: any) => (
                            <div key={h.id} className="card rounded-2xl p-4 flex flex-col sm:flex-row gap-4 items-start">
                                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center shrink-0 text-blue-500">
                                    <BuildingIcon size={22} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-text">{h.name}</p>
                                    {h.address && <p className="text-xs text-text-soft mt-0.5 truncate">{h.address}</p>}
                                    <div className="flex gap-3 mt-2 text-xs text-text-secondary flex-wrap">
                                        <span>Check-in: {new Date(h.checkIn).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}</span>
                                        <span>Check-out: {new Date(h.checkOut).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}</span>
                                        {h.price && <span className="font-medium text-text">{h.price}{h.currency}</span>}
                                    </div>
                                </div>
                                <a
                                    href={`https://www.booking.com/searchresults.es.html?ss=${encodeURIComponent(h.name)}&lang=es`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn text-xs px-3 py-1.5 shrink-0"
                                    aria-label="Ver hotel"
                                >
                                    Ver hotel →
                                </a>
                            </div>
                        ))}
                    </div>
                )}

                {/* ── RESEÑAS ── */}
                {activeSection === 'places' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {trip.places?.length === 0 ? (
                            <p className="text-text-soft text-sm col-span-3">No hay reseñas registradas.</p>
                        ) : trip.places?.map((p: any) => (
                            <PlaceCard key={p.id} place={p} />
                        ))}
                    </div>
                )}

                {/* ── GASTOS REALES ── */}
                {activeSection === 'expenses' && (() => {
                    const flightsTotal = trip.flights?.reduce((acc: number, f: any) => acc + (f.price || 0), 0) || 0;
                    const hotelsTotal = trip.hotels?.reduce((acc: number, h: any) => acc + (h.price || 0), 0) || 0;
                    const activityExpensesList: any[] = [];
                    (trip.itineraries || []).forEach((day: any) => {
                        (Array.isArray(day.activities) ? day.activities : []).forEach((act: any) => {
                            if (act.amount) {
                                activityExpensesList.push({
                                    id: act.id, name: act.name,
                                    category: act.type === 'Restaurante' ? 'Comida' : act.type === 'Compras' ? 'Compras' : 'Actividades',
                                    amount: parseFloat(act.amount) || 0, date: day.date
                                });
                            }
                        });
                    });
                    const CATEGORIES = ['Vuelos', 'Hoteles', 'Comida', 'Actividades', 'Transporte', 'Compras', 'Otros'];
                    const manualExpenses = trip.expenses || [];
                    const activitiesTotal = activityExpensesList.reduce((acc: number, a: any) => acc + a.amount, 0);
                    const manualTotal = manualExpenses.reduce((acc: number, e: any) => acc + (e.amount || 0), 0);
                    const totalSpent = flightsTotal + hotelsTotal + activitiesTotal + manualTotal;
                    const byCategory = CATEGORIES.map(cat => {
                        let total = 0;
                        if (cat === 'Vuelos') total = flightsTotal;
                        else if (cat === 'Hoteles') total = hotelsTotal;
                        else {
                            total = manualExpenses.filter((e: any) => e.category === cat).reduce((acc: number, e: any) => acc + (e.amount || 0), 0)
                                + activityExpensesList.filter((a: any) => a.category === cat).reduce((acc: number, a: any) => acc + a.amount, 0);
                        }
                        return { category: cat, total };
                    }).filter(c => c.total > 0);
                    const allTransactions = [
                        ...(trip.flights?.map((f: any) => ({ id: f.id, name: `${f.originCity} → ${f.destCity}`, category: 'Vuelos', amount: f.price || 0, date: f.departure, fixed: true })) || []),
                        ...(trip.hotels?.map((h: any) => ({ id: h.id, name: h.name, category: 'Hoteles', amount: h.price || 0, date: h.checkIn, fixed: true })) || []),
                        ...activityExpensesList.map(a => ({ ...a, fixed: true })),
                        ...manualExpenses.map((e: any) => ({ ...e, fixed: true }))
                    ].sort((a: any, b: any) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());

                    return (
                        <div className="space-y-6">
                            {allTransactions.length === 0 ? (
                                <p className="text-text-soft text-sm">No hay gastos registrados.</p>
                            ) : (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="card-lg rounded-2xl p-5 flex flex-col items-center justify-center">
                                            <DonutChart spent={totalSpent} budget={trip.budget || 0} />
                                            <div className="flex gap-4 mt-4 text-center">
                                                <div>
                                                    <p className="text-xs text-text-soft">Total gastado</p>
                                                    <p className="text-sm font-bold text-text">{totalSpent.toFixed(0)}€</p>
                                                </div>
                                                <div className="w-px bg-border" />
                                                <div>
                                                    <p className="text-xs text-text-soft">Presupuesto</p>
                                                    <p className="text-sm font-bold text-text">{trip.budget || 0}€</p>
                                                </div>
                                            </div>
                                        </div>
                                        <CategoryBreakdown categories={byCategory} totalSpent={totalSpent} />
                                    </div>
                                    <TransactionList transactions={allTransactions} onDelete={() => {}} />
                                </>
                            )}
                        </div>
                    );
                })()}

                {/* ── CONSEJOS ── */}
                {activeSection === 'tips' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {trip.tips?.length === 0 ? (
                            <p className="text-text-soft text-sm col-span-2">No hay consejos registrados.</p>
                        ) : trip.tips?.map((tip: any) => {
                            const style = tipCategoryColors[tip.category] || { bg: 'bg-gray-50', text: 'text-gray-600', icon: '💡', border: '#9ca3af' };
                            return (
                                <div
                                    key={tip.id}
                                    className={`${style.bg} rounded-2xl p-4`}
                                    style={{ border: `1.5px solid ${style.border}` }}
                                >
                                    <p className={`text-sm font-semibold capitalize mb-1 ${style.text}`}>
                                        {tip.category}
                                    </p>
                                    <p className="text-sm text-text leading-relaxed">{tip.content}</p>
                                </div>
                            );
                        })}
                    </div>
                )}

                {trip.photos?.length > 0 && (
                    <div className="mt-10">
                        <h3 className="font-semibold text-text mb-4">Fotos del viaje</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {trip.photos.map((p: any) => (
                                <div key={p.id} className="aspect-square rounded-2xl overflow-hidden">
                                    <img
                                        src={p.url}
                                        alt="Foto del viaje"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {showComments && (
                <CommentsPanel
                    comments={trip.comments}
                    user={user}
                    newComment={newComment}
                    loading={commentsLoading}
                    onNewCommentChange={setNewComment}
                    onSubmit={handleComment}
                    onClose={() => setShowComments(false)}
                />
            )}

            {showCloneModal && (
                <CloneModal
                    cloneStart={cloneStart}
                    cloneEnd={cloneEnd}
                    cloning={cloning}
                    onStartChange={setCloneStart}
                    onEndChange={setCloneEnd}
                    onClone={handleClone}
                    onClose={() => setShowCloneModal(false)}
                />
            )}
        </div>
    );
};