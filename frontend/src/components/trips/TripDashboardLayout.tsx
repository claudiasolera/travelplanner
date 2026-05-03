import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, useParams, useNavigate } from 'react-router-dom';
import { tripService } from '../../services/tripService';
import { ITrip } from '../../types/ITrip';
import { icons } from '../../lib/cloudinary';

export const TripDashboardLayout = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [trip, setTrip] = useState<ITrip | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const fetchTrip = async () => {
            try {
                if (id) {
                    const data = await tripService.getTripById(id);
                    const raw = data.trip || data;
                    setTrip(raw);
                }
            } catch (error) {
                console.error('Error en Layout:', error);
            }
        };
        fetchTrip();
    }, [id]);

    useEffect(() => {
        setSidebarOpen(false);
    }, [id]);

    const menuItems = [
        { id: 'overview',     path: `/trip/${id}`,              label: 'Resumen',      icon: icons.summary },
        { id: 'itinerary',    path: `/trip/${id}/itinerary`,    label: 'Itinerario',   icon: icons.map },
        { id: 'transport',    path: `/trip/${id}/transport`,    label: 'Transporte',   icon: icons.hotel },
        { id: 'calendar',     path: `/trip/${id}/calendar`,     label: 'Calendario',   icon: icons.calendar },
        { id: 'discover',     path: `/trip/${id}/discover`,     label: 'Qué ver',      icon: icons.magnifyingGlass },
        { id: 'tasks',        path: `/trip/${id}/tasks`,        label: 'Tareas',       icon: icons.journal },
        { id: 'budget',       path: `/trip/${id}/budget`,       label: 'Presupuesto',  icon: icons.moneyBag },
        { id: 'storytelling', path: `/trip/${id}/storytelling`, label: 'Destino',      icon: icons.earth },
        { id: 'reviews',      path: `/trip/${id}/reviews`,      label: 'Reseñas',      icon: icons.padlock },
    ];

    return (
        <div className="min-h-screen bg-bg flex relative">

            {sidebarOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/40 z-30 animate-fade-in"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <aside className={`
                w-56 bg-gray-50 flex flex-col p-2.5 shrink-0 border-r-2 border-primary-light overflow-visible
                fixed top-16 bottom-0 left-0 z-40 transition-transform duration-300
                lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:translate-x-0
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <button
                    aria-label="Cerrar menú de secciones"
                    onClick={() => setSidebarOpen(false)}
                    className="lg:hidden self-end mb-2 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-primary-light transition text-text-secondary"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                </button>

                <button
                    aria-label="Volver a mis viajes"
                    onClick={() => navigate('/my-trips')}
                    className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text transition mb-6 text-left"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Mis viajes
                </button>

                <div className="mb-6 px-3 py-3 rounded-2xl"
                    style={{ background: 'rgba(138, 106, 90, 0.08)', border: '1.5px solid rgba(201, 176, 160, 0.4)' }}
                >
                    <p className="text-xs text-text-secondary mb-0.5">Destino</p>
                    <p className="font-semibold text-text text-sm">{trip ? trip.destination : '...'}</p>
                    {trip?.startDate && (
                        <p className="text-xs text-text-secondary mt-1">
                            {new Date(trip.startDate).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                            {trip.endDate && ` - ${new Date(trip.endDate).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}`}
                        </p>
                    )}
                    {(trip as any)?.isCollaborator && (trip as any)?.user?.name && (
                        <div className="mt-2 flex items-center gap-1">
                            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-soft shrink-0">
                                <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" strokeLinecap="round"/>
                            </svg>
                            <span className="text-[10px] text-text-soft">de {(trip as any).user.name}</span>
                        </div>
                    )}
                </div>

                <nav className="flex flex-col gap-1 flex-1 overflow-y-auto">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.id}
                            to={item.path}
                            end={item.id === 'overview'}
                            onClick={() => setSidebarOpen(false)}
                        >
                            {({ isActive }) => (
                                <div className="relative">
                                    {isActive && (
                                        <span className="absolute -right-2.5 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-l-full"/>
                                    )}
                                    <div className={`flex items-center gap-2 px-3 py-2 rounded-2xl transition ${
                                        isActive
                                            ? 'bg-primary-light text-text font-bold'
                                            : 'text-text-secondary hover:bg-primary-lighter hover:text-text font-normal'
                                    }`}>
                                        <img src={item.icon} alt="" className="w-8 h-8 object-contain shrink-0" />
                                        {item.label}
                                    </div>
                                </div>
                            )}
                        </NavLink>
                    ))}
                </nav>

                <div className="mt-auto pt-4"
                    style={{ borderTop: '1.5px solid rgba(201, 176, 160, 0.4)' }}
                >
                    <p className="text-xs text-text-secondary mb-0.5">Presupuesto total</p>
                    <p className="text-lg font-semibold text-text">{trip?.totalPrice || '0'}€</p>
                </div>
            </aside>

            <main className="flex-1 p-4 md:p-8 overflow-y-auto">

                {trip && (
                    <div className="mb-8 pb-6"
                        style={{ borderBottom: '1.5px solid rgba(201, 176, 160, 0.3)' }}
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-semibold text-text mb-2">{trip.destination}</h1>
                                <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
                                    {trip.startDate && (
                                        <span className="flex items-center gap-1.5">
                                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <rect x="3" y="4" width="18" height="18" rx="2"/>
                                                <line x1="16" y1="2" x2="16" y2="6"/>
                                                <line x1="8" y1="2" x2="8" y2="6"/>
                                                <line x1="3" y1="10" x2="21" y2="10"/>
                                            </svg>
                                            {new Date(trip.startDate).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            {trip.endDate && ` - ${new Date(trip.endDate).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}`}
                                        </span>
                                    )}
                                    <span className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        trip.isPublic
                                            ? 'border border-green-400 bg-green-200 text-secondary-dark'
                                            : 'border border-red-400 bg-red-200 text-text-secondary'
                                    }`}>
                                        <img
                                            src={trip.isPublic ? icons.earth : icons.padlock}
                                            alt={trip.isPublic ? 'público' : 'privado'}
                                            className="w-4.5 h-4.5 object-contain"
                                        />
                                        {trip.isPublic ? 'Público' : 'Privado'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <button
                    aria-label="Abrir menú de secciones"
                    onClick={() => setSidebarOpen(true)}
                    className="lg:hidden mb-6 flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition active:scale-95"
                >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M4 6h16M4 12h10M4 18h16" />
                    </svg>
                    <span className="font-medium">Secciones</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M9 18l6-6-6-6" />
                    </svg>
                </button>

                <Outlet context={{ trip }} />
            </main>
        </div>
    );
};