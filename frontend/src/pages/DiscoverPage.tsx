import { useParams, useOutletContext } from 'react-router-dom';
import { ITrip } from '../types/ITrip';
import { useDiscover } from '../hooks/useDiscover';
import { DiscoverMap } from '../components/discover/DiscoverMap';
import { AddToCalendarModal } from '../components/discover/AddToCalendarModal';
import { useState } from 'react';

type Tab = 'lugares' | 'gastronomia' | 'eventos' | 'tours' | 'faq';

export const DiscoverPage = () => {
    const { id: tripId } = useParams<{ id: string }>();
    const { trip } = useOutletContext<{ trip: ITrip | null }>();
    const [tab, setTab] = useState<Tab>('lugares');

    const {
        data, loading, filter, setFilter,
        hotelCoords, itineraries,
        showModal, selectedItem, selectedDay, setSelectedDay,
        selectedTime, setSelectedTime,
        places, restaurants, eventos, tours, faq,
        visiblePlaces, visibleRestaurants,
        handleAddToCalendar, handleConfirmAdd, closeModal
    } = useDiscover(tripId, trip);

    const city = trip?.destination?.split(',')[0] || '';

    const tabs: { key: Tab; label: string }[] = [
        { key: 'lugares', label: 'Sitios de interés' },
        { key: 'gastronomia', label: 'Gastronomía' },
        { key: 'eventos', label: 'Eventos' },
        { key: 'tours', label: 'Tours' },
        { key: 'faq', label: 'Preguntas frecuentes' },
    ];

    const mapsLink = (name: string) =>
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + ' ' + city)}`;

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="spinner" style={{ width: '2rem', height: '2rem' }} />
            <p className="text-sm text-text-secondary">Cargando recomendaciones para {city}...</p>
        </div>
    );

    return (
        <div className="space-y-5">
            <div>
                <h1 className="text-2xl font-semibold text-text">Qué ver y hacer</h1>
                <p className="text-sm text-text-secondary mt-0.5">Explora {city} en el mapa</p>
            </div>

            {eventos.length > 0 && (
                <div className="space-y-2">
                    {eventos.map((ev: any, i: number) => (
                        <div key={i} className="flex items-start gap-3 bg-purple-50 border border-purple-200 rounded-xl px-4 py-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center shrink-0">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2">
                                    <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M3 9h18M8 2v4M16 2v4" />
                                </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-purple-900">
                                    Durante tu estancia se celebra: {ev.nombre}
                                </p>
                                <p className="text-xs text-purple-700 mt-0.5">
                                    {ev.descripcion}
                                </p>
                                <p className="text-xs text-purple-500 mt-0.5">
                                    {ev.fechas} · {ev.ubicacion}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="flex items-center gap-2 flex-wrap">
                {[
                    { key: 'all', label: 'Todo' },
                    { key: 'places', label: 'Lugares' },
                    { key: 'restaurants', label: 'Restaurantes' },
                ].map(f => (
                    <button 
                        aria-label={f.label} 
                        key={f.key} 
                        onClick={() => setFilter(f.key as any)}
                        className={`px-4 py-1.5 rounded-xl text-sm font-medium transition ${
                            filter === f.key ? 'bg-primary text-white' : 'bg-card text-text-secondary hover:text-text'
                        }`}
                        style={filter !== f.key ? { border: '2px solid white', boxShadow: '3px 3px 0px rgba(201,176,160,0.4)' } : {}}
                    >
                        {f.label}
                    </button>
                ))}
                <span className="text-xs text-text-secondary ml-auto">
                    {visiblePlaces.length} lugares · {visibleRestaurants.length} restaurantes
                </span>
            </div>

            <DiscoverMap
                coords={data?.coords || null}
                places={visiblePlaces}
                restaurants={visibleRestaurants}
                hotelCoords={hotelCoords}
                city={city}
                onAddToCalendar={handleAddToCalendar}
            />

            <div className="flex gap-1 border-b border-border overflow-x-auto">
                {tabs.map(t => (
                    <button 
                        key={t.key} 
                        aria-label={t.label} 
                        onClick={() => setTab(t.key)}
                        className={`px-4 py-2.5 text-sm font-medium rounded-t-xl transition whitespace-nowrap shrink-0 ${
                            tab === t.key 
                            ? 'bg-white border border-b-white border-border text-text -mb-px' 
                            : 'text-text-secondary hover:text-text'
                        }`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {tab === 'lugares' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {places.length === 0 && <p className="text-sm text-text-soft col-span-2 text-center py-8">No se encontraron lugares de interés</p>}
                    {places.slice(0, 12).map((p: any) => (
                        <div key={p.id} className="card-lg rounded-2xl p-4 flex items-start gap-3">
                            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2">
                                    <circle cx="12" cy="10" r="3" /><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                                </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-text text-sm">
                                    {p.name}
                                </p>
                                <p className="text-xs text-text-soft capitalize mt-0.5">
                                    {p.type}
                                </p>
                                {p.description && 
                                    <p className="text-xs text-text-secondary mt-1">
                                        {p.description}
                                    </p>
                                }
                                {p.opening_hours !== 'No disponible' && 
                                    <p className="text-xs text-text-soft mt-1">
                                        {p.opening_hours}
                                    </p>
                                }
                                <div className="flex gap-2 mt-2">
                                    {p.wikipedia && 
                                        <a 
                                            href={p.wikipedia} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="text-xs text-primary hover:underline"
                                        >
                                            Wikipedia
                                        </a>
                                    }
                                    <a 
                                        href={mapsLink(p.name)} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="text-xs text-primary hover:underline"
                                    >
                                        Google Maps
                                    </a>
                                </div>
                            </div>
                            <button 
                                aria-label={`Añadir ${p.name}`} 
                                onClick={() => handleAddToCalendar(p, false)}
                                className="text-xs text-primary font-medium shrink-0 hover:underline"
                            >
                                + Añadir
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {tab === 'gastronomia' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {restaurants.length === 0 && <p className="text-sm text-text-soft col-span-2 text-center py-8">No se encontraron restaurantes</p>}
                    {restaurants.slice(0, 12).map((r: any) => (
                        <div key={r.id} className="card-lg rounded-2xl p-4 flex items-start gap-3">
                            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center shrink-0">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2">
                                    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2M7 2v20M21 15V2a5 5 0 00-5 5v6h3.5M19.5 13V22" />
                                </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-text text-sm">
                                    {r.name}
                                </p>
                                <p className="text-xs text-text-soft mt-0.5">
                                    {r.cuisine?.join(', ')}
                                </p>
                                <p className="text-xs text-text-secondary mt-0.5">
                                    {r.address}
                                </p>
                                <p className="text-xs text-text-secondary mt-0.5">
                                    {r.price}
                                </p>
                                {r.etiquetas?.length > 0 && (
                                    <div className="flex gap-1 flex-wrap mt-1.5">
                                        {r.etiquetas.map((tag: string, i: number) => (
                                            <span key={i} className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">{tag}</span>
                                        ))}
                                    </div>
                                )}
                                <div className="flex gap-2 mt-2">
                                    {r.website && <a href={r.website} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">Web</a>}
                                    <a href={mapsLink(r.name)} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">Google Maps</a>
                                </div>
                            </div>
                            <button 
                                aria-label={`Añadir ${r.name}`} 
                                onClick={() => handleAddToCalendar(r, true)}
                                className="text-xs text-primary font-medium shrink-0 hover:underline"
                            >
                                + Añadir
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {tab === 'eventos' && (
                <div className="space-y-3">
                    {eventos.length === 0 ? (
                        <div className="card-lg rounded-2xl p-6 text-center">
                            <p className="text-sm text-text-soft">No se encontraron eventos durante las fechas de tu viaje</p>
                        </div>
                    ) : eventos.map((ev: any, i: number) => (
                        <div key={i} className="card-lg rounded-2xl p-4 flex items-start gap-3">
                            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center shrink-0">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2">
                                    <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M3 9h18M8 2v4M16 2v4" />
                                </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-text text-sm">{ev.nombre}</p>
                                <p className="text-xs text-text-secondary mt-0.5">{ev.descripcion}</p>
                                <div className="flex gap-1 flex-wrap mt-1.5">
                                    <span className="text-[10px] bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded-full">
                                        {ev.fechas}
                                    </span>
                                    <span className="text-[10px] bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded-full capitalize">
                                        {ev.tipo}
                                    </span>
                                </div>
                                {ev.ubicacion && 
                                    <p className="text-xs text-text-soft mt-1">
                                        {ev.ubicacion}
                                    </p>
                                }
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {tab === 'tours' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {tours.length === 0 ? (
                        <p className="text-sm text-text-soft col-span-2 text-center py-8">
                            No se encontraron tours sugeridos
                        </p>
                    ) : tours.map((tour: any, i: number) => (
                        <div key={i} className="card-lg rounded-2xl p-4 space-y-2">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center shrink-0">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                                        <path d="M3 12h4l3-9 4 18 3-9h4" />
                                    </svg>
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="font-semibold text-text text-sm">
                                        {tour.nombre}
                                    </p>
                                    <p className="text-xs text-text-soft">
                                        {tour.duracion} · {tour.tipo}
                                    </p>
                                </div>
                            </div>
                            <p className="text-xs text-text-secondary">{tour.descripcion}</p>
                            {tour.lugares?.length > 0 && (
                                <div className="flex gap-1 flex-wrap">
                                    {tour.lugares.map((l: string, j: number) => (
                                        <span 
                                            key={j} 
                                            className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full"
                                        >
                                            {l}
                                        </span>
                                    ))}
                                </div>
                            )}
                            {tour.lugares?.[0] && (
                                <a 
                                    href={mapsLink(tour.lugares[0])} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-xs text-primary hover:underline inline-block mt-1"
                                >
                                    Ver recorrido en Google Maps
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {tab === 'faq' && (
                <div className="space-y-3">
                    {faq.length === 0 ? (
                        <p className="text-sm text-text-soft text-center py-8">No hay preguntas frecuentes disponibles</p>
                    ) : faq.map((q: any, i: number) => (
                        <details key={i} className="card-lg rounded-2xl overflow-hidden group">
                            <summary className="px-4 py-3 cursor-pointer flex items-center justify-between text-sm font-semibold text-text hover:bg-primary-lighter transition">
                                {q.pregunta}
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                    className="shrink-0 transition-transform group-open:rotate-180"><path d="M6 9l6 6 6-6" /></svg>
                            </summary>
                            <div className="px-4 pb-3">
                                <p className="text-sm text-text-secondary leading-relaxed">
                                    {q.respuesta}
                                </p>
                            </div>
                        </details>
                    ))}
                </div>
            )}

            {showModal && selectedItem && (
                <AddToCalendarModal
                    item={selectedItem}
                    itineraries={itineraries}
                    selectedDay={selectedDay}
                    selectedTime={selectedTime}
                    onDayChange={setSelectedDay}
                    onTimeChange={setSelectedTime}
                    onConfirm={handleConfirmAdd}
                    onClose={closeModal}
                />
            )}
        </div>
    );
};