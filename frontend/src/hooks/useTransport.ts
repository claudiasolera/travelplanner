import { useState } from 'react';
import { transportService, geocode, geocodeAirport } from '../services/transportService';
import { apiClient } from '../services/apiClient';
import { useToast } from './useToast';
import type { TransportMode, Equipaje, TransportResult, Coords } from '../types/transport';

const haversineKm = (from: Coords, to: Coords): number => {
    const R = 6371;
    const dLat = (to.lat - from.lat) * Math.PI / 180;
    const dLon = (to.lon - from.lon) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(from.lat * Math.PI / 180) * Math.cos(to.lat * Math.PI / 180) *
        Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

interface UseTransportParams {
    alojamiento: string | null;
}

export const useTransport = ({ alojamiento }: UseTransportParams) => {
    const { toasts, showToast, removeToast } = useToast();
    const [mode, setMode] = useState<TransportMode>('to_airport');
    const [equipaje, setEquipaje] = useState<Equipaje>('cabina');
    const [horaLlegada, setHoraLlegada] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<TransportResult | null>(null);
    const [fromCoords, setFromCoords] = useState<Coords | null>(null);
    const [toCoords, setToCoords] = useState<Coords | null>(null);
    const [routePoints, setRoutePoints] = useState<[number, number][]>([]);
    const [aeropuerto, setAeropuerto] = useState<string | null>(null);
    const [aeropuertoDisplay, setAeropuertoDisplay] = useState<string>('');

    const reset = () => {
        setResult(null);
        setRoutePoints([]);
    };

    const changeMode = (newMode: TransportMode) => {
        setMode(newMode);
        reset();
    };

    const handleAeropuertoChange = (nombre: string, iata: string) => {
        if (iata && nombre) {
            setAeropuerto(`${nombre} airport`);
            setAeropuertoDisplay(`${nombre} (${iata})`);
            reset();
        }
    };

    const fetchRoute = async (from: Coords, to: Coords) => {
        try {
            const data = await apiClient(
                `/ai/route?fromLon=${from.lon}&fromLat=${from.lat}&toLon=${to.lon}&toLat=${to.lat}`
            );
            if (data.routes?.[0]?.geometry?.coordinates) {
                setRoutePoints(
                    data.routes[0].geometry.coordinates.map(
                        ([lon, lat]: [number, number]) => [lat, lon] as [number, number]
                    )
                );
            }
        } catch {
            setRoutePoints([[from.lat, from.lon], [to.lat, to.lon]]);
        }
    };

    const compare = async () => {
        reset();

        if (!alojamiento) {
            showToast('Necesitas tener un alojamiento configurado.', 'warning');
            return;
        }
        if (!aeropuerto) {
            showToast('Selecciona un aeropuerto.', 'warning');
            return;
        }

        const fromQuery = mode === 'to_airport' ? alojamiento : aeropuerto;
        const toQuery = mode === 'to_airport' ? aeropuerto : alojamiento;

        const fromClean = fromQuery;
        const toClean = toQuery;

        setLoading(true);

        try {
            const geocodeFrom = mode === 'to_airport' ? geocode : geocodeAirport;
            const geocodeTo = mode === 'to_airport' ? geocodeAirport : geocode;
            const [from, to] = await Promise.all([geocodeFrom(fromQuery), geocodeTo(toQuery)]);
            
            if (from) { from.lat = parseFloat(String(from.lat)); from.lon = parseFloat(String(from.lon)); }
            if (to) { to.lat = parseFloat(String(to.lat)); to.lon = parseFloat(String(to.lon)); }

            if (!from) {
                showToast(`No se encontró la dirección del alojamiento. Verifica que sea correcta.`, 'error');
                return;
            }
            if (!to) {
                showToast(`No se encontró el aeropuerto. Intenta con otro nombre.`, 'error');
                return;
            }
            
            const dist = haversineKm(from, to);

            if (dist < 0.5) {
                showToast('Origen y destino demasiado cerca.', 'info');
                return;
            }
            if (dist > 200) {
                showToast(`Distancia de ${Math.round(dist)} km. Esta sección es para trayectos urbanos.`, 'warning');
                return;
            }

            setFromCoords(from);
            setToCoords(to);

            const [data] = await Promise.all([
                transportService.compare(from.lat, from.lon, to.lat, to.lon, {
                    origin: fromQuery,
                    destination: toQuery,
                    equipaje,
                    horaLlegada: horaLlegada || null
                }),
                fetchRoute(from, to)
            ]);

            if (!data?.data?.opciones) {
                showToast('La IA no ha podido generar recomendaciones.', 'warning');
                setResult(data?.data || null);
            } else {
                setResult(data.data);
                showToast('Opciones de transporte listas', 'success');
            }
        } catch (err: any) {
            const msgs: Record<string, 'warning' | 'info' | 'error'> = {
                TOO_FAR: 'warning', TOO_CLOSE: 'info',
                INVALID_COORDS: 'error', MISSING_COORDS: 'error'
            };
            showToast(err.message || 'Error al obtener opciones.', msgs[err.code] || 'error');
        } finally {
            setLoading(false);
        }
    };

    return {
        mode, changeMode,
        alojamiento,
        aeropuerto,
        aeropuertoDisplay,
        handleAeropuertoChange,
        equipaje, setEquipaje,
        horaLlegada, setHoraLlegada,
        loading, compare,
        result, fromCoords, toCoords, routePoints,
        toasts, removeToast, showToast
    };
};