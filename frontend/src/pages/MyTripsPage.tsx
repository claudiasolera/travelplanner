import React, { useEffect, useState } from 'react';
import { tripService } from '../services/tripService';
import { ITrip } from '../types/ITrip';
import { Link, useNavigate } from 'react-router-dom';
import { icons } from '../lib/cloudinary';
import { TripCard } from '../components/trips/TripCard';
import { FlightIcon } from '../components/itinerary/icons';

export const MyTripsPage = () => {
    const [trips, setTrips] = useState<ITrip[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState<'all' | 'public' | 'private'>('all');
    const [sort, setSort] = useState<'recent' | 'oldest'>('recent');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTrips = async () => {
            try {
                const response = await tripService.getUserTrips();
                setTrips(Array.isArray(response) ? response : (response.trips || response.data || []));
            } catch {
                setTrips([]);
            } finally {
                setLoading(false);
            }
        };
        fetchTrips();
    }, []);

    const filtered = trips
        .filter(t => {
            const matchSearch = t.destination?.toLowerCase().includes(search.toLowerCase());
            const matchFilter = filter === 'all' ? true : filter === 'public' ? t.isPublic : !t.isPublic;
            return matchSearch && matchFilter;
        })
        .sort((a, b) => {
            const da = new Date(a.startDate || 0).getTime();
            const db = new Date(b.startDate || 0).getTime();
            return sort === 'recent' ? db - da : da - db;
        });

    const upcoming = trips
        .filter(t => t.startDate && new Date(t.startDate) > new Date())
        .sort((a, b) => new Date(a.startDate!).getTime() - new Date(b.startDate!).getTime())
        .slice(0, 3);

    if (loading) return (
        <div className="min-h-screen bg-bg flex items-center justify-center">
            <div className="flex items-center gap-2 text-text-secondary">
                <div className="spinner-sm"/>
                Cargando viajes...
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-bg px-4 sm:px-6 md:px-16 py-10">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-semibold text-text">Mis Viajes</h1>
                    <button
                        aria-label="Crear viaje"
                        onClick={() => navigate('/create-trip')}
                        className="btn flex items-center gap-2"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                            <line x1="12" y1="5" x2="12" y2="19" strokeLinecap="round"/>
                            <line x1="5" y1="12" x2="19" y2="12" strokeLinecap="round"/>
                        </svg>
                        Crear viaje
                    </button>
                </div>

                {/* Resumen + Próximos viajes */}
                <div className="lg:hidden space-y-4">
                    <div className="card-lg rounded-2xl p-4 flex items-center gap-5">
                        {[
                            { icon: icons.suitcase, label: 'Total', value: trips.length },
                            { icon: icons.plane, label: 'Países', value: new Set(trips.map(t => t.destination)).size },
                            { icon: icons.calendar, label: 'Próximos', value: upcoming.length },
                        ].map(item => (
                            <div key={item.label} className="flex items-center gap-2">
                                <img src={item.icon} alt="" className="w-6 h-6 object-contain" />
                                <div>
                                    <p className="text-[10px] text-text-secondary leading-none">{item.label}</p>
                                    <p className="text-lg font-semibold text-text leading-none mt-0.5">{item.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    {upcoming.length > 0 && (
                        <div className="card-lg rounded-2xl p-4 space-y-2">
                            <p className="text-xs font-semibold text-text-secondary">Próximos viajes</p>
                            {upcoming.map(trip => (
                                <Link to={`/trip/${trip.id || trip.idTrip}`} key={trip.id || trip.idTrip}
                                    className="flex items-center gap-2 px-2 py-1.5 hover:bg-primary-light rounded-xl transition"
                                >
                                    <FlightIcon size={14} />
                                    <div>
                                        <p className="text-xs font-medium text-text">{trip.destination}</p>
                                        <p className="text-[10px] text-text-secondary">
                                            {trip.startDate ? new Date(trip.startDate).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }) : '—'}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* Filtros */}
                <div className="flex flex-wrap gap-3 items-center">
                    <div className="flex items-center gap-2 bg-card border border-border rounded-full px-4 py-2 flex-1 min-w-48">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9A9A9A" strokeWidth="2">
                            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35" strokeLinecap="round"/>
                        </svg>
                        <input
                            aria-label="Buscar mis viajes"
                            type="text"
                            placeholder="Buscar mis viajes..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="flex-1 bg-transparent outline-none text-sm text-text placeholder:text-text-soft"
                        />
                    </div>
                    <select
                        aria-label="Estado del viaje"
                        value={filter}
                        onChange={e => setFilter(e.target.value as any)}
                        className="input px-4 py-2 rounded-full cursor-pointer"
                    >
                        <option value="all">Todos los estados</option>
                        <option value="public">Públicos</option>
                        <option value="private">Privados</option>
                    </select>
                    <select
                        aria-label="Ordenar por fecha"
                        value={sort}
                        onChange={e => setSort(e.target.value as any)}
                        className="bg-card border border-border rounded-full px-4 py-2 text-sm text-text outline-none cursor-pointer"
                    >
                        <option value="recent">Más recientes</option>
                        <option value="oldest">Más antiguos</option>
                    </select>
                </div>

                {/* Grid + Sidebar desktop */}
                <div className="flex gap-8 items-start">
                    <div className="flex-1">
                        {filtered.length === 0 ? (
                            <div className="empty-state rounded-2xl p-12 space-y-3 text-center">
                                <p className="text-text-secondary font-medium">No tienes ningún viaje aún.</p>
                                <Link to="/explore" className="text-accent hover:underline text-sm font-medium">
                                    Explorar destinos →
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                {filtered.map(trip => (
                                    <TripCard key={trip.id || trip.idTrip} trip={trip} />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Sidebar solo en desktop */}
                    <div className="hidden lg:flex flex-col gap-4 w-64 shrink-0">
                        <div className="card-lg rounded-2xl p-5 space-y-4">
                            <p className="font-semibold text-text">Resumen de viajes</p>
                            {[
                                { icon: icons.suitcase, label: 'Total', value: trips.length },
                                { icon: icons.plane, label: 'Países visitados', value: new Set(trips.map(t => t.destination)).size },
                                { icon: icons.calendar, label: 'Próximos viajes', value: upcoming.length },
                            ].map(item => (
                                <div key={item.label} className="flex items-center gap-3">
                                    <img src={item.icon} alt="" className="w-8 h-8 object-contain" />
                                    <div>
                                        <p className="text-xs text-text-secondary">{item.label}</p>
                                        <p className="text-2xl font-semibold text-text leading-none">{item.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {upcoming.length > 0 && (
                            <div className="card-lg bg-card rounded-3xl p-5 space-y-3">
                                <p className="font-semibold text-text">Próximos viajes</p>
                                {upcoming.map(trip => (
                                    <Link to={`/trip/${trip.id || trip.idTrip}`} key={trip.id || trip.idTrip}
                                        className="flex gap-3 items-center p-1.5 hover:bg-primary-light rounded-2xl transition"
                                    >
                                        <FlightIcon size={20} />
                                        <div>
                                            <p className="text-sm font-medium text-text">{trip.destination}</p>
                                            <p className="text-xs text-text-secondary">
                                                {trip.startDate ? new Date(trip.startDate).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }) : '—'}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};