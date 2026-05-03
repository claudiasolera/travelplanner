import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { TransportResult, Coords } from '../../types/transport';

const makeIcon = (color: string) => new L.DivIcon({
    html: `<div style="width:36px;height:36px;background:${color};border:3px solid white;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 10px ${color}66;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5">
            <circle cx="12" cy="10" r="3"/><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
        </svg>
    </div>`,
    iconSize: [36, 36], iconAnchor: [18, 36], popupAnchor: [0, -40], className: ''
});

const fromIcon = makeIcon('#2563EB');
const toIcon = makeIcon('#10b981');

const FitBounds = ({ coords }: { coords: [number, number][] }) => {
    const map = useMap();
    useEffect(() => {
        if (coords.length >= 2) map.fitBounds(coords, { padding: [40, 40] });
    }, [coords]);
    return null;
};

interface Props {
    result: TransportResult;
    fromCoords: Coords;
    toCoords: Coords;
    routePoints: [number, number][];
}

export const TransportSummary = ({ result, fromCoords, toCoords, routePoints }: Props) => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
        <div className="lg:col-span-2 card-lg rounded-2xl overflow-hidden" style={{ height: '380px' }}>
            <MapContainer 
                center={[fromCoords.lat, fromCoords.lon]} 
                zoom={10} 
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
                {routePoints.length > 0 && (
                    <>
                        <Polyline positions={routePoints} color="#2563EB" weight={4} opacity={0.8} />
                        <FitBounds coords={routePoints} />
                    </>
                )}
                <Marker position={[fromCoords.lat, fromCoords.lon]} icon={fromIcon}>
                    <Popup>
                        <p className="font-semibold text-sm">
                            {fromCoords.name}
                        </p>
                    </Popup>
                </Marker>
                <Marker position={[toCoords.lat, toCoords.lon]} icon={toIcon}>
                    <Popup>
                        <p className="font-semibold text-sm">
                            {toCoords.name}
                        </p>
                    </Popup>
                </Marker>
            </MapContainer>
        </div>

        <div className="card-lg rounded-2xl overflow-hidden self-start">
            <div className="bg-primary px-4 py-2.5">
                <h3 className="text-white font-semibold text-sm">
                    Resumen
                </h3>
            </div>
            <div className="p-4 space-y-3">
                <div>
                    <p className="text-xs text-text-soft">
                        Distancia
                    </p>
                    <p className="font-bold text-text">
                        {result.resumen?.distancia}
                    </p>
                </div>
                <div>
                    <p className="text-xs text-text-soft">
                        Tiempo en coche
                    </p>
                    <p className="font-bold text-text">
                        {result.resumen?.tiempoEstimadoCoche}
                    </p>
                </div>
                {result.clima && (
                    <div>
                        <p className="text-xs text-text-soft">
                            Clima destino
                        </p>
                        <div className="flex items-center gap-1 mt-0.5">
                            <img src={result.clima.icono} alt="clima" className="w-8 h-8" />
                            <p className="font-bold text-text text-sm">
                                {result.clima.temperatura} · {result.clima.descripcion}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
);