import React from 'react';
import { IconClock, IconCreditCard, IconTicket, IconExternalLink, MediumIcon } from './TransportIcons';
import type { OptionKey, TransportOption, TransportLinea } from '../../types/transport';
import { OPTION_COLORS, OPTION_TITLES } from '../../types/transport';

interface Props {
    opciones: Record<OptionKey, TransportOption>;
}

const LineaBadge = ({ linea, size = 'normal' }: { linea: TransportLinea; size?: 'normal' | 'large' }) => {
    const bg = linea.color && linea.color !== '#333333' ? linea.color : '#2563EB';
    const isLarge = size === 'large';
    return (
        <div className="flex items-center gap-2">
            <span
                className={`inline-flex items-center justify-center text-white font-bold rounded-lg ${
                    isLarge ? 'text-sm px-3 py-1.5 min-w-11' : 'text-xs px-2.5 py-1 min-w-9'
                }`}
                style={{ backgroundColor: bg }}
            >
                {linea.linea || '?'}
            </span>
            <div className="min-w-0">
                <p className={`font-medium text-text truncate ${isLarge ? 'text-sm' : 'text-xs'}`}>{linea.tipo}</p>
                <p className="text-xs text-text-soft truncate">{linea.operador}</p>
            </div>
        </div>
    );
};

const PriceDisplay = ({ option }: { option: TransportOption }) => {
    if (option.precio_desconocido || option.precio_eur === null) {
        return <p className="font-bold text-text text-sm">Consultar</p>;
    }
    return <p className="font-bold text-text">{option.precio_eur}€</p>;
};

export const TransportMatrix = ({ opciones }: Props) => (
    <div>
        <h2 className="text-lg font-semibold text-text mb-3">Opciones de transporte</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(['publico', 'privado'] as const).map(key => {
                const opt = opciones[key];
                if (!opt) return null;

                const colors = OPTION_COLORS[key];
                if (!colors) return null;

                const inadecuado = opt.adecuado_equipaje === false;
                const lineasArray = Array.isArray(opt.lineas) ? opt.lineas : [];

                return (
                    <div key={key}
                        className={`card-lg rounded-2xl overflow-hidden ${inadecuado ? 'opacity-75' : ''}`}>

                        <div className="px-4 py-3 flex items-center justify-between" style={{ backgroundColor: colors.bg }}>
                            <div className="flex items-center gap-2">
                                <MediumIcon 
                                    medio={opt.medio} 
                                    size={20} 
                                    color="white" 
                                />
                                <div>
                                    <p className="text-white font-bold text-sm">{OPTION_TITLES[key]}</p>
                                    <p className="text-white/80 text-xs">{opt.medio}</p>
                                </div>
                            </div>
                            {inadecuado && (
                                <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full">
                                    No ideal para tu equipaje
                                </span>
                            )}
                        </div>

                        <div className="p-4 space-y-3">

                            {key === 'publico' && opt.lineaRecomendada && (
                                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 space-y-2">
                                    <p className="text-[10px] text-emerald-700 uppercase tracking-wide font-semibold">
                                        Línea recomendada
                                    </p>
                                    <LineaBadge linea={opt.lineaRecomendada} size="large" />
                                    {opt.razonRecomendada && (
                                        <p className="text-xs text-emerald-700 italic">{opt.razonRecomendada}</p>
                                    )}
                                </div>
                            )}

                            {key === 'publico' && !opt.lineaRecomendada && lineasArray.length === 0 && (
                                <div className="bg-amber-50 rounded-lg px-3 py-2">
                                    <p className="text-xs text-amber-800">
                                        No se detectaron líneas en la zona. Consulta la web oficial del transporte local.
                                    </p>
                                </div>
                            )}

                            {key === 'publico' && lineasArray.length > 0 && (
                                <div className={`${colors.light} rounded-lg p-3 space-y-2`}>
                                    <p className="text-[10px] text-text-soft uppercase tracking-wide font-semibold">
                                        Otras líneas en la zona
                                    </p>
                                    <div className="space-y-2">
                                        {lineasArray.map((l, i) => (
                                            <LineaBadge key={i} linea={l} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {key === 'privado' && (
                                <div className={`${colors.light} rounded-lg px-3 py-2 flex items-center gap-2`}>
                                    <MediumIcon 
                                        medio={opt.medio} 
                                        size={14} 
                                        color={colors.bg} 
                                    />
                                    <div className="min-w-0 flex-1">
                                        <p className="text-[10px] text-text-soft uppercase tracking-wide">Servicio</p>
                                        <p className={`font-bold text-sm ${colors.text}`}>Puerta a puerta</p>
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-2">
                                <div className="bg-card rounded-lg px-3 py-2 border border-border">
                                    <div className="flex items-center gap-1 text-text-soft">
                                        <IconClock 
                                            size={12} 
                                            color="currentColor" 
                                        />
                                        <p className="text-[10px] uppercase tracking-wide">Tiempo</p>
                                    </div>
                                    <p className="font-bold text-text">~{opt.tiempo_min} min</p>
                                </div>
                                <div className="bg-card rounded-lg px-3 py-2 border border-border">
                                    <div className="flex items-center gap-1 text-text-soft">
                                        <IconCreditCard 
                                            size={12} 
                                            color="currentColor" 
                                        />
                                        <p className="text-[10px] uppercase tracking-wide">Precio</p>
                                    </div>
                                    <PriceDisplay option={opt} />
                                </div>
                            </div>

                            {opt.operador && (
                                <p className="text-xs text-text-secondary">
                                    <span className="text-text-soft">Operador:</span>{' '}
                                    <span className="font-medium">{opt.operador}</span>
                                </p>
                            )}

                            <p className="text-xs text-text-secondary italic">{opt.descripcion_corta}</p>

                            {key === 'privado' && opt.servicios_disponibles && opt.servicios_disponibles.length > 0 && (
                                <div className="space-y-2 pt-2 border-t border-border">
                                    <p className="text-xs text-text-soft font-semibold uppercase tracking-wide">Servicios disponibles</p>
                                    <div className="grid grid-cols-1 gap-2">
                                        {opt.servicios_disponibles.map((s, i) => (
                                            <a 
                                                aria-label={`Ver servicio en ${s.nombre}`}
                                                key={i} href={s.app} target="_blank" rel="noopener noreferrer"
                                                className="flex items-center justify-between bg-card border border-border rounded-xl px-3 py-2.5 hover:border-primary transition group"
                                            >
                                                <div>
                                                    <p className="font-bold text-text text-sm">{s.nombre}</p>
                                                    <p className="text-[10px] text-text-soft">{s.tipo}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm font-semibold text-primary">{s.precio_aprox}</p>
                                                    <IconExternalLink size={12} className="text-text-soft group-hover:text-primary" />
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="pt-3 border-t border-border space-y-2">
                                <div className="flex items-start gap-2">
                                    <IconTicket 
                                        size={16} 
                                        color={colors.bg} 
                                        className="shrink-0 mt-0.5" 
                                    />
                                    <div className="min-w-0">
                                        <p className="text-xs text-text-soft">Dónde comprar</p>
                                        <p className="text-sm font-semibold text-text">{opt.donde_comprar}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <IconCreditCard 
                                        size={16} 
                                        color={colors.bg} 
                                        className="shrink-0 mt-0.5" 
                                    />
                                    <div className="min-w-0">
                                        <p className="text-xs text-text-soft">Método de pago</p>
                                        <p className="text-sm font-semibold text-text">{opt.metodo_pago}</p>
                                    </div>
                                </div>
                            </div>

                            {key === 'publico' && opt.precio_desconocido && opt.enlaces.length > 0 && (
                                <div className="bg-amber-50 rounded-lg px-3 py-2">
                                    <p className="text-xs text-amber-800">
                                        Consulta precio y horarios exactos:
                                    </p>
                                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                                        {opt.enlaces.map((e, i) => (
                                            <a 
                                                key={i} 
                                                href={e.url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                aria-label={`Ver enlace: ${e.label}`}
                                                className="inline-flex items-center gap-1 text-xs text-amber-700 font-semibold underline"
                                            >
                                                {e.label}
                                                <IconExternalLink size={10} color="currentColor" />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {opt.enlaces.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {opt.enlaces.map((e, i) => (
                                        <a 
                                            key={i} 
                                            href={e.url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            aria-label={`Ver enlace: ${e.label}`}
                                            className="inline-flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg font-medium transition"
                                            style={{ backgroundColor: `${colors.bg}15`, color: colors.bg }}
                                        >
                                            {e.label}
                                            <IconExternalLink size={12} color="currentColor" />
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
);