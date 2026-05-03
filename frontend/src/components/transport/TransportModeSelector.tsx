import React from 'react';
import type { TransportMode } from '../../types/transport';

const MODES: { key: TransportMode; label: string }[] = [
    { key: 'to_airport', label: 'Ciudad → Aeropuerto' },
    { key: 'from_airport', label: 'Aeropuerto → Hotel' }
];

interface Props {
    mode: TransportMode;
    onChange: (mode: TransportMode) => void;
}

export const TransportModeSelector = ({ mode, onChange }: Props) => (
    <div className="flex gap-2">
        {MODES.map(m => (
            <button
                aria-label={`Seleccionar modo de transporte: ${m.label}`}
                key={m.key}
                onClick={() => onChange(m.key)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                    mode === m.key ? 'bg-primary text-white' : 'bg-card text-text-secondary hover:text-text'
                }`}
                style={mode !== m.key ? { border: '2px solid white', boxShadow: '0px 2px 8px rgba(138,106,90,0.25)' } : {}}
            >
                {m.label}
            </button>
        ))}
    </div>
);