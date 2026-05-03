import React from 'react';
import { badges } from '../../lib/cloudinary';

export const BADGE_CONFIG: Record<string, { icon: string; label: string; desc: string; color: string }> = {
    'FIRST_TRIP':    { icon: badges.firstTrip,    label: 'Primer viaje',      desc: 'Creaste tu primer viaje',     color: 'bg-blue-50 border-blue-200' },
    'EXPLORER':      { icon: badges.explorer,      label: 'Explorador',         desc: '5 viajes creados',            color: 'bg-green-50 border-green-200' },
    'NOMAD':         { icon: badges.nomad,         label: 'Nómada',             desc: '10 países visitados',         color: 'bg-purple-50 border-purple-200' },
    'ADVENTURER':    { icon: badges.adventurer,    label: 'Aventurero',         desc: 'Estilo aventura en 3 viajes', color: 'bg-orange-50 border-orange-200' },
    'SOCIAL':        { icon: badges.social,        label: 'Social',             desc: '10 seguidores',               color: 'bg-pink-50 border-pink-200' },
    'BUDGET_MASTER': { icon: badges.budgetMaster,  label: 'Ahorra Presupuesto', desc: 'Viaje por menos de 500€',     color: 'bg-yellow-50 border-yellow-200' },
};

export const ALL_BADGES = Object.keys(BADGE_CONFIG);

interface Props {
    earnedBadges: string[];
}

export const BadgeGrid: React.FC<Props> = ({ earnedBadges }) => {
    const earnedSet = new Set(earnedBadges);

    return (
        <div className="space-y-4">
            <p className="text-sm text-text-secondary">{earnedSet.size} de {ALL_BADGES.length} insignias conseguidas</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {ALL_BADGES.map(type => {
                    const config = BADGE_CONFIG[type];
                    const earned = earnedSet.has(type);
                    return (
                        <div key={type}
                            className={`border rounded-2xl p-4 text-center space-y-2 transition ${earned ? config.color : 'border-border bg-bg opacity-50'}`}>
                            <div className="flex justify-center">
                                <img
                                    src={config.icon}
                                    alt={config.label}
                                    className={`w-28 h-28 object-contain ${!earned ? 'grayscale' : ''}`}
                                />
                            </div>
                            <p className={`text-sm font-bold ${earned ? 'text-text' : 'text-text-soft'}`}>
                                {config.label}
                            </p>
                            <p className="text-xs text-text-secondary">{config.desc}</p>
                            {earned && (
                                <span className="pill">
                                    Conseguida
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};