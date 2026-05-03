import React from 'react';
import { AirportInput } from '../explore/AirportInput';
import { IconBackpack, IconSuitcase, IconSearch, IconWarning } from './TransportIcons';
import type { TransportMode, Equipaje } from '../../types/transport';
import { EQUIPAJE_OPTIONS } from '../../types/transport';

interface Props {
    mode: TransportMode;
    alojamiento: string | null;
    aeropuertoDisplay: string;
    equipaje: Equipaje;
    horaLlegada: string;
    loading: boolean;
    hasAeropuerto: boolean;
    onAeropuertoChange: (nombre: string, iata: string) => void;
    onEquipajeChange: (eq: Equipaje) => void;
    onHoraChange: (hora: string) => void;
    onCompare: () => void;
}

export const TransportInputForm = ({
    mode, alojamiento, aeropuertoDisplay, equipaje, horaLlegada, loading,
    hasAeropuerto, onAeropuertoChange, onEquipajeChange, onHoraChange, onCompare
}: Props) => {
    const sinAlojamiento = !alojamiento;
    const sinAeropuerto = !hasAeropuerto;

    const origen = mode === 'to_airport' ? alojamiento : (aeropuertoDisplay || null);
    const destino = mode === 'to_airport' ? (aeropuertoDisplay || null) : alojamiento;

    return (
        <div className="card-lg rounded-3xl p-5 space-y-4">

            <div className="flex flex-wrap gap-3 items-end">
                <div className="flex-1 min-w-36">
                    <label className="label">Origen</label>
                    <div className="input px-4 py-2.5 w-full bg-gray-50 cursor-not-allowed">
                        <p className={`text-sm ${origen ? 'text-text font-medium' : 'text-text-soft italic'}`}>
                            {origen || (mode === 'to_airport' ? 'Sin alojamiento' : 'Sin aeropuerto')}
                        </p>
                    </div>
                </div>
                <div className="flex-1 min-w-36">
                    <label className="label">Destino</label>
                    <div className="input px-4 py-2.5 w-full bg-gray-50 cursor-not-allowed">
                        <p className={`text-sm ${destino ? 'text-text font-medium' : 'text-text-soft italic'}`}>
                            {destino || (mode === 'to_airport' ? 'Sin aeropuerto' : 'Sin alojamiento')}
                        </p>
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <label className="label">Aeropuerto</label>
                <div className="input px-4 py-2.5 w-full">
                    <AirportInput
                        value={aeropuertoDisplay}
                        onlyAirports={true}
                        onChange={(nombre, iata) => {
                            if (iata) onAeropuertoChange(nombre, iata);
                        }}
                    />
                </div>
                {!hasAeropuerto && (
                    <p className="text-xs text-text-soft">
                        Selecciona un aeropuerto de la lista para comparar opciones.
                    </p>
                )}
            </div>

            {sinAlojamiento && (
                <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                    <IconWarning size={16} color="#d97706" className="shrink-0 mt-0.5" />
                    <p className="text-sm text-amber-800">
                        Añade un alojamiento con dirección válida en la sección de alojamiento para comparar opciones de transporte.
                    </p>
                </div>
            )}

            <div className="pt-3 border-t border-border space-y-4">
                <div className="flex flex-wrap gap-4 items-end">
                    <div>
                        <label className="label">Equipaje</label>
                        <div className="flex gap-2 flex-wrap">
                            {EQUIPAJE_OPTIONS.map(opt => {
                                const Icon = opt.key === 'mochila' ? IconBackpack : IconSuitcase;
                                return (
                                    <button 
                                        aria-label={opt.label}
                                        key={opt.key} 
                                        onClick={() => onEquipajeChange(opt.key)}
                                        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition ${
                                            equipaje === opt.key
                                                ? 'bg-primary text-white shadow-md'
                                                : 'bg-card text-text-secondary hover:text-text border border-border'
                                        }`}
                                    >
                                        <Icon size={16} color="currentColor" />
                                        <div className="text-left">
                                            <p className="font-medium leading-tight">{opt.label}</p>
                                            <p className={`text-[10px] ${equipaje === opt.key ? 'text-white/80' : 'text-text-soft'}`}>
                                                {opt.desc}
                                            </p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="min-w-44">
                        <label className="label">Fecha / Hora llegada (opcional)</label>
                        <input 
                            aria-label="Fecha y hora de llegada al aeropuerto"
                            type="datetime-local" value={horaLlegada}
                            onChange={e => onHoraChange(e.target.value)}
                            className="input px-4 py-2.5 w-full" 
                        />
                    </div>
                </div>

                <div className="flex justify-end">
                    <button 
                        aria-label="Comparar opciones"
                        onClick={onCompare}
                        disabled={loading || sinAlojamiento || sinAeropuerto}
                        className="btn disabled:opacity-50 flex items-center gap-2"
                    >
                        {loading ? (
                            <><div className="spinner-sm" style={{ borderTopColor: 'white', borderColor: 'rgba(255,255,255,0.3)' }} />Buscando...</>
                        ) : (
                            <><IconSearch size={14} color="white" /> Comparar opciones</>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};