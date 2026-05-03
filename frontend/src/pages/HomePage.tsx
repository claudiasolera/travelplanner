import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { icons, homepage } from '../lib/cloudinary';
import { predefinedRoutes } from '../data/predefinedRoutes';
import { destinations } from '../data/data';

export const HomePage = () => {
    const heroImages = homepage.heroBg;
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [current, setCurrent] = useState(0);
    const [activeTab, setActiveTab] = useState<'destinations' | 'routes'>('destinations');

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent(prev => (prev + 1) % destinations.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const handleSearch = () => {
        if (search.trim()) navigate(`/explore?q=${encodeURIComponent(search)}`);
    };

    return (
        <div className="min-h-screen bg-bg">

            {/* ── HERO ── */}
            <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
                {heroImages.map((img, i) => (
                    <img
                        key={i}
                        src={img.src}
                        alt={img.alt}
                        className="absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000"
                        style={{ opacity: i === current ? 1 : 0 }}
                    />
                ))}

                <div className="relative z-10 flex flex-col items-center text-center px-4 sm:px-6 space-y-6 sm:space-y-8 md:space-y-10 w-full max-w-2xl mx-auto">
                    <h1
                        className="text-4xl sm:text-5xl md:text-6xl text-white drop-shadow-lg"
                        style={{ fontWeight: 900, letterSpacing: '-0.02em', lineHeight: '1.1' }}
                    >
                        ¡Planifica tu<br />viaje soñado!
                    </h1>
                    <p className="text-white/80 text-base sm:text-lg font-normal max-w-sm sm:max-w-md">
                        Encuentra y organiza los mejores destinos para tu próxima gran aventura.
                    </p>

                    <div
                        className="flex items-center gap-2 bg-white/90 backdrop-blur-sm border border-border rounded-full px-3 sm:px-4 py-2 w-full max-w-xs sm:max-w-md"
                        style={{ boxShadow: '8px 8px 6px rgba(0,0,0,0.3)' }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9A9A9A" strokeWidth="2" className="shrink-0">
                            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35" strokeLinecap="round"/>
                        </svg>
                        <input
                            aria-label="Buscar destinos, rutas y más"
                            type="text"
                            placeholder="¿A dónde quieres ir?"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSearch()}
                            className="flex-1 bg-transparent outline-none text-sm text-text placeholder:text-text-soft min-w-0"
                        />
                        <button 
                            aria-label="Buscar"
                            onClick={handleSearch} 
                            className="btn text-xs sm:text-sm py-1.5 sm:py-2 px-3 sm:px-5 shrink-0"
                        >
                            Buscar
                        </button>
                    </div>
                </div>
            </div>

            {/* ── VENTAJAS ── */}
            <div className="w-full py-12 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 md:mb-16">
                        <div>
                            <div className="flex items-center gap-2 sm:gap-3">
                                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-text leading-tight">
                                    Todo lo que necesitas<br />para viajar mejor
                                </h2>
                                <img
                                    src={icons.hotAirBalloon}
                                    alt="globo"
                                    className="w-16 h-16 sm:w-24 sm:h-24 md:w-36 md:h-36 object-contain shrink-0"
                                />
                            </div>
                        </div>
                        <p className="text-text-secondary text-sm max-w-xs leading-relaxed">
                            Una plataforma pensada para que organizar tu viaje sea tan emocionante como el viaje mismo.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                        {[
                            { icon: icons.handShake, title: 'Colaboración en vivo',    desc: 'Planea con amigos en tiempo real sin perder el hilo.',            color: 'from-orange-50 to-amber-50' },
                            { icon: icons.plane,     title: 'Vuelos y hoteles',         desc: 'Busca y guarda vuelos y alojamientos desde un solo lugar.',       color: 'from-sky-50 to-blue-50' },
                            { icon: icons.calendar,  title: 'Calendario inteligente',   desc: 'Arrastra y suelta eventos y organiza cada día del viaje.',        color: 'from-violet-50 to-purple-50' },
                            { icon: icons.moneyBag,  title: 'Control de presupuesto',   desc: 'Lleva la cuenta de cada gasto y no te salgas del límite.',        color: 'from-emerald-50 to-teal-50' },
                        ].map((item, i) => (
                            <div
                                key={item.title}
                                className={`relative rounded-2xl sm:rounded-3xl p-4 sm:p-6 flex flex-col gap-3 sm:gap-4 bg-linear-to-br ${item.color} cursor-default overflow-hidden`}
                                style={{ border: '1.5px solid rgba(255,255,255,0.9)', boxShadow: '0 2px 20px rgba(0,0,0,0.06)' }}
                            >
                                <span className="absolute -bottom-3 -right-1 text-7xl sm:text-8xl font-black text-black/5 select-none leading-none">
                                    {i + 1}
                                </span>
                                <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center">
                                    <img src={item.icon} alt={item.title} className="w-10 h-10 sm:w-12 sm:h-12 object-contain" />
                                </div>
                                <div className="flex flex-col gap-1 sm:gap-1.5">
                                    <p className="font-bold text-text text-sm sm:text-base leading-snug">{item.title}</p>
                                    <p className="text-xs text-text-secondary leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>

            {/* ── DESTINOS + RUTAS ── */}
            <div className="w-full px-4 sm:px-6 py-8 sm:py-12 bg-bg-section">
                <div className="max-w-6xl mx-auto">

                    <div className="flex justify-center mb-6 sm:mb-8">
                        <div className="relative flex justify-center">
                            <h2
                                className="text-2xl sm:text-3xl font-semibold text-text absolute transition-all duration-500 whitespace-nowrap"
                                style={{
                                    opacity: activeTab === 'destinations' ? 1 : 0,
                                    transform: activeTab === 'destinations' ? 'translateY(0)' : 'translateY(-8px)',
                                    pointerEvents: activeTab === 'destinations' ? 'auto' : 'none',
                                }}
                            >
                                Destinos en tendencia
                            </h2>
                            <h2
                                className="text-2xl sm:text-3xl font-semibold text-text absolute transition-all duration-500 whitespace-nowrap"
                                style={{
                                    opacity: activeTab === 'routes' ? 1 : 0,
                                    transform: activeTab === 'routes' ? 'translateY(0)' : 'translateY(8px)',
                                    pointerEvents: activeTab === 'routes' ? 'auto' : 'none',
                                }}
                            >
                                Rutas prediseñadas
                            </h2>
                            <h2 className="text-2xl sm:text-3xl font-semibold opacity-0 whitespace-nowrap select-none">
                                Destinos en tendencia
                            </h2>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">

                        <button
                            aria-label='Siguiente vista'
                            onClick={() => setActiveTab(prev => prev === 'routes' ? 'destinations' : 'routes')}
                            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:bg-black/10 shrink-0"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>

                        <div className="relative flex-1 min-w-0">

                            {/* Destinos */}
                            <div className={`transition-all duration-500 ${activeTab === 'destinations' ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-5 invisible absolute inset-0'}`}>
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                                    {destinations.map((d) => (
                                        <div
                                            key={d.name}
                                            className="relative rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer group"
                                            style={{ aspectRatio: '3/4', boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}
                                        >
                                            <img
                                                src={d.img}
                                                alt={d.alt || d.name}
                                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                            <div
                                                className="absolute inset-0"
                                                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)' }}
                                            />
                                            <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 z-10">
                                                <p className="text-white font-bold text-sm sm:text-lg leading-tight mb-1.5">{d.name}</p>
                                                <button
                                                    aria-label='Explorar'
                                                    onClick={() => navigate(`/explore?q=${encodeURIComponent(d.name)}`)}
                                                    className="flex items-center justify-between w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white text-xs font-medium px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl transition"
                                                >
                                                    <span>Explorar</span>
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                                                        <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/>
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Rutas */}
                            <div className={`transition-all duration-500 ${activeTab === 'routes' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-5 invisible absolute inset-0'}`}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                                    {predefinedRoutes.map(route => (
                                        <div
                                            key={route.id}
                                            className="relative rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer group flex flex-col justify-end"
                                            style={{ aspectRatio: '3/3', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}
                                            onClick={() => navigate(`/routes/${route.id}`)}
                                        >
                                            <img
                                                src={route.cover}
                                                alt={route.title}
                                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                            <div
                                                className="absolute inset-0"
                                                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 55%, transparent 100%)' }}
                                            />

                                            <div className="absolute top-3 sm:top-4 left-3 sm:left-4 right-3 sm:right-4 z-20">
                                                <span className="text-xs bg-white/20 backdrop-blur-sm text-white px-2 sm:px-3 py-1 rounded-full inline-block max-w-full truncate">
                                                    {route.tag} · {route.days} días
                                                </span>
                                            </div>

                                            <div className="relative z-10 w-full pt-16 sm:pt-20 md:pt-24 p-4 sm:p-5 flex flex-col gap-1">
                                                <p className="text-white font-bold text-sm sm:text-lg leading-tight wrap-break-words">
                                                    {route.title}
                                                </p>
                                                <p className="text-white/70 text-xs line-clamp-2">
                                                    {route.description}
                                                </p>
                                                <button
                                                    aria-label='Ver itinerario'
                                                    onClick={e => { e.stopPropagation(); navigate(`/routes/${route.id}`); }}
                                                    className="mt-2 flex items-center justify-between w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white text-xs font-medium px-3 sm:px-4 py-2 rounded-xl transition"
                                                >
                                                    <span>Ver itinerario</span>
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                                                        <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/>
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>

                        <button
                            aria-label='Vista anterior'
                            onClick={() => setActiveTab(prev => prev === 'destinations' ? 'routes' : 'destinations')}
                            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:bg-black/10 shrink-0"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>

                    </div>
                </div>
            </div>

            {/* ── FLUJO DE PASOS ── */}
            <div className="w-full px-4 sm:px-6 py-10 sm:py-14 md:py-16">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-8 sm:mb-12">
                        <p className="text-primary text-2xl sm:text-3xl font-bold mb-2">¿Cómo funciona?</p>
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-text">¡Planificar tu viaje nunca ha sido tan fácil!</h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 relative">
                        <div
                            className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-0.5"
                            style={{ background: 'linear-gradient(to right, #dbeafe, #2563EB, #dbeafe)' }}
                        />
                        {[
                            { step: '1', icon: icons.choose,      title: 'Elige tu destino', desc: 'Selecciona el lugar y las fechas de tu aventura.' },
                            { step: '2', icon: icons.personalize,  title: 'Personaliza',      desc: 'Añade vuelos, hoteles y actividades con un clic.' },
                            { step: '3', icon: icons.organize,     title: 'Organiza',         desc: 'Arrastra y suelta eventos en tu calendario.' },
                            { step: '4', icon: icons.travel,       title: '¡A viajar!',       desc: 'Exporta tu itinerario y llévalo en el bolsillo.' },
                        ].map(item => (
                            <div key={item.step} className="flex flex-col items-center text-center gap-3 sm:gap-4 relative">
                                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-white rounded-2xl sm:rounded-3xl flex items-center justify-center relative z-10 overflow-hidden">
                                    <img src={item.icon} alt={item.title} className="w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 object-contain" />
                                </div>
                                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                                    {item.step}
                                </div>
                                <p className="font-bold text-text text-sm sm:text-base md:text-lg">{item.title}</p>
                                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-center mt-8 sm:mt-12">
                        <button 
                            aria-label="Crear viaje"
                            onClick={() => navigate('/create-trip')} 
                            className="btn px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base"
                        >
                            Empieza gratis →
                        </button>
                    </div>
                </div>
            </div>

            {/* ── PRUEBA SOCIAL ── */}
            <div className="w-full px-4 sm:px-6 py-10 sm:py-16 bg-bg-section">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-8 sm:mb-12">
                        <h2 className="text-2xl sm:text-3xl font-bold text-text mb-3">Lo que dicen nuestros viajeros</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                        {[
                            { name: 'Laura M.',  dest: 'Islandia', text: 'Gracias a esta app, mi viaje a Islandia fue perfecto. Cada detalle organizado sin estrés.', rating: 5 },
                            { name: 'Carlos R.', dest: 'Japón',    text: 'Planear 15 días en Japón parecía imposible. Con el calendario y los vuelos integrados fue muy fácil.', rating: 5 },
                            { name: 'Sofía G.',  dest: 'Grecia',   text: 'Lo usé con mis amigas para un viaje a Grecia. La colaboración en tiempo real es una pasada.', rating: 5 },
                            { name: 'Miguel T.', dest: 'Maldivas', text: 'Hicieron que mi luna de miel fuera perfecta. Todo organizado al detalle sin ningún estrés.', rating: 5 },
                        ].map(review => (
                            <div key={review.name} className="card rounded-2xl p-4 flex flex-col gap-3">
                                <div className="flex items-center gap-1">
                                    {[...Array(review.rating)].map((_, s) => (
                                        <svg key={s} width="11" height="11" viewBox="0 0 24 24" fill="#f59e0b" stroke="none">
                                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                        </svg>
                                    ))}
                                </div>
                                <p className="text-sm text-text leading-relaxed">"{review.text}"</p>
                                <div className="mt-auto flex items-center gap-2">
                                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                                        {review.name[0]}
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-text">{review.name}</p>
                                        <p className="text-xs text-text-secondary">Viaje a {review.dest}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
};
